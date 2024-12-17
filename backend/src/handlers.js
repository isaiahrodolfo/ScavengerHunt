"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateRoom = handleCreateRoom;
exports.handleJoinRoom = handleJoinRoom;
exports.handleStartRoom = handleStartRoom;
exports.handleCloseRoom = handleCloseRoom;
exports.handleExitRoom = handleExitRoom;
exports.handleExitRoomOnDisconnect = handleExitRoomOnDisconnect;
exports.logState = logState;
const types_1 = require("./types"); // Import types
const handler_helpers_1 = require("./handler-helpers");
function handleCreateRoom(roomCode, callback, socket) {
    // Check that there is no room associated with that room code
    if ((0, handler_helpers_1.checkIfRoomExists)(roomCode, callback))
        return; // TODO: Randomly generated room codes may not be unique
    // A user cannot already be part of another room if they want to create this room
    if ((0, handler_helpers_1.checkIfInAnyRoom)(socket.id, callback))
        return;
    // Add to rooms list as host and player
    types_1.rooms[roomCode] = {
        code: roomCode,
        host: socket.id,
        players: new Set([socket.id])
    };
    socket.join(roomCode);
    // Message
    console.log(`Room with code ${roomCode} created by user: ${socket.id}`);
    // Success
    callback({ success: true });
    // logState(socket);
}
function handleJoinRoom(roomCode, callback, socket) {
    // If the given room does not exist, user cannot join it
    if ((0, handler_helpers_1.checkIfRoomDoesNotExist)(roomCode, callback))
        return;
    // If user is already in a room, they cannot join this one
    if ((0, handler_helpers_1.checkIfInAnyRoom)(socket.id, callback))
        return;
    // Add player to room
    types_1.rooms[roomCode].players.add(socket.id);
    socket.join(roomCode);
    // Success
    callback({ success: true });
}
function handleStartRoom(roomCode, callback, socket) {
    try {
        // Check that there is a room to be started
        (0, handler_helpers_1.checkIfRoomDoesNotExist)(roomCode, callback);
        // Check that the user is the host
        (0, handler_helpers_1.checkIfNotHost)(roomCode, socket.id);
        socket.to(roomCode).emit("startGame");
        // Message
        console.log(`Room with code ${roomCode} started by user: ${socket.id}`);
    }
    catch (error) {
        console.error("Error starting room: ", error);
    }
    logState(socket);
}
function handleCloseRoom(roomCode, callback, socket) {
    try {
        // Check if there is a room to close
        (0, handler_helpers_1.checkIfRoomDoesNotExist)(roomCode, callback);
        // Check if user is the host. (Only hosts can close rooms)
        (0, handler_helpers_1.checkIfNotHost)(roomCode, socket.id);
        // Delete room
        delete types_1.rooms[roomCode];
        // Emit message, tell others to leave room
        socket.to(roomCode).emit('exitRoom'); // To client
        // Leave room
        socket.leave(roomCode);
        // Message
        console.log(`Room with code ${roomCode} closed by user: ${socket.id}`);
    }
    catch (error) {
        console.error("Error closing room: ", error);
    }
    logState(socket);
}
function handleExitRoom(roomCode, callback, socket, roomIsClosed) {
    try {
        // If room is already closed by host, no need to check this
        if (!roomIsClosed) {
            // Check if there is a room to exit
            (0, handler_helpers_1.checkIfRoomDoesNotExist)(roomCode, callback);
        }
        // A user can only exit this room if it is a player of it
        (0, handler_helpers_1.checkIfInThisRoom)(roomCode, socket.id);
        // Remove from rooms list as player
        types_1.rooms[roomCode].players.delete(socket.id);
        // Exit socket room
        socket.leave(roomCode);
        // Message
        console.log(`Room with code ${roomCode} exited by user: ${socket.id}`);
    }
    catch (error) {
        console.error("Error exiting room: ", error);
    }
    logState(socket);
}
function handleExitRoomOnDisconnect(socket) {
    // If user has joined a room, leave it before disconnecting
    const roomCode = (0, handler_helpers_1.getRoomOfUser)(socket.id);
    if (roomCode) {
        try {
            // A user can only exit this room if it is a player of it
            (0, handler_helpers_1.checkIfInThisRoom)(roomCode, socket.id); // returns callback, but unused
            // Remove from rooms list as player
            types_1.rooms[roomCode].players.delete(socket.id);
            // Exit socket room
            socket.leave(roomCode);
            // Message
            console.log(`Room with code ${roomCode} exited by user: ${socket.id}`);
        }
        catch (error) {
            console.error("Error exiting room: ", error);
        }
    }
}
function logState(socket) {
    // Current state of the list
    console.log("rooms", types_1.rooms);
    console.log(`Rooms for socket ${socket.id}:`, socket.rooms); // Log rooms the socket is in  
}
