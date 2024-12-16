const { handleCreateGame, handleJoinGame, handleStartGame, handleCloseGame } = require('./handlers');

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

  socket.on('createGame', (gameCode) => { handleCreateGame(gameCode, socket.id) });
  socket.on('joinGame', (gameCode) => { handleJoinGame(gameCode, socket.id) });
  socket.on('startGame', (gameCode) => { handleStartGame(gameCode, socket.id) });
  socket.on('closeRoom', (gameCode) => { handleCloseRoom(gameCode, socket.id) });
  socket.on('exitRoom', (gameCode) => { handleExitRoom(gameCode, socket.id) });

  // Handle disconnection event
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server running on port 3000');
});
