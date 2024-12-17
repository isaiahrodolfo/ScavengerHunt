import { Room, rooms } from './types';
import {
  checkIfRoomDoesNotExist,
  checkIfRoomExists,
  checkIfInAnyRoom,
  checkIfNotHost,
  checkIfInThisRoom,
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
  if (checkIfRoomDoesNotExist(roomCode, callback)) return;

  if (checkIfNotHost(roomCode, callback, socket.id)) return;

  socket.to(roomCode).emit("startGame");
  console.log(`Room ${roomCode} started by host ${socket.id}`);
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