const { handleCreateRoom, handleJoinRoom, handleStartRoom, handleCloseRoom, handleExitRoom, handleExitRoomOnDisconnect, logState } = require('./handlers');

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

  socket.on('createRoom', (roomCode) => { handleCreateRoom(roomCode, socket) });
  socket.on('joinRoom', (roomCode, callback) => { handleJoinRoom(roomCode, callback, socket) });
  socket.on('startRoom', (roomCode) => { handleStartRoom(roomCode, socket) });
  socket.on('closeRoom', (roomCode) => { handleCloseRoom(roomCode, socket) });
  socket.on('exitRoom', (roomCode, roomIsClosed) => { handleExitRoom(roomCode, socket, roomIsClosed) });
  socket.on('logState', (roomCode) => { logState(socket) });

  // TESTING, print any incoming emits to console
  socket.onAny((eventName, ...args) => {
    console.log(eventName); // 'hello'
    console.log(args); // [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ]
  });

  // TESTING, print any outgoing emits to console
  socket.onAnyOutgoing((eventName, ...args) => {
    console.log(eventName); // 'hello'
    console.log(args); // [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ]
  });

  // Handle disconnection event
  socket.on('disconnect', () => {
    // Remove user from room because they are disconnecting
    handleExitRoomOnDisconnect(socket)
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server running on port 3000');
});
