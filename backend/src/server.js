const { handleCreateGame, handleJoinGame, handleStartGame, handleCloseRoom, handleExitRoom} = require('./handlers');

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

  socket.on('createGame', (roomCode) => { handleCreateGame(roomCode, socket.id) });
  socket.on('joinGame', (roomCode) => { handleJoinGame(roomCode, socket.id) });
  socket.on('startGame', (roomCode) => { handleStartGame(roomCode, socket.id) });
  socket.on('closeRoom', (roomCode) => { handleCloseRoom(roomCode, socket.id) });
  socket.on('exitRoom', (roomCode) => { handleExitRoom(roomCode, socket.id) });

  // Handle disconnection event
  socket.on('disconnect', () => {
    // Remove user from room because they are disconnecting
    handleExitRoomOnDisconnect(socket.id)
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server running on port 3000');
});
