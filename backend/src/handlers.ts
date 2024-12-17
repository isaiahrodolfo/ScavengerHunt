import { Room, rooms } from './types';
import {
  checkIfRoomDoesNotExist,
  checkIfRoomExists,
  checkIfInAnyRoom,
  checkIfNotHost,
  checkIfInThisRoom,
  checkIfHost,
  getRoomOfUser,
} from './handler-helpers';

/**
 * Handles room creation.
 */
export function handleCreateRoom(roomCode: string, callback: any, socket: any) {
  // Check that there is no room with the same code
  if (checkIfRoomExists(roomCode, callback)) return;

  // Check that user is not in any room
  if (checkIfInAnyRoom(socket.id, callback)) return;

  // Create the room
  rooms[roomCode] = {
    code: roomCode,
    host: socket.id,
    players: new Set([socket.id]),
    started: false
  };

  socket.join(roomCode);
  console.log(`Room ${roomCode} created by ${socket.id}`);

  callback({ success: true });
}

/**
 * Handles joining a room.
 */
export function handleJoinRoom(roomCode: string, callback: any, socket: any) {
  // Check that the room exists
  if (checkIfRoomDoesNotExist(roomCode, callback)) return;

  // Check that user is not already in any room
  if (checkIfInAnyRoom(socket.id, callback)) return;

  // Add the user to the room
  rooms[roomCode].players.add(socket.id);
  socket.join(roomCode);
  console.log(`User ${socket.id} joined room ${roomCode}`);

  callback({ success: true });
}

/**
 * Handles starting a room.
 */
export function handleStartRoom(roomCode: string, callback: any, socket: any) {
  // Ensure the room exists
  if (checkIfRoomDoesNotExist(roomCode, callback)) return;

  // Ensure the user is the host
  if (checkIfNotHost(roomCode, callback, socket.id)) return;

  // Ensure the room has players (including the host)
  if (rooms[roomCode].players.size === 0) {
    callback({ success: false, message: 'Cannot start a room with no players' });
    return;
  }

  // Ensure the room is not already started
  if (rooms[roomCode].started) {
    callback({ success: false, message: 'Room has already started' });
    return;
  }

  // Start the room
  rooms[roomCode].started = true;

  // Emit the "startGame" event to all users in the room
  socket.to(roomCode).emit("startGame");

  // Log the action for debugging
  console.log(`Room ${roomCode} started by host ${socket.id}`);

  // Callback with success message
  callback({ success: true });
}


/**
 * Handles closing a room.
 */
export function handleCloseRoom(roomCode: string, callback: any, socket: any) {
  if (checkIfRoomDoesNotExist(roomCode, callback)) return;

  if (checkIfNotHost(roomCode, callback, socket.id)) return;

  delete rooms[roomCode];
  socket.to(roomCode).emit('exitRoom');
  socket.leave(roomCode);
  console.log(`Room ${roomCode} closed by ${socket.id}`);
  callback({ success: true });
}

/**
 * Handles exiting a room.
 */
export function handleExitRoom(roomCode: string, callback: any, socket: any, roomIsClosed: boolean) {

  // If room is already closed by host, no need to check this
  if (!roomIsClosed) {
    // Check if there is a room to exit
    if (checkIfRoomDoesNotExist(roomCode, callback)) return;

    // Check if user is the host
    if (checkIfHost(roomCode, callback, socket.id)) return;

  } else {
    // Check if user is the host
    if (checkIfHost(roomCode, callback, socket.id)) {
      // If user is host and room is to be closed, close the room
      handleCloseRoom(roomCode, callback, socket);
      return;
    }
  }

  // A user can only exit this room if it is a player of it
  if (checkIfInThisRoom(roomCode, callback, socket.id)) return;

  // Remove from rooms list as player
  rooms[roomCode].players.delete(socket.id);

  // Exit socket room
  socket.leave(roomCode);

  // Message
  console.log(`Room with code ${roomCode} exited by user: ${socket.id}`);

  callback({ success: true });

}

/**
 * Handles exiting a room on disconnect.
 */
export function handleExitRoomOnDisconnect(socket: any) {

  // If the user is in a room, exit it
  const roomCode = getRoomOfUser(socket.id);
  if (roomCode) {
    // Dummy callback to handle silent cleanup
    const dummyCallback = () => {};

    // Call handleExitRoom for cleanup on disconnect
    handleExitRoom(roomCode, dummyCallback, socket, false);
  }
}
