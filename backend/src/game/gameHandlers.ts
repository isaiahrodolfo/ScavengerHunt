import { checkIfRoomDoesNotExist } from '../handler-helpers';
import { Callback, ImageAndLocation, Room, rooms, Status } from '../types';
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

  // If image index is not given, push the image onto the end of the array
  if (typeof imageIndex == 'undefined') {
    room.gameData[socket.id][categoryIndex].push({ 
      imageUri: imageUri, // Image index should exist here
      status: 'unchecked', // Reset status after update
    }
  );
  // Otherwise, put the image at the exact location specified
  } else if (typeof imageIndex == 'number') {
    room.gameData[socket.id][categoryIndex][imageIndex] = {
      imageUri: imageUri, // Image index should exist here
      status: 'unchecked', // Reset status after update
    }
  }

  rooms[roomCode].gameProgress[socket.id] = calculateProgress(roomCode, socket.id);

  if (room.hostIsModerator) { // TODO: Test when there is no moderator, if this still runs
    const hostId = room.host;
    
    console.log('emit updateProgress to room host:', hostId)
    socket.to(hostId).emit('updateProgress', rooms[roomCode].gameProgress);

    // If the host is on the player's page, update the host's player data so there will be dynamic changes
    if (rooms[roomCode].hostOnPlayerPage) {
       socket.to(hostId).emit('getPlayerData', rooms[roomCode].gameData[socket.id]); // TODO: Use the updated const instead of going back into the whole thing
    }
  }

  // Invoke the callback to notify success
  callback({ success: true });
  
}

/**
 * Handles getting a player's whole record from the database (images, status, locations).
 */
export function handleGetPlayerData(roomCode: string, id: string, callback: Callback) {

  if (checkIfRoomDoesNotExist(roomCode, callback)) return;

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

export function handleSetImageStatus(roomCode: string, id: string, location: {categoryIndex: number, imageIndex: number}, status: Status, callback: Callback, socket: any) {

  const {categoryIndex, imageIndex} = location;

  if(checkIfRoomDoesNotExist(roomCode, callback)) return;

  const room = rooms[roomCode];

  // TODO: Create a handler helper to check if player does not exist
  // Ensure gameData exists for the given id
  if (!room.gameData[id]) {
    callback({ success: false, type: 'UserNotFound', error: 'User not found in gameData' });
    return;
  }

  const playerData = room.gameData[id];

  // Update the specific location
  const updatedCategory = [...playerData[categoryIndex]];
  updatedCategory[imageIndex!] = { // Image index should exist here
    ...updatedCategory[imageIndex!],
    status, // UPDATE THE STATUS
  };
  
  // Update the player's gameData
  const updatedGameData = {
    ...room.gameData,
    [id]: [
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

  // ??? I don't have to calculate the progress, do I?
  rooms[roomCode].gameProgress[id] = calculateProgress(roomCode, id);

  const playerProgress = rooms[roomCode].gameData[id];

  // If the host is on the player's page, update the host's player data so there will be dynamic changes
  if (rooms[roomCode].hostOnPlayerPage) {
    socket.emit('getPlayerData', playerProgress); // TODO: Use the updated const instead of going back into the whole thing
  }

  // Update the player with the new statuses of their images
  socket.to(id).emit('getPlayerData', playerProgress);

  // Invoke the callback to notify success
  callback({ success: true, data: rooms[roomCode].gameProgress});
}