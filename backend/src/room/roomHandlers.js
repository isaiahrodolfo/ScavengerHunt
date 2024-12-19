"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateRoom = handleCreateRoom;
exports.handleJoinRoom = handleJoinRoom;
exports.handleStartRoom = handleStartRoom;
exports.handleRestartRoom = handleRestartRoom;
exports.handleCloseRoom = handleCloseRoom;
exports.handleExitRoom = handleExitRoom;
exports.handleExitRoomOnDisconnect = handleExitRoomOnDisconnect;
const types_1 = require("../types");
const handler_helpers_1 = require("../handler-helpers");
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
        started: false,
        hostIsModerator: false, // TODO: Fix tests to make rooms have this field
        gameData: {} // TODO: Fix tests to make rooms have this field
    };
    socket.join(roomCode);
    // console.log(`Room ${roomCode} created by ${socket.id}`);
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
    // console.log(`User ${socket.id} joined room ${roomCode}`);
    callback({ success: true });
}
/**
 * Handles starting a room.
 */
function handleStartRoom(roomCode, gameGoals, isModerator, callback, socket) {
    // Ensure the room exists
    if ((0, handler_helpers_1.checkIfRoomDoesNotExist)(roomCode, callback))
        return;
    // Ensure the user is the host
    if ((0, handler_helpers_1.checkIfNotHost)(roomCode, callback, socket.id))
        return;
    // TODO: Write tests for these new types
    // Ensure the room has players (excluding the host)
    if (types_1.rooms[roomCode].players.size <= 1) {
        callback({ success: false, type: 'RoomEmpty', error: 'Cannot start a room with no players' });
        return;
    }
    // Ensure the game is not already started
    if (types_1.rooms[roomCode].started) {
        callback({ success: false, type: 'GameStarted', error: 'Game has already started' });
        return;
    }
    if (isModerator) {
        types_1.rooms[roomCode] = Object.assign(Object.assign({}, types_1.rooms[roomCode]), { hostIsModerator: true });
        // Moderator joins rooms of players, so they can emit to each one separately
        // TODO: Remove all rooms of all players when room is closed
        for (const playerId of types_1.rooms[roomCode].players) {
            if (playerId && playerId !== types_1.rooms[roomCode].host) {
                // socket.join(playerId); // testing, what if this doesn't do what i want it to, connect player to moderator?
                // Initialize the game data for each player based on gameGoals
                types_1.rooms[roomCode].gameData[playerId] = gameGoals.map(({ imageCount }) => {
                    return new Array(imageCount).fill({ image: '', status: 'none' });
                });
            }
        }
    }
    // Start the room
    types_1.rooms[roomCode].started = true;
    // Emit the "startGame" event to all users in the room,
    // and tell them if there is a moderator or not
    socket.to(roomCode).emit("startGame", isModerator);
    // Log the action for debugging
    // console.log(`Room ${roomCode} started by host ${socket.id}`);
    // Callback with success message
    callback({ success: true });
}
/**
 * Handles restarting a room.
 */
// TODO: Write tests for restarting a room
function handleRestartRoom(roomCode, callback, socket) {
    // Ensure the room exists
    if ((0, handler_helpers_1.checkIfRoomDoesNotExist)(roomCode, callback))
        return;
    // Ensure the user is the host
    if ((0, handler_helpers_1.checkIfNotHost)(roomCode, callback, socket.id))
        return;
    // // Ensure the room has players (excluding the host)
    // if (rooms[roomCode].players.size <= 1) {
    //   callback({ success: false, type: 'RoomEmpty', error: 'Cannot start a room with no players' });
    //   return;
    // }
    // Ensure the game has already started
    if (!types_1.rooms[roomCode].started) {
        callback({ success: false, type: 'GameHasNotStarted', error: 'Game has not started' });
        return;
    }
    // Restart the room
    types_1.rooms[roomCode].started = false;
    // // Emit the "startGame" event to all users in the room
    // socket.to(roomCode).emit("startGame");
    // Log the action for debugging
    // console.log(`Room ${roomCode} started by host ${socket.id}`);
    // Callback with success message
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
    // console.log(`Room ${roomCode} closed by ${socket.id}`);
    callback({ success: true });
}
/**
 * Handles exiting a room.
 */
function handleExitRoom(roomCode, roomIsClosed, callback, socket) {
    // If room is already closed by host, no need to check this
    if (!roomIsClosed) {
        // Check if there is a room to exit
        if ((0, handler_helpers_1.checkIfRoomDoesNotExist)(roomCode, callback))
            return;
        // Check if user is the host
        if ((0, handler_helpers_1.checkIfHost)(roomCode, callback, socket.id))
            return;
    }
    else {
        // Check if user is the host
        if ((0, handler_helpers_1.checkIfHost)(roomCode, callback, socket.id)) {
            // If user is host and room is to be closed, close the room
            handleCloseRoom(roomCode, callback, socket);
            return;
        }
    }
    // A user can only exit this room if it is a player of it
    if ((0, handler_helpers_1.checkIfNotInThisRoom)(roomCode, callback, socket.id))
        return;
    // Remove from rooms list as player
    types_1.rooms[roomCode].players.delete(socket.id);
    // Exit socket room
    socket.leave(roomCode);
    // Message
    // console.log(`Room with code ${roomCode} exited by user: ${socket.id}`);
    callback({ success: true });
}
/**
 * Handles exiting a room on disconnect.
 */
function handleExitRoomOnDisconnect(socket) {
    // If the user is in a room, exit it
    const roomCode = (0, handler_helpers_1.getRoomOfUser)(socket.id);
    if (roomCode) {
        // Dummy callback to handle silent cleanup
        const dummyCallback = () => { };
        // Call handleExitRoom for cleanup on disconnect
        handleExitRoom(roomCode, false, dummyCallback, socket); // TODO: If user is host, the room is to be closed.
    }
}
