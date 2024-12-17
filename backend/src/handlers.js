"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateRoom = handleCreateRoom;
exports.handleJoinRoom = handleJoinRoom;
exports.handleStartRoom = handleStartRoom;
exports.handleCloseRoom = handleCloseRoom;
exports.handleExitRoom = handleExitRoom;
const types_1 = require("./types");
const handler_helpers_1 = require("./handler-helpers");
/**
 * Handles room creation.
 */
function handleCreateRoom(roomCode, callback, socket) {
    // Check that there is no room with the same code
    if ((0, handler_helpers_1.checkIfRoomExists)(roomCode, callback))
        return;
    // Check that user is not in any room
    if ((0, handler_helpers_1.checkIfInAnyRoom)(socket.id, callback))
        return;
    // Create the room
    types_1.rooms[roomCode] = {
        code: roomCode,
        host: socket.id,
        players: new Set([socket.id]),
    };
    socket.join(roomCode);
    console.log(`Room ${roomCode} created by ${socket.id}`);
    callback({ success: true });
}
/**
 * Handles joining a room.
 */
function handleJoinRoom(roomCode, callback, socket) {
    // Check that the room exists
    if ((0, handler_helpers_1.checkIfRoomDoesNotExist)(roomCode, callback))
        return;
    // Check that user is not already in any room
    if ((0, handler_helpers_1.checkIfInAnyRoom)(socket.id, callback))
        return;
    // Add the user to the room
    types_1.rooms[roomCode].players.add(socket.id);
    socket.join(roomCode);
    console.log(`User ${socket.id} joined room ${roomCode}`);
    callback({ success: true });
}
/**
 * Handles starting a room.
 */
function handleStartRoom(roomCode, callback, socket) {
    if ((0, handler_helpers_1.checkIfRoomDoesNotExist)(roomCode, callback))
        return;
    if ((0, handler_helpers_1.checkIfNotHost)(roomCode, callback, socket.id))
        return;
    socket.to(roomCode).emit("startGame");
    console.log(`Room ${roomCode} started by host ${socket.id}`);
    callback({ success: true });
}
/**
 * Handles closing a room.
 */
function handleCloseRoom(roomCode, callback, socket) {
    if ((0, handler_helpers_1.checkIfRoomDoesNotExist)(roomCode, callback))
        return;
    if ((0, handler_helpers_1.checkIfNotHost)(roomCode, callback, socket.id))
        return;
    delete types_1.rooms[roomCode];
    socket.to(roomCode).emit('exitRoom');
    socket.leave(roomCode);
    console.log(`Room ${roomCode} closed by ${socket.id}`);
    callback({ success: true });
}
/**
 * Handles exiting a room.
 */
function handleExitRoom(roomCode, callback, socket, roomIsClosed) {
    // If room is already closed by host, no need to check this
    if (!roomIsClosed) {
        // Check if there is a room to exit
        if ((0, handler_helpers_1.checkIfRoomDoesNotExist)(roomCode, callback))
            return;
    }
    // A user can only exit this room if it is a player of it
    if ((0, handler_helpers_1.checkIfInThisRoom)(roomCode, callback, socket.id))
        return;
    // Remove from rooms list as player
    types_1.rooms[roomCode].players.delete(socket.id);
    // Exit socket room
    socket.leave(roomCode);
    // Message
    console.log(`Room with code ${roomCode} exited by user: ${socket.id}`);
    callback({ success: true });
}
