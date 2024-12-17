import { Room, rooms } from './types'; // Import types
import { checkIfRoomDoesNotExist, checkIfRoomExists, checkIfInAnyRoom, checkIfInThisRoom, checkIfNotHost, getRoomOfUser } from './handler-helpers';
import { AlreadyInSomeRoomError, RoomDoesNotExistError } from './errors';
import { Socket } from 'socket.io';

export function handleCreateRoom(roomCode: string, callback: any, socket: any) {

  // Check that there is no room associated with that room code
  if (checkIfRoomExists(roomCode, callback)) return; // TODO: Randomly generated room codes may not be unique

  // A user cannot already be part of another room if they want to create this room
  if (checkIfInAnyRoom(socket.id, callback)) return;

  // Add to rooms list as host and player
  rooms[roomCode] = {
    code: roomCode,
    host: socket.id,
    players: new Set([socket.id])
  }
  socket.join(roomCode);

  // Message
  console.log(`Room with code ${roomCode} created by user: ${socket.id}`);

  // Success
  callback({ success: true });

  // logState(socket);

}

export function handleJoinRoom(roomCode: string, callback: any, socket: any) {

  // If the given room does not exist, user cannot join it
  if (checkIfRoomDoesNotExist(roomCode, callback)) return;
  // If user is already in a room, they cannot join this one
  if (checkIfInAnyRoom(socket.id, callback)) return;

  // Add player to room
  rooms[roomCode].players.add(socket.id);
  socket.join(roomCode);

  // Success
  callback({ success: true });

}

export function handleStartRoom(roomCode: string, callback: any, socket: any) {

  try {
    // Check that there is a room to be started
    checkIfRoomDoesNotExist(roomCode, callback);

    // Check that the user is the host
    checkIfNotHost(roomCode, socket.id);

    socket.to(roomCode).emit("startGame");

    // Message
    console.log(`Room with code ${roomCode} started by user: ${socket.id}`);

  } catch (error) {
    console.error("Error starting room: ", error);
  }

  logState(socket);  

}

export function handleCloseRoom(roomCode: string, callback: any, socket: any) {

  try {
    // Check if there is a room to close
    checkIfRoomDoesNotExist(roomCode, callback);

    // Check if user is the host. (Only hosts can close rooms)
    checkIfNotHost(roomCode, socket.id);

    // Delete room
    delete rooms[roomCode];

    // Emit message, tell others to leave room
    socket.to(roomCode).emit('exitRoom'); // To client

    // Leave room
    socket.leave(roomCode);

    // Message
    console.log(`Room with code ${roomCode} closed by user: ${socket.id}`);
  } catch (error) {
    console.error("Error closing room: ", error);
  }

  logState(socket);  

}

export function handleExitRoom(roomCode: string, callback: any, socket: any, roomIsClosed: boolean) {

  try {

    // If room is already closed by host, no need to check this
    if (!roomIsClosed) {
      // Check if there is a room to exit
      checkIfRoomDoesNotExist(roomCode, callback);
    }

    // A user can only exit this room if it is a player of it
    checkIfInThisRoom(roomCode, socket.id);

    // Remove from rooms list as player
    rooms[roomCode].players.delete(socket.id);

    // Exit socket room
    socket.leave(roomCode);

    // Message
    console.log(`Room with code ${roomCode} exited by user: ${socket.id}`);

  } catch (error) {
    console.error("Error exiting room: ", error);
  }

  logState(socket);  

}

export function handleExitRoomOnDisconnect(socket: any) {
  // If user has joined a room, leave it before disconnecting
  const roomCode = getRoomOfUser(socket.id);
  if (roomCode) {
    try {
      // A user can only exit this room if it is a player of it
      checkIfInThisRoom(roomCode, socket.id); // returns callback, but unused

      // Remove from rooms list as player
      rooms[roomCode].players.delete(socket.id);

      // Exit socket room
      socket.leave(roomCode);

      // Message
      console.log(`Room with code ${roomCode} exited by user: ${socket.id}`);

    } catch (error) {
      console.error("Error exiting room: ", error);
    }
  }
}

export function logState(socket: any) {
  // Current state of the list
  console.log("rooms", rooms);
  console.log(`Rooms for socket ${socket.id}:`, socket.rooms); // Log rooms the socket is in  
}
