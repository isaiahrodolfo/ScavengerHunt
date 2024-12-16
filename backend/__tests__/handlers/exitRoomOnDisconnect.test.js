const { handleExitRoomOnDisconnect, handleExitRoom } = require('../../src/handlers');
const { rooms } = require('../../src/types');  // Import rooms from your types file
const { AlreadyInSomeRoomError, RoomDoesNotExistError } = require('../../src/errors');
const { checkIfRoomExists, checkIfRoomDoesNotExist, checkIfInAnyRoom, checkIfInThisRoom, checkIfNotHost, getRoomOfUser } = require('../../src/handler-helpers');

jest.mock('../../src/handlers.js');
jest.mock('../../src/handler-helpers.js');
jest.mock('../../src/errors.js');

describe('handleExitRoomOnDisconnect', () => {
  const mockSocket = {
    id: 'player1',
    leave: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should exit the room on disconnect if the user is in a room', () => {
    const roomCode = 'room123';

    const mockSocket = {
      id: 'player1',
      leave: jest.fn(),
      rooms: new Set(['player1', roomCode])
    };

    rooms[roomCode] = {
      code: roomCode,
      host: 'host123',
      players: new Set(['host123', 'player1'])
    }

    handleExitRoomOnDisconnect(mockSocket);
    getRoomOfUser.mockImplementation(() => roomCode); // Assume getRoomOfUser works
    // getRoomOfUser returns roomCode, so handleExitRoom runs

  });

  it('should do nothing if the user is not in a room', () => {
    getRoomOfUser.mockImplementation(() => undefined);

    handleExitRoomOnDisconnect(mockSocket.id);

    expect(mockSocket.leave).not.toHaveBeenCalled();
  });
});
