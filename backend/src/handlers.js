"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateGame = handleCreateGame;
exports.handleJoinGame = handleJoinGame;
exports.handleStartGame = handleStartGame;
exports.handleCloseRoom = handleCloseRoom;
exports.handleExitRoom = handleExitRoom;
const types_1 = require("./types"); // Import types
const handler_helpers_1 = require("./handler-helpers");
;
function handleCreateGame(gameCode, id) {
    try {
        // Check that there is no game associated with that game code
        (0, handler_helpers_1.checkIfGameExists)(gameCode);
        // TODO: Randomly generated game codes can be duplicated!
        // A user cannot already be part of another room if they want to create this room
        (0, handler_helpers_1.checkIfInAnyRoom)(id);
        // Add to games list as host and player
        types_1.games[gameCode] = {
            code: gameCode,
            host: id,
            players: new Set([id])
        };
        // Message
        console.log(`Game with code ${gameCode} created by user: ${id}`);
    }
    catch (error) {
        console.error("Error creating game: ", error);
    }
    // Current state of the list
    console.log("games", types_1.games);
}
function handleJoinGame(gameCode, id) {
    try {
        // Check if there is a game to join
        (0, handler_helpers_1.checkIfGameDoesNotExist)(gameCode);
        // A user cannot already be part of another room if they want to join this room
        (0, handler_helpers_1.checkIfInAnyRoom)(id);
        // Add to games list as player
        types_1.games[gameCode].players.add(id);
        // Message
        console.log(`Game with code ${gameCode} joined by user: ${id}`);
    }
    catch (error) {
        console.error("Error joining game: ", error);
    }
    // Current state of the list
    console.log("games", types_1.games);
}
function handleStartGame(gameCode, id) {
    try {
        // Check that there is a game to be started
        (0, handler_helpers_1.checkIfGameDoesNotExist)(gameCode);
        // Check that the user is the host
        (0, handler_helpers_1.checkIfNotHost)(gameCode, id);
        // Message
        console.log(`Game with code ${gameCode} started by user: ${id}`);
    }
    catch (error) {
        console.error("Error starting game: ", error);
    }
    // Current state of the list
    console.log("games", types_1.games);
}
function handleCloseRoom(gameCode, id) {
    try {
        // Check if there is a room to close
        (0, handler_helpers_1.checkIfGameDoesNotExist)(gameCode);
        // Check if user is the host. (Only hosts can close games)
        (0, handler_helpers_1.checkIfNotHost)(gameCode, id);
        // Delete game
        delete types_1.games[gameCode];
        // Message
        console.log(`Game with code ${gameCode} closed by user: ${id}`);
    }
    catch (error) {
        console.error("Error closing room: ", error);
    }
    // Current state of the list
    console.log("games", types_1.games);
}
function handleExitRoom(gameCode, id) {
    try {
        // Check if there is a game to exit
        (0, handler_helpers_1.checkIfGameDoesNotExist)(gameCode);
        // A user can only exit this game if it is a player of it
        (0, handler_helpers_1.checkIfInThisRoom)(gameCode, id);
        // Remove from games list as player
        types_1.games[gameCode].players.delete(id);
        // Message
        console.log(`Game with code ${gameCode} join by user: ${id}`);
    }
    catch (error) {
        console.error("Error exiting room: ", error);
    }
    // Current state of the list
    console.log("games", types_1.games);
}
