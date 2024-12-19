import { AlreadyInSomeRoomError, NotInThisRoomError, NotHostError, RoomAlreadyExistsError, RoomDoesNotExistError } from './room/roomErrors';
import { Callback, Room, rooms } from './types'; // Import types

/**
 * Throws an error if the room code already exists.
 */
export function checkIfRoomExists(roomCode: string, callback: Callback): boolean {
  if (typeof callback !== 'function') {
    console.error("Callback is not a function. Received:", callback);
    return true; // or handle this case gracefully
  }

  const exists = !!rooms[roomCode];
  if (exists) {
    callback({ success: false, type: 'RoomExists' });
  }
  return exists;
}

/**
 * Throws an error if the room does not exist.
 */
export function checkIfRoomDoesNotExist(roomCode: string, callback: Callback): boolean {
  if (typeof callback !== 'function') {
    console.error("Callback is not a function. Received:", callback);
    return true; // or handle this case gracefully
  }
  
  const notExists = !rooms[roomCode];
  if (notExists) {
    callback({ success: false, type: 'RoomDoesNotExist' });
  }
  return notExists;
}

/**
 * Throws an error if the user is in any room.
 */
export function checkIfInAnyRoom(id: string, callback: Callback): boolean {
  if (typeof callback !== 'function') {
    console.error("Callback is not a function. Received:", callback);
    return true; // or handle this case gracefully
  }

  const roomCode = getRoomOfUser(id);
  if (roomCode) {
    callback({ success: false, type: 'AlreadyInRoom', roomCode });
    return true;
  }
  return false;
}

/**
 * Throws an error if the user is not in this room.
 */
export function checkIfNotInThisRoom(roomCode: string, callback: Callback, id: string): boolean {
  if (typeof callback !== 'function') {
    console.error("Callback is not a function. Received:", callback);
    return true; // or handle this case gracefully
  }

  // Check if the user is a player (or host) in the room
  const room = rooms[roomCode];
  if (room.host !== id && !room.players.has(id)) {
    callback({ success: false, type: 'NotInThisRoom', roomCode });
    return true;
  }
  return false;
}

/**
 * Ensures the user is the host of the room.
 */
export function checkIfNotHost(roomCode: string, callback: Callback, socketId: string): boolean {
  if (typeof callback !== 'function') {
    console.error("Callback is not a function. Received:", callback);
    return true; // or handle this case gracefully
  }

  if (rooms[roomCode].host !== socketId) {
    callback({ success: false, type: 'NotHost', error: 'Only the host can perform this action.' });
    return true;
  }
  return false;
}

/**
 * Ensures the user is not the host of the room.
 */
export function checkIfHost(roomCode: string, callback: Callback, socketId: string): boolean {
  if (typeof callback !== 'function') {
    console.error("Callback is not a function. Received:", callback);
    return true; // or handle this case gracefully
  }
  
  if (rooms[roomCode].host == socketId) {
    callback({ success: false, type: 'Host', error: 'Only non-host players can perform this action.' });
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

/**
 * Logs state for testing
 */
export function logState(roomCode: string, socket: any) {
  const room = rooms[roomCode];

  if (!room) {
    console.log(`Room ${roomCode} does not exist.`);
    return;
  }

  console.log('\n'); // Newline
  console.log(`User with id: ${socket.id}`);
  console.log('Rooms of user: ', socket.rooms);
  console.log(`Room ${roomCode} state:`);
  console.log(`Players in room:`, [...room.players]); // Convert Set to Array for easier viewing

  console.log('Rooms: ', rooms);
  console.log('Game Data: ', rooms.gameData[socket.id]);
}