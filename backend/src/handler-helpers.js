"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfRoomExists = checkIfRoomExists;
exports.checkIfRoomDoesNotExist = checkIfRoomDoesNotExist;
exports.checkIfInAnyRoom = checkIfInAnyRoom;
exports.checkIfInThisRoom = checkIfInThisRoom;
exports.checkIfNotHost = checkIfNotHost;
exports.getRoomOfUser = getRoomOfUser;
const types_1 = require("./types"); // Import types
/**
 * Checks if the room code already exists.
 */
function checkIfRoomExists(roomCode, callback) {
    const exists = !!types_1.rooms[roomCode];
    if (exists) {
        callback({ success: false, type: 'RoomExists' });
    }
    return exists;
}
/**
 * Checks if the room does not exist.
 */
function checkIfRoomDoesNotExist(roomCode, callback) {
    const notExists = !types_1.rooms[roomCode];
    if (notExists) {
        callback({ success: false, type: 'RoomDoesNotExist' });
    }
    return notExists;
}
/**
 * Checks if the user is in any room.
 */
function checkIfInAnyRoom(id, callback) {
    const roomCode = getRoomOfUser(id);
    if (roomCode) {
        callback({ success: false, type: 'AlreadyInRoom', roomCode });
        return true;
    }
    return false;
}
/**
 * Checks if the user is in this room.
 */
function checkIfInThisRoom(roomCode, callback, id) {
    // Check if the user is a player (or host) in the room
    const room = types_1.rooms[roomCode];
    if (room.host !== id && !room.players.has(id)) {
        callback({ success: false, type: 'AlreadyInThisRoom', roomCode });
        return true;
    }
    return false;
}
/**
 * Ensures the user is the host of the room.
 */
function checkIfNotHost(roomCode, callback, socketId) {
    if (types_1.rooms[roomCode].host !== socketId) {
        callback({ success: false, type: 'NotHost', message: 'Only the host can perform this action.' });
        return true;
    }
    return false;
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
