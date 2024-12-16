const { handleExitRoom } = require('../../src/handlers');
const { rooms } = require('../../src/types');  // Import rooms from your types file
const { AlreadyInSomeRoomError, RoomDoesNotExistError } = require('../../src/errors');
const { checkIfRoomExists, checkIfRoomDoesNotExist, checkIfInAnyRoom, checkIfInThisRoom, checkIfNotHost, getRoomOfUser } = require('../../src/handler-helpers');

jest.mock('../../src/handler-helpers.js');
jest.mock('../../src/errors.js');

describe('handleExitRoom', () => {
  const mockSocket = {
    id: 'player1',
    leave: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should exit the room if the user is part of the room', () => {
    checkIfRoomDoesNotExist.mockImplementation(() => {});
    checkIfInThisRoom.mockImplementation(() => {});

    const roomCode = 'room123';

    rooms[roomCode] = {
      code: roomCode,
      host: 'host123',
      players: new Set(['host123'])
    }

    handleExitRoom(roomCode, mockSocket, false);

    expect(checkIfRoomDoesNotExist).toHaveBeenCalledWith(roomCode);
    expect(checkIfInThisRoom).toHaveBeenCalledWith(roomCode, mockSocket.id);
    expect(mockSocket.leave).toHaveBeenCalledWith(roomCode);
  });

  it('should exit the room if the user is part of the room and room is closed', () => {
    checkIfRoomDoesNotExist.mockImplementation(() => {});
    checkIfInThisRoom.mockImplementation(() => {});

    const roomCode = 'room123';

    rooms[roomCode] = {
      code: roomCode,
      host: 'host123',
      players: new Set(['host123'])
    }

    handleExitRoom(roomCode, mockSocket, false);

    expect(checkIfRoomDoesNotExist).toHaveBeenCalledWith(roomCode);
    expect(checkIfInThisRoom).toHaveBeenCalledWith(roomCode, mockSocket.id);
    expect(mockSocket.leave).toHaveBeenCalledWith(roomCode);
  });

  it('should emit error if the user is not part of the room', () => {
    checkIfRoomDoesNotExist.mockImplementation(() => {});
    checkIfInThisRoom.mockImplementation(() => {
      throw new Error('User not part of the room');
    });

    const roomCode = 'room123';
    handleExitRoom(roomCode, mockSocket, false);

    expect(mockSocket.leave).not.toHaveBeenCalled();
  });
});
