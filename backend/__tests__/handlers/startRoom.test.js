const { handleStartRoom } = require('../../src/handlers');
const { rooms } = require('../../src/types');  // Import rooms from your types file
const { AlreadyInSomeRoomError, RoomDoesNotExistError, NotHostError } = require('../../src/errors');
const { checkIfRoomExists, checkIfRoomDoesNotExist, checkIfInAnyRoom, checkIfInThisRoom, checkIfNotHost, getRoomOfUser } = require('../../src/handler-helpers');

jest.mock('../../src/handler-helpers.js');
jest.mock('../../src/errors.js');

describe('handleStartRoom', () => {
  const mockSocket = {
    id: 'host1',
    to: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start the room if the user is the host', () => {
    checkIfRoomDoesNotExist.mockImplementation(() => {});
    checkIfNotHost.mockImplementation(() => {});

    const roomCode = 'room123';
    handleStartRoom(roomCode, mockSocket);

    expect(checkIfRoomDoesNotExist).toHaveBeenCalledWith(roomCode);
    expect(checkIfNotHost).toHaveBeenCalledWith(roomCode, mockSocket.id);
    expect(mockSocket.to).toHaveBeenCalledWith(roomCode);
  });

  it('should emit error if the user is not the host', () => {
    checkIfRoomDoesNotExist.mockImplementation(() => {});
    checkIfNotHost.mockImplementation(() => {
      throw new NotHostError('User is not the host');
    });

    const roomCode = 'room123';
    handleStartRoom(roomCode, mockSocket);

    expect(mockSocket.to).not.toHaveBeenCalled();
  });
});
