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
 * Ensures the user is the host of the room.
 */
export function checkIfNotHost(roomCode: string, id: string): (Error | void) {
  if (rooms[roomCode].host !== id) {
    throw new Error(`User ${id} is not the host of room ${roomCode}`);
  }
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
/**
 * Checks if the user is already a host or player in the given room
 * @param roomCode
 * @param id 
 * @returns Error if user is not in the given room
 */
export function checkIfInThisRoom(roomCode: string, id: string): (AlreadyInThisRoomError | void) {
  // Check if the user is the host or a player in the room
  const room = rooms[roomCode];
  if (room.host !== id && !room.players.has(id)) {
    throw new AlreadyInThisRoomError(`User ${id} is not part of the room with code ${roomCode}.`);
  }
}
