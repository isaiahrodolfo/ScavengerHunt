import { checkIfRoomDoesNotExist } from '../handler-helpers';
import { Callback, ImageAndLocation, Room, rooms } from '../types';
import { calculateProgress } from './gameHandlerHelpers';

/**
 * Handles image insertion.
 */
export function handleInsertImage(roomCode: string, imageAndLocation: ImageAndLocation, callback: Callback, socket: any) {

  const { imageUri, categoryIndex, imageIndex } = imageAndLocation;

  if(checkIfRoomDoesNotExist(roomCode, callback)) return;

  const room = rooms[roomCode];

  // TODO: Create a handler helper to check if player does not exist
  // Ensure gameData exists for the socket ID 
  if (!room.gameData[socket.id]) {
    callback({ success: false, type: 'UserNotFound', error: 'User not found in gameData' });
    return;
  }

  const playerData = room.gameData[socket.id];

  // Update the specific location
  const updatedCategory = [...playerData[categoryIndex]];
  updatedCategory[imageIndex!] = { // Image index should exist here
    image: imageUri,
    status: 'unchecked', // Reset status after update
  };
  
  // Update the player's gameData
  const updatedGameData = {
    ...room.gameData,
    [socket.id]: [
      ...playerData.slice(0, categoryIndex),
      updatedCategory,
      ...playerData.slice(categoryIndex + 1),
    ],
  };

  // Update the room's gameData
  rooms[roomCode] = {
    ...room,
    gameData: updatedGameData,
  };

  rooms[roomCode].gameProgress[socket.id] = calculateProgress(roomCode, socket.id);

  if (room.hostIsModerator) { // testing no moderator
    const emitTo = room.host;
    
    console.log('emit updateProgress to room host:', emitTo)
    socket.to(emitTo).emit('updateProgress', rooms[roomCode].gameProgress);
  }

  // Invoke the callback to notify success
  callback({ success: true });
  
}

/**
 * Handles getting a player's whole record from the database (images, status, locations).
 */
export function handleGetPlayerData(roomCode: string, id: string, callback: Callback) {

  if(checkIfRoomDoesNotExist(roomCode, callback)) return;

  const room = rooms[roomCode];

  // TODO: Create a handler helper to check if player does not exist
  // Ensure gameData exists for the given id 
  if (!room.gameData[id]) {
    callback({ success: false, type: 'UserNotFound', error: 'User not found in gameData' });
    return;
  }

  // Host is on current page
  rooms[roomCode].hostOnPlayerPage = id;

  callback({success: true, data: rooms[roomCode].gameData[id]}); // Return player data
}

/**
 * Handles setting the host's page it's looking at to the Player List page
 */
export function handleNavigateToPlayerList(roomCode: string, callback: Callback) {

  if(checkIfRoomDoesNotExist(roomCode, callback)) return;

  const room = rooms[roomCode];

  // Host is on player page (reset)
  rooms[roomCode].hostOnPlayerPage = '';

  callback({success: true}); // Return player data
}