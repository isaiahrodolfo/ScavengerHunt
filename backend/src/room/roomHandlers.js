"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateRoom = handleCreateRoom;
exports.handleJoinRoom = handleJoinRoom;
exports.handleStartRoom = handleStartRoom;
exports.handleRestartRoom = handleRestartRoom;
exports.handleCloseRoom = handleCloseRoom;
exports.handleExitRoom = handleExitRoom;
exports.handleExitRoomOnDisconnect = handleExitRoomOnDisconnect;
exports.handleSetupProfile = handleSetupProfile;
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
        players: {},
        started: false,
        hostIsModerator: false, // TODO: Fix tests to make rooms have this field
        gameGoals: [],
        gameData: {}, // TODO: Fix tests to make rooms have this field
        gameProgress: {}, // TODO: Fix tests to make rooms have this field
        hostOnPlayerPage: '',
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
    types_1.rooms[roomCode].players[socket.id] = {
        id: socket.id,
        name: ''
    };
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
    if (Object.keys(types_1.rooms[roomCode].players).length <= 1) {
        callback({ success: false, type: 'RoomEmpty', error: 'Cannot start a room with no players' });
        return;
    }
    // Ensure the game is not already started
    if (types_1.rooms[roomCode].started) {
        callback({ success: false, type: 'GameStarted', error: 'Game has already started' });
        return;
    }
    // const emptyPlayerData = gameGoals.map(({ imageCount }) => {
    //   return new Array(imageCount).fill({ image: '', status: 'none' });
    // });  
    if (isModerator) {
        types_1.rooms[roomCode] = Object.assign(Object.assign({}, types_1.rooms[roomCode]), { hostIsModerator: true });
        // Moderator joins rooms of players, so they can emit to each one separately
        // TODO: Remove all rooms of all players when room is closed
        const playersKeys = Object.keys(types_1.rooms[roomCode].players);
        for (const playerId of playersKeys) {
            if (playerId && playerId != types_1.rooms[roomCode].host) {
                // Optionally, join the player to a specific room
                // socket.join(playerId);
                // Initialize the game data for each player as empty lists
                types_1.rooms[roomCode].gameData[playerId] = Array.from({ length: gameGoals.length }, () => ([]));
            }
        }
    }
    // Set the game goals
    types_1.rooms[roomCode].gameGoals = gameGoals;
    // Start the room
    types_1.rooms[roomCode].started = true;
    // Emit the "startGame" event to all users in the room,
    // and tell them if there is a moderator or not
    socket.to(roomCode).emit("startGame", isModerator, types_1.rooms[roomCode].gameGoals);
    // Log the action for debugging
    // console.log(`Room ${roomCode} started by host ${socket.id}`);
    // Callback with success message
    callback({ success: true, data: types_1.rooms[roomCode].players });
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
    delete types_1.rooms[roomCode].players[socket.id];
    // rooms[roomCode].players.delete(socket.id);
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
/**
 * Handles setting up a profile
 */
function handleSetupProfile(roomCode, name, id, callback, socket) {
    // TODO: Add error handlers here
    // Set name
    types_1.rooms[roomCode].players[id] = { id, name };
    // Tell others this player has joined (and add their name to the others' joined players lists)
    const playerNames = Object.values(types_1.rooms[roomCode].players).map((profile) => profile.name);
    socket.to(roomCode).emit('getPlayers', playerNames); // Send player names to others
    // console.log('playerNames', playerNames); // testing
    callback({ success: true, data: playerNames }); // Send player names to yourself
}
