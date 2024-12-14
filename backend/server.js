const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

// Set up the Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.IO

games = {}

// Handle incoming socket connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('createGame', (gameCode) => {
    console.log(`Game with code ${gameCode} created by user: ${socket.id}`);
  });

  socket.on('closeGame', (gameCode) => {
    console.log(`Game with code ${gameCode} closed by user: ${socket.id}`);

    // Example action: Emit the event to all connected clients
    io.emit('gameClosed', { gameCode, closedBy: socket.id });
  });

  socket.on('startGame', (gameCode) => {
    console.log(`Game with code ${gameCode} started by user: ${socket.id}`);

    // Example action: Emit the event to all connected clients
    io.emit('gameStarted', { gameCode, startedBy: socket.id });
  });

  // Handle disconnection event
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server running on port 3000');
});
