const { handleCreateRoom, handleJoinRoom, handleStartRoom, handleRestartRoom, handleCloseRoom, handleExitRoom, handleExitRoomOnDisconnect, handleSetupProfile} = require('./room/roomHandlers');
const { handleInsertImage, handleGetPlayerData, handleNavigateToPlayerList, handleSetImageStatus, handleDeclareWinner, handleEndGame, handleDeleteImage } = require('./game/gameHandlers');
const { logState } = require('./handler-helpers');

const { Room, rooms } = require('./types');

const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

// Set up the Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.IO

// Handle incoming socket connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Room handlers
  socket.on('createRoom', (roomCode, callback) => { handleCreateRoom(roomCode, callback, socket) });
  socket.on('joinRoom', (roomCode, callback) => { handleJoinRoom(roomCode, callback, socket) });
  socket.on('startRoom', (roomCode, gameGoals, isModerator, callback) => { handleStartRoom(roomCode, gameGoals, isModerator, callback, socket) });
  socket.on('restartRoom', (roomCode, callback) => { handleRestartRoom(roomCode, callback, socket) });
  socket.on('closeRoom', (roomCode, callback) => { handleCloseRoom(roomCode, callback, socket) });
  socket.on('exitRoom', (roomCode, roomIsClosed, callback) => { handleExitRoom(roomCode, roomIsClosed, callback, socket) });
  socket.on('setupProfile', (roomCode, name, callback) => { handleSetupProfile(roomCode, name, socket.id, callback, socket) });

  // Game handlers
  socket.on('insertImage', (roomCode, imageAndLocation, callback) => { handleInsertImage(roomCode, imageAndLocation, callback, socket) });
  socket.on('deleteImage', (roomCode, categoryIndex, imageIndex, callback) => { handleDeleteImage(roomCode, categoryIndex, imageIndex, callback, socket) });
  socket.on('getPlayerData', (roomCode, id, callback) => { handleGetPlayerData(roomCode, id, callback) });
  socket.on('navigateToPlayerList', (roomCode, callback) => { handleNavigateToPlayerList(roomCode, callback) });
  socket.on('setImageStatus', (roomCode, id, location, status, callback) => { handleSetImageStatus(roomCode, id, location, status, callback, socket) });
  socket.on('declareWinner', (roomCode, id, callback) => { handleDeclareWinner(roomCode, id, callback, socket) });
  socket.on('endGame', (roomCode, callback) => { handleEndGame(roomCode, callback, socket) });

  // TESTING, print out all data on request 
  socket.on('logState', (roomCode) => { logState(roomCode, socket) });

  // TESTING, print any incoming emits to console
  socket.onAny((eventName, ...args) => {
    console.log(socket.id, eventName, args); // 'hello' [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ]
  });

  // TESTING, print any outgoing emits to console
  socket.onAnyOutgoing((eventName, ...args) => {
    console.log(socket.id, eventName, args); // 'hello' [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ]
  });

  // Handle disconnection event
  socket.on('disconnect', () => {
    // Remove user from room because they are disconnecting
    handleExitRoom(socket)
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});