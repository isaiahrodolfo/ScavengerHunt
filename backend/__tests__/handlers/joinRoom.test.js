const { handleJoinRoom } = require('../../src/handlers');
const { rooms } = require('../../src/types');  // Import rooms from your types file
const { AlreadyInSomeRoomError, RoomDoesNotExistError } = require('../../src/errors');
const { checkIfRoomExists, checkIfRoomDoesNotExist, checkIfInAnyRoom, checkIfInThisRoom, checkIfNotHost, getRoomOfUser } = require('../../src/handler-helpers');

jest.mock('../../src/handler-helpers.js');
// jest.mock('../../src/errors.js');

describe('handleJoinRoom', () => {
  const mockSocket = {
    id: 'user1',
    emit: jest.fn(),
    join: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should join the room if it exists and the user is not in another room', () => {
    checkIfRoomDoesNotExist.mockImplementation(() => {});
    checkIfInAnyRoom.mockImplementation(() => {});

    const roomCode = 'room123';
    rooms[roomCode] = {
      code: roomCode,
      host: 'host123',
      players: new Set(['host123'])
    }

    handleJoinRoom(roomCode, mockSocket);

    expect(checkIfRoomDoesNotExist).toHaveBeenCalledWith(roomCode);
    expect(checkIfInAnyRoom).toHaveBeenCalledWith(mockSocket.id);
    expect(mockSocket.join).toHaveBeenCalledWith(roomCode);
  });

  it('should emit error if the room does not exist', () => {
    checkIfRoomDoesNotExist.mockImplementation(() => {
      throw new RoomDoesNotExistError('Room does not exist.');
    });

    const roomCode = 'room123';
    handleJoinRoom(roomCode, mockSocket);

    expect(mockSocket.emit).toHaveBeenCalledWith('joinRoomError', {
      type: 'RoomDoesNotExist',
      message: 'Room does not exist.',
    });
  });

  it('should emit error if the user is already in a room', () => {
    checkIfRoomDoesNotExist.mockImplementation(() => {});
    checkIfInAnyRoom.mockImplementation(() => {
      throw new AlreadyInSomeRoomError('User is already in a room room123.');
    });

    const roomCode = 'room123';
    handleJoinRoom(roomCode, mockSocket);

    expect(mockSocket.emit).toHaveBeenCalledWith('joinRoomError', {
      type: 'AlreadyInSomeRoom',
      message: 'User is already in a room room123.',
    });
  });
});
