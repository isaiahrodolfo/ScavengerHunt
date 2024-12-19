import { checkIfRoomDoesNotExist } from '../handler-helpers';
import { Callback, ImageAndLocation, Room, rooms } from '../types';

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

  // SEND NEW DATA TO MODERATOR
  // if (room.hostIsModerator) { // testing no moderator
    socket.to(room.host).emit('insertImage', imageAndLocation, socket.id);
    // socket.broadcast.emit('insertImage', imageAndLocation, socket.id);
    // socket.to(roomCode)emit('insertImage', imageAndLocation, socket.id);
  // }

  // Invoke the callback to notify success
  callback({ success: true });
}
