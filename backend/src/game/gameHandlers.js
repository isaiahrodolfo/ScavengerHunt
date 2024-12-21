"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInsertImage = handleInsertImage;
exports.handleGetPlayerData = handleGetPlayerData;
exports.handleNavigateToPlayerList = handleNavigateToPlayerList;
exports.handleSetImageStatus = handleSetImageStatus;
exports.handleDeclareWinner = handleDeclareWinner;
const handler_helpers_1 = require("../handler-helpers");
const types_1 = require("../types");
const gameHandlerHelpers_1 = require("./gameHandlerHelpers");
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
    // If image index is not given, push the image onto the end of the array
    if (typeof imageIndex == 'undefined') {
        room.gameData[socket.id][categoryIndex].push({
            imageUri: imageUri, // Image index should exist here
            status: 'unchecked', // Reset status after update
        });
        // Otherwise, put the image at the exact location specified
    }
    else if (typeof imageIndex == 'number') {
        room.gameData[socket.id][categoryIndex][imageIndex] = {
            imageUri: imageUri, // Image index should exist here
            status: 'unchecked', // Reset status after update
        };
    }
    types_1.rooms[roomCode].gameProgress[socket.id] = (0, gameHandlerHelpers_1.calculateProgress)(roomCode, socket.id);
    if (room.hostIsModerator) { // TODO: Test when there is no moderator, if this still runs
        const hostId = room.host;
        console.log('emit updateProgress to room host:', hostId);
        socket.to(hostId).emit('updateProgress', types_1.rooms[roomCode].gameProgress);
        // If the host is on the player's page, update the host's player data so there will be dynamic changes
        if (types_1.rooms[roomCode].hostOnPlayerPage == socket.id) {
            socket.to(hostId).emit('getPlayerData', types_1.rooms[roomCode].gameData[socket.id]); // TODO: Use the updated const instead of going back into the whole thing
        }
    }
    // Invoke the callback to notify success
    callback({ success: true });
}
/**
 * Handles getting a player's whole record from the database (images, status, locations).
 */
function handleGetPlayerData(roomCode, id, callback) {
    if ((0, handler_helpers_1.checkIfRoomDoesNotExist)(roomCode, callback))
        return;
    const room = types_1.rooms[roomCode];
    // TODO: Create a handler helper to check if player does not exist
    // Ensure gameData exists for the given id 
    if (!room.gameData[id]) {
        callback({ success: false, type: 'UserNotFound', error: 'User not found in gameData' });
        return;
    }
    // Host is on current page
    types_1.rooms[roomCode].hostOnPlayerPage = id;
    callback({ success: true, data: types_1.rooms[roomCode].gameData[id] }); // Return player data
}
/**
 * Handles setting the host's page it's looking at to the Player List page
 */
function handleNavigateToPlayerList(roomCode, callback) {
    if ((0, handler_helpers_1.checkIfRoomDoesNotExist)(roomCode, callback))
        return;
    // const room = rooms[roomCode];
    // Host is on player page (reset)
    types_1.rooms[roomCode].hostOnPlayerPage = '';
    callback({ success: true }); // Return player data
}
function handleSetImageStatus(roomCode, id, location, status, callback, socket) {
    const { categoryIndex, imageIndex } = location;
    if ((0, handler_helpers_1.checkIfRoomDoesNotExist)(roomCode, callback))
        return;
    const room = types_1.rooms[roomCode];
    // TODO: Create a handler helper to check if player does not exist
    // Ensure gameData exists for the given id
    if (!room.gameData[id]) {
        callback({ success: false, type: 'UserNotFound', error: 'User not found in gameData' });
        return;
    }
    const playerData = room.gameData[id];
    // Update the specific location
    const updatedCategory = [...playerData[categoryIndex]];
    updatedCategory[imageIndex] = Object.assign(Object.assign({}, updatedCategory[imageIndex]), { status });
    // Update the player's gameData
    const updatedGameData = Object.assign(Object.assign({}, room.gameData), { [id]: [
            ...playerData.slice(0, categoryIndex),
            updatedCategory,
            ...playerData.slice(categoryIndex + 1),
        ] });
    // Update the room's gameData
    types_1.rooms[roomCode] = Object.assign(Object.assign({}, room), { gameData: updatedGameData });
    // ??? I don't have to calculate the progress, do I?
    types_1.rooms[roomCode].gameProgress[id] = (0, gameHandlerHelpers_1.calculateProgress)(roomCode, id);
    const playerProgress = types_1.rooms[roomCode].gameData[id];
    // If the host is on the player's page, update the host's player data so there will be dynamic changes
    if (types_1.rooms[roomCode].hostOnPlayerPage == id) {
        socket.emit('getPlayerData', playerProgress); // TODO: Use the updated const instead of going back into the whole thing
    }
    // Update the player with the new statuses of their images
    socket.to(id).emit('getPlayerData', playerProgress);
    // Invoke the callback to notify success
    callback({ success: true, data: types_1.rooms[roomCode].gameProgress });
}
function handleDeclareWinner(roomCode, id, callback, socket) {
    // TODO: Add error handlers here
    // Reset game
    types_1.rooms[roomCode] = Object.assign(Object.assign({}, types_1.rooms[roomCode]), { gameData: {}, gameProgress: {}, hostOnPlayerPage: '' });
    // Get profile of winner
    types_1.rooms[roomCode].players[id];
    // TODO: Return the progress for all players
    socket.to(roomCode).emit('declareWinner', types_1.rooms[roomCode].players[id]); // Return with the winner
    callback({ success: true });
}
