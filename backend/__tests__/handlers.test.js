// const { handleCreateRoom, handleJoinRoom, handleStartRoom, handleCloseRoom, handleExitRoom } = require('../src/handlers');
// const { rooms } = require('../src/types');  // Import rooms from your types file
// const { AlreadyInRoomError, RoomDoesNotExistError } = require('../src/errors');
// const { checkIfRoomExists, checkIfRoomDoesNotExist, checkIfInAnyRoom, checkIfInThisRoom, checkIfNotHost, getRoomOfUser } = require('../src/handler-helpers');

// jest.mock('../src/handler-helpers.js');
// jest.mock('../src/errors.js');

// // Mocking Socket.io's socket methods
// const mockSocket = () => ({
//   id: 'user-123',
//   rooms: new Set(),
//   emit: jest.fn(),
//   join: jest.fn(),
//   leave: jest.fn(),
//   to: jest.fn().mockReturnThis(),
// });

// describe('Handlers', () => {
//   beforeEach(() => {
//     // Reset the rooms and any other state before each test
//     Object.keys(rooms).forEach((room) => delete rooms[room]);
//   });

//   test('should create a new room', () => {
//     const socket = mockSocket();
//     const roomCode = 'room-1';
    
//     checkIfRoomExists.mockImplementation(() => { /* no-op */ });
//     checkIfInAnyRoom.mockImplementation(() => { /* no-op */ });
    
//     handleCreateRoom(roomCode, socket);

//     expect(socket.join).toHaveBeenCalledWith(roomCode); // Socket.join was called, with room code
//     expect(rooms[roomCode]).toBeDefined(); // Room exists
//     expect(rooms[roomCode].host).toBe(socket.id); // User as host, of room with room code
//     expect(rooms[roomCode].players.has(socket.id)).toBe(true); // User in players list, of room with room code
//   });

//   test('should not create a room if the user is already in a room', () => {
//     const socket = mockSocket();
//     const roomCode = 'room-1';
    
//     checkIfRoomExists.mockImplementation(() => { /* no-op */ });
//     checkIfInAnyRoom.mockImplementation(() => {
//       throw new AlreadyInRoomError('User is already in a room');
//     });

//     handleCreateRoom(roomCode, socket);

//     expect(socket.emit).toHaveBeenCalledWith('joinRoomError', { type: 'AlreadyInRoom', message: expect.any(AlreadyInRoomError) });
//   });

//   test('should join a room', () => {
//     const socket = mockSocket();
//     const roomCode = 'room-1';
    
//     rooms[roomCode] = {
//       code: roomCode,
//       host: 'host-123',
//       players: new Set(['host-123']),
//     };

//     checkIfRoomDoesNotExist.mockImplementation(() => { /* no-op */ });
//     checkIfInAnyRoom.mockImplementation(() => { /* no-op */ });
    
//     handleJoinRoom(roomCode, socket);

//     expect(socket.join).toHaveBeenCalledWith(roomCode);
//     expect(rooms[roomCode].players.has(socket.id)).toBe(true);
//   });

//   test('should not join a room if the room does not exist', () => {
//     const socket = mockSocket();
//     const roomCode = 'room-1';

//     checkIfRoomDoesNotExist.mockImplementation(() => {
//       throw new RoomDoesNotExistError('Room does not exist');
//     });

//     handleJoinRoom(roomCode, socket);

//     expect(socket.emit).toHaveBeenCalledWith('joinRoomError', { type: 'RoomDoesNotExist', message: expect.any(RoomDoesNotExistError) });
//   });

//   test('should start a room', () => {
//     const socket = mockSocket();
//     const roomCode = 'room-1';
    
//     rooms[roomCode] = {
//       code: roomCode,
//       host: socket.id,
//       players: new Set([socket.id]),
//     };

//     checkIfRoomDoesNotExist.mockImplementation(() => { /* no-op */ });
//     checkIfNotHost.mockImplementation(() => { /* no-op */ });

//     handleStartRoom(roomCode, socket);

//     expect(socket.to(roomCode).emit).toHaveBeenCalledWith('startGame');
//   });

//   test('should not start a room if the user is not the host', () => {
//     const socket = mockSocket();
//     const roomCode = 'room-1';

//     rooms[roomCode] = {
//       code: roomCode,
//       host: 'host-123',
//       players: new Set([socket.id]),
//     };

//     checkIfRoomDoesNotExist.mockImplementation(() => { /* no-op */ });
//     checkIfNotHost.mockImplementation(() => {
//       throw new Error('User is not the host');
//     });

//     handleStartRoom(roomCode, socket);

//     expect(socket.emit).toHaveBeenCalledWith('joinRoomError', { type: 'UnknownError', message: 'An unknown error occurred while trying to start the room.' });
//   });

//   test('should close a room', () => {
//     const socket = mockSocket();
//     const roomCode = 'room-1';

//     rooms[roomCode] = {
//       code: roomCode,
//       host: socket.id,
//       players: new Set([socket.id]),
//     };

//     checkIfRoomDoesNotExist.mockImplementation(() => { /* no-op */ });
//     checkIfNotHost.mockImplementation(() => { /* no-op */ });

//     handleCloseRoom(roomCode, socket);

//     expect(socket.to(roomCode).emit).toHaveBeenCalledWith('exitRoom');
//     expect(socket.leave).toHaveBeenCalledWith(roomCode);
//     expect(rooms[roomCode]).toBeUndefined();
//   });

//   test('should exit a room', () => {
//     const socket = mockSocket();
//     const roomCode = 'room-1';
    
//     rooms[roomCode] = {
//       code: roomCode,
//       host: 'host-123',
//       players: new Set(['host-123', socket.id]),
//     };

//     checkIfRoomDoesNotExist.mockImplementation(() => { /* no-op */ });
//     checkIfInThisRoom.mockImplementation(() => { /* no-op */ });

//     handleExitRoom(roomCode, socket, false);

//     expect(socket.leave).toHaveBeenCalledWith(roomCode);
//     expect(rooms[roomCode].players.has(socket.id)).toBe(false);
//   });
// });
