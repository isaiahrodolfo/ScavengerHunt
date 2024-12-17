import { AlreadyInSomeRoomError, AlreadyInThisRoomError, NotHostError, RoomAlreadyExistsError, RoomDoesNotExistError } from './errors';
import { Room, rooms } from './types'; // Import types

/**
 * Checks if the room code already exists.
 */
export function checkIfRoomExists(roomCode: string, callback: any): boolean {
  const exists = !!rooms[roomCode];
  if (exists) {
    callback({ success: false, type: 'RoomExists' });
  }
  return exists;
}

/**
 * Checks if the room does not exist.
 */
export function checkIfRoomDoesNotExist(roomCode: string, callback: any): boolean {
  const notExists = !rooms[roomCode];
  if (notExists) {
    callback({ success: false, type: 'RoomDoesNotExist' });
  }
  return notExists;
}

/**
 * Checks if the user is in any room.
 */
export function checkIfInAnyRoom(id: string, callback: any): boolean {
  const roomCode = getRoomOfUser(id);
  if (roomCode) {
    callback({ success: false, type: 'AlreadyInRoom', roomCode });
    return true;
  }
  return false;
}

/**
 * Checks if the user is in this room.
 */
export function checkIfInThisRoom(roomCode: string, callback: any, id: string): boolean {
  // Check if the user is a player (or host) in the room
  const room = rooms[roomCode];
  if (room.host !== id && !room.players.has(id)) {
    callback({ success: false, type: 'AlreadyInThisRoom', roomCode });
    return true;
  }
  return false;
}

/**
 * Ensures the user is the host of the room.
 */
export function checkIfNotHost(roomCode: string, callback: any, socketId: string): boolean {
  if (rooms[roomCode].host !== socketId) {
    callback({ success: false, type: 'NotHost', message: 'Only the host can perform this action.' });
    return true;
  }
  return false;
}

/**
 * Ensures the user is not the host of the room.
 */
export function checkIfHost(roomCode: string, callback: any, socketId: string): boolean {
  if (rooms[roomCode].host == socketId) {
    callback({ success: false, type: 'Host', message: 'Only non-host players can perform this action.' });
    return true;
  }
  return false;
}

/**
 * Gets the room of the given user
 * @param id 
 * @returns string if room exists, undefined otherwise
 */

export function getRoomOfUser(id: string): (string | undefined) {
  const existingRoom = Object.values(rooms).find((room) => room.players.has(id));

  return existingRoom?.code; // Returns the room code or undefined  
}
