const { handleJoinRoom } = require('../../src/handlers');

describe('handleJoinRoom', () => {
  let mockSocket;
  let mockCallback;
  let rooms;

  beforeEach(() => {
    // Reset mockSocket and mockCallback before each test
    mockSocket = {
      id: 'player1',
      join: jest.fn(),
    };

    mockCallback = jest.fn();

    global.rooms.room123 = {
      code: 'room123', 
      host: 'host123', 
      players: new Set(['player2'])
    };

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return success and add player to room if room exists', () => {
    const roomCode = 'room123';
  
    // Update the global `rooms` object
    // rooms[roomCode] = { code: roomCode, host: 'host123', players: new Set(['player2']) };
  
    const mockCallback = jest.fn();
    const mockSocket = {
      id: 'player1',
      join: jest.fn(),
    };
  
    handleJoinRoom(roomCode, mockCallback, mockSocket);
  
    // Assertions
    expect(mockCallback).toHaveBeenCalledWith({ success: true });
    expect(rooms[roomCode].players.has(mockSocket.id)).toBe(true); // Verify player added
    expect(mockSocket.join).toHaveBeenCalledWith(roomCode);
  });
  

  it('should return error if room does not exist', () => {
    const roomCode = 'nonexistentRoom';

    handleJoinRoom(roomCode, mockCallback, mockSocket);

    expect(mockCallback).toHaveBeenCalledWith({ success: false, type: 'RoomDoesNotExist' });
    expect(mockSocket.join).not.toHaveBeenCalled();
  });

  it('should return error if player is already in this room', () => {
    const roomCode = 'room123';
    rooms[roomCode] = { players: new Set([mockSocket.id]) }; // Player already in room

    handleJoinRoom(roomCode, mockCallback, mockSocket);

    expect(mockCallback).toHaveBeenCalledWith({ success: false, type: 'AlreadyInRoom' });
    expect(mockSocket.join).not.toHaveBeenCalled();
  });
});
