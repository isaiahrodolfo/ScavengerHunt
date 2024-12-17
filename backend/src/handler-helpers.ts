import { AlreadyInSomeRoomError, AlreadyInThisRoomError, NotHostError, RoomAlreadyExistsError, RoomDoesNotExistError } from './errors';
import { Room, rooms } from './types'; // Import types

/**
 * Checks if the room code does not have an existing room associated with it
 * @param roomCode 
 * @returns Error if a room with given room code is found
 */

export function checkIfRoomExists(roomCode: string, callback: any): (any | void) {
  if (Object.values(rooms).find((room) => room.code === roomCode)) {
    console.log(`No room exists with code ${roomCode}.`);
    callback({ success: false, type: 'RoomExists' });
    return true;
  } else {
    return false;
  }
}

/**
 * Checks if the room code has an existing room associated with it
 * @param roomCode 
 * @returns Error if no room with given room code is found
 */

export function checkIfRoomDoesNotExist(roomCode: string, callback: any): (any | void) {
  if (!Object.values(rooms).find((room) => room.code === roomCode)) {
    console.log(`No room exists with code ${roomCode}.`);
    callback({ success: false, type: 'RoomDoesNotExist' });
    return true;
  } else {
    return false;
  }
}

/**
 * Checks if user is the host of the room with the given room id. If not, returns error
 * @param roomCode 
 * @param id 
 * @returns Error if user is not the host
 */

export function checkIfNotHost(roomCode: string, id: string): (NotHostError | void) {
  if (rooms[roomCode].host != id) {
    throw Error(`User ${id} cannot start room with code ${roomCode} since user is not the host.`);
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
 * Checks if the user is already a host or player in any room
 * @param id 
 * @returns Error if user is already in a room
 */

export function checkIfInAnyRoom(id: string, callback: any): (any | void) {
  const roomCode = getRoomOfUser(id);

  if (roomCode) {
    console.log(`User ${id} is already part of room ${roomCode}.`);
    callback({ success: false, type: 'AlreadyInRoom' });
    return true;
  } else {
    console.log(`User ${id} is not part of any room.`);
    return false;
  }
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
