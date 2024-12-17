"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfRoomExists = checkIfRoomExists;
exports.checkIfRoomDoesNotExist = checkIfRoomDoesNotExist;
exports.checkIfInAnyRoom = checkIfInAnyRoom;
exports.checkIfNotInThisRoom = checkIfNotInThisRoom;
exports.checkIfNotHost = checkIfNotHost;
exports.checkIfHost = checkIfHost;
exports.getRoomOfUser = getRoomOfUser;
const types_1 = require("./types"); // Import types
/**
 * Checks if the room code already exists.
 */
function checkIfRoomExists(roomCode, callback) {
    if (typeof callback !== 'function') {
        console.error("Callback is not a function. Received:", callback);
        return true; // or handle this case gracefully
    }
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
    if (typeof callback !== 'function') {
        console.error("Callback is not a function. Received:", callback);
        return true; // or handle this case gracefully
    }
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
    if (typeof callback !== 'function') {
        console.error("Callback is not a function. Received:", callback);
        return true; // or handle this case gracefully
    }
    const roomCode = getRoomOfUser(id);
    if (roomCode) {
        callback({ success: false, type: 'AlreadyInRoom', roomCode });
        return true;
    }
    return false;
}
/**
 * Checks if the user is not in this room.
 */
function checkIfNotInThisRoom(roomCode, callback, id) {
    if (typeof callback !== 'function') {
        console.error("Callback is not a function. Received:", callback);
        return true; // or handle this case gracefully
    }
    // Check if the user is a player (or host) in the room
    const room = types_1.rooms[roomCode];
    if (room.host !== id && !room.players.has(id)) {
        callback({ success: false, type: 'NotInThisRoom', roomCode });
        return true;
    }
    return false;
}
/**
 * Ensures the user is the host of the room.
 */
function checkIfNotHost(roomCode, callback, socketId) {
    if (typeof callback !== 'function') {
        console.error("Callback is not a function. Received:", callback);
        return true; // or handle this case gracefully
    }
    if (types_1.rooms[roomCode].host !== socketId) {
        callback({ success: false, type: 'NotHost', error: 'Only the host can perform this action.' });
        return true;
    }
    return false;
}
/**
 * Ensures the user is not the host of the room.
 */
function checkIfHost(roomCode, callback, socketId) {
    if (typeof callback !== 'function') {
        console.error("Callback is not a function. Received:", callback);
        return true; // or handle this case gracefully
    }
    if (types_1.rooms[roomCode].host == socketId) {
        callback({ success: false, type: 'Host', error: 'Only non-host players can perform this action.' });
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
