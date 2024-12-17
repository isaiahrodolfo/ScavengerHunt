"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfRoomExists = checkIfRoomExists;
exports.checkIfRoomDoesNotExist = checkIfRoomDoesNotExist;
exports.checkIfNotHost = checkIfNotHost;
exports.getRoomOfUser = getRoomOfUser;
exports.checkIfInAnyRoom = checkIfInAnyRoom;
exports.checkIfInThisRoom = checkIfInThisRoom;
const errors_1 = require("./errors");
const types_1 = require("./types"); // Import types
/**
 * Checks if the room code does not have an existing room associated with it
 * @param roomCode
 * @returns Error if a room with given room code is found
 */
function checkIfRoomExists(roomCode, callback) {
    if (Object.values(types_1.rooms).find((room) => room.code === roomCode)) {
        console.log(`No room exists with code ${roomCode}.`);
        callback({ success: false, type: 'RoomExists' });
        return true;
    }
    else {
        return false;
    }
}
/**
 * Checks if the room code has an existing room associated with it
 * @param roomCode
 * @returns Error if no room with given room code is found
 */
function checkIfRoomDoesNotExist(roomCode, callback) {
    if (!Object.values(types_1.rooms).find((room) => room.code === roomCode)) {
        console.log(`No room exists with code ${roomCode}.`);
        callback({ success: false, type: 'RoomDoesNotExist' });
        return true;
    }
    else {
        return false;
    }
}
/**
 * Checks if user is the host of the room with the given room id. If not, returns error
 * @param roomCode
 * @param id
 * @returns Error if user is not the host
 */
function checkIfNotHost(roomCode, id) {
    if (types_1.rooms[roomCode].host != id) {
        throw Error(`User ${id} cannot start room with code ${roomCode} since user is not the host.`);
    }
}
/**
 * Gets the room of the given user
 * @param id
 * @returns string if room exists, undefined otherwise
 */
function getRoomOfUser(id) {
    const existingRoom = Object.values(types_1.rooms).find((room) => room.players.has(id));
    return existingRoom === null || existingRoom === void 0 ? void 0 : existingRoom.code; // Returns the room code or undefined  
}
/**
 * Checks if the user is already a host or player in any room
 * @param id
 * @returns Error if user is already in a room
 */
function checkIfInAnyRoom(id, callback) {
    const roomCode = getRoomOfUser(id);
    if (roomCode) {
        console.log(`User ${id} is already part of room ${roomCode}.`);
        callback({ success: false, type: 'AlreadyInRoom' });
        return true;
    }
    else {
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
function checkIfInThisRoom(roomCode, id) {
    // Check if the user is the host or a player in the room
    const room = types_1.rooms[roomCode];
    if (room.host !== id && !room.players.has(id)) {
        throw new errors_1.AlreadyInThisRoomError(`User ${id} is not part of the room with code ${roomCode}.`);
    }
}
