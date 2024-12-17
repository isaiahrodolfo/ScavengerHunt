import { Room, rooms } from './types';
import {
  checkIfRoomDoesNotExist,
  checkIfRoomExists,
  checkIfInAnyRoom,
  checkIfNotHost,
  checkIfInThisRoom,
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

  try {
    checkIfNotHost(roomCode, socket.id);
    socket.to(roomCode).emit("startGame");
    console.log(`Room ${roomCode} started by host ${socket.id}`);
    callback({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      callback({ success: false, type: 'NotHost', message: error.message });
    } else {
      callback({ success: false, type: 'UnknownError', message: 'An unknown error occurred.' });
    }
  }
}

/**
 * Handles closing a room.
 */
export function handleCloseRoom(roomCode: string, callback: any, socket: any) {
  if (checkIfRoomDoesNotExist(roomCode, callback)) return;

  try {
    checkIfNotHost(roomCode, socket.id);
    delete rooms[roomCode];
    socket.to(roomCode).emit('exitRoom');
    socket.leave(roomCode);
    console.log(`Room ${roomCode} closed by ${socket.id}`);
    callback({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      callback({ success: false, type: 'NotHost', message: error.message });
    } else {
      callback({ success: false, type: 'UnknownError', message: 'An unknown error occurred.' });
    }
  }
}
