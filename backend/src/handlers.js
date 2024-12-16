"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateGame = handleCreateGame;
exports.handleJoinGame = handleJoinGame;
exports.handleStartGame = handleStartGame;
exports.handleCloseGame = handleCloseGame;
const types_1 = require("./types"); // Import types
function handleCreateGame(gameCode, id) {
    try {
        // Check if the user is already a host or player in any game
        const existingGame = Object.values(types_1.games).find((game) => game.host === id || game.players.some((pid) => pid === id));
        if (existingGame) {
            return Error(`User ${id} is already part of game ${existingGame.code}`);
        }
        // Add to games list as host and player
        types_1.games[gameCode] = {
            code: gameCode,
            host: id,
            players: [id]
        };
        // Message
        console.log(`Game with code ${gameCode} created by user: ${id}`);
    }
    catch (error) {
        console.error("Error: ", error);
    }
    // Current state of the list
    console.log("games", types_1.games);
}
function handleJoinGame(gameCode, id) {
    // Check if the user is already a host or player in any game
    const existingGame = Object.values(types_1.games).find((game) => game.host === id || game.players.some((pid) => pid === id));
    if (existingGame) {
        console.error(`User ${id} is already part of game ${existingGame.code}`);
        return;
    }
    try {
        // Add to games list as player
        types_1.games[gameCode].players.push(id);
    }
    catch (error) {
        console.error(`Error: game with code ${gameCode} does not exist`);
    }
    // Message
    console.log(`Game with code ${gameCode} join by user: ${id}`);
    // Current state of the list
    console.log("games", types_1.games);
}
function handleStartGame(gameCode, id) {
    // Check if user is the host. (Only hosts can start games)
    if (types_1.games[gameCode].host != id) {
        console.error(`User ${id} cannot start game with code ${gameCode} since user is not the host`);
        return;
    }
    // Message
    console.log(`Game with code ${gameCode} started by user: ${id}`);
    // Current state of the list
    console.log("games", types_1.games);
}
function handleCloseGame(gameCode, id) {
    try {
        // Check if there is a game that can be closed
        if (Object.values(types_1.games).find((game) => game.code === gameCode)) {
            return Error(`No game exists with code ${gameCode}`);
        }
        // Check if user is the host. (Only hosts can close games)
        if (types_1.games[gameCode].host != id) {
            return Error(`User ${id} cannot start game with code ${gameCode} since user is not the host`);
        }
        // Delete game
        delete types_1.games[gameCode];
        // Message
        console.log(`Game with code ${gameCode} closed by user: ${id}`);
    }
    catch (error) {
        console.error("Error: ", error);
    }
    // Current state of the list
    console.log("games", types_1.games);
}
