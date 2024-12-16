const { handleCreateRoom } = require('../../src/handlers');
const { rooms } = require('../../src/types');  // Import rooms from your types file
const { AlreadyInRoomError } = require('../../src/errors');
const { checkIfRoomExists, checkIfInAnyRoom } = require('../../src/handler-helpers');

jest.mock('../../src/handler-helpers.js');
jest.mock('../../src/errors.js');

describe('handleCreateRoom', () => {
  const mockSocket = {
    id: 'user1',
    join: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a room if no room exists with the given code and the user is not part of another room', () => {
    checkIfRoomExists.mockImplementation(() => {});
    checkIfInAnyRoom.mockImplementation(() => {});

    const roomCode = 'room123';
    handleCreateRoom(roomCode, mockSocket);

    expect(checkIfRoomExists).toHaveBeenCalledWith(roomCode);
    expect(checkIfInAnyRoom).toHaveBeenCalledWith(mockSocket.id);
    expect(mockSocket.join).toHaveBeenCalledWith(roomCode);
  });

  it('should throw error if the user is already in a room', () => {
    checkIfRoomExists.mockImplementation(() => {});
    checkIfInAnyRoom.mockImplementation(() => {
      throw new AlreadyInRoomError('User is already in a room.');
    });

    const roomCode = 'room123';
    handleCreateRoom(roomCode, mockSocket);

    expect(checkIfRoomExists).toHaveBeenCalledWith(roomCode);
    expect(checkIfInAnyRoom).toHaveBeenCalledWith(mockSocket.id);
    expect(mockSocket.join).not.toHaveBeenCalled();
  });

  it('should handle error if room code already exists', () => {
    checkIfRoomExists.mockImplementation(() => {
      throw new Error('Room already exists');
    });

    const roomCode = 'room123';
    handleCreateRoom(roomCode, mockSocket);

    expect(checkIfRoomExists).toHaveBeenCalledWith(roomCode);
    expect(mockSocket.join).not.toHaveBeenCalled();
  });
});
