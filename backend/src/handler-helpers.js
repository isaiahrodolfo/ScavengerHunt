"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfGameExists = checkIfGameExists;
exports.checkIfGameDoesNotExist = checkIfGameDoesNotExist;
exports.checkIfNotHost = checkIfNotHost;
exports.checkIfInAnyRoom = checkIfInAnyRoom;
exports.checkIfInThisRoom = checkIfInThisRoom;
const types_1 = require("./types"); // Import types
/**
 * Checks if the game code does not have an existing room associated with it
 * @param gameCode
 * @returns Error if a game with given game code is found
 */
function checkIfGameExists(gameCode) {
    if (Object.values(types_1.games).find((game) => game.code === gameCode)) {
        console.log(`A game already exists with code ${gameCode}.`);
        throw Error(`A game already exists with code ${gameCode}.`);
    }
}
/**
 * Checks if the game code has an existing room associated with it
 * @param gameCode
 * @returns Error if no game with given game code is found
 */
function checkIfGameDoesNotExist(gameCode) {
    if (!Object.values(types_1.games).find((game) => game.code === gameCode)) {
        console.log(`No game exists with code ${gameCode}.`);
        throw Error(`No game exists with code ${gameCode}.`);
    }
}
/**
 * Checks if user is the host of the room with the given room id. If not, returns error
 * @param gameCode
 * @param id
 * @returns Error if user is not the host
 */
function checkIfNotHost(gameCode, id) {
    if (types_1.games[gameCode].host != id) {
        throw Error(`User ${id} cannot start game with code ${gameCode} since user is not the host.`);
    }
}
/**
 * Checks if the user is already a host or player in any room
 * @param id
 * @returns Error if user is already in a room
 */
function checkIfInAnyRoom(id) {
    const existingGame = Object.values(types_1.games).find((game) => game.players.has(id));
    if (existingGame) {
        throw Error(`User ${id} is already part of game ${existingGame.code}.`);
    }
}
/**
 * Checks if the user is already a host or player in the given room
 * @param gameCode
 * @param id
 * @returns Error if user is not in the given room
 */
function checkIfInThisRoom(gameCode, id) {
    // Check if the user is the host or a player in the room
    const game = types_1.games[gameCode];
    if (game.host !== id && !game.players.has(id)) {
        throw Error(`User ${id} is not part of the game with code ${gameCode}.`);
    }
}
