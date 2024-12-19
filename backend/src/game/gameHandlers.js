"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInsertImage = handleInsertImage;
const handler_helpers_1 = require("../handler-helpers");
const types_1 = require("../types");
/**
 * Handles image insertion.
 */
function handleInsertImage(roomCode, imageAndLocation, callback, socket) {
    const { imageUri, categoryIndex, imageIndex } = imageAndLocation;
    if ((0, handler_helpers_1.checkIfRoomDoesNotExist)(roomCode, callback))
        return;
    const room = types_1.rooms[roomCode];
    // TODO: Create a handler helper to check if player does not exist
    // Ensure gameData exists for the socket ID 
    if (!room.gameData[socket.id]) {
        callback({ success: false, type: 'UserNotFound', error: 'User not found in gameData' });
        return;
    }
    const playerData = room.gameData[socket.id];
    // Update the specific location
    const updatedCategory = [...playerData[categoryIndex]];
    updatedCategory[imageIndex] = {
        image: imageUri,
        status: 'unchecked', // Reset status after update
    };
    // Update the player's gameData
    const updatedGameData = Object.assign(Object.assign({}, room.gameData), { [socket.id]: [
            ...playerData.slice(0, categoryIndex),
            updatedCategory,
            ...playerData.slice(categoryIndex + 1),
        ] });
    // Update the room's gameData
    types_1.rooms[roomCode] = Object.assign(Object.assign({}, room), { gameData: updatedGameData });
    if (room.hostIsModerator) { // testing no moderator
        const emitTo = room.host;
        console.log('emit updateUserProgress to room host:', emitTo);
        socket.to(emitTo).emit('updateProgress', imageAndLocation, socket.id);
    }
    // Invoke the callback to notify success
    callback({ success: true });
}
