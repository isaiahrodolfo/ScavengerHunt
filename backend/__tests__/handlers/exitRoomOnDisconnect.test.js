const { handleCreateRoom, handleJoinRoom, handleStartRoom, handleCloseRoom, handleExitRoom } = require('../../src/handlers');
const { rooms } = require('../../src/types');  // Import rooms from your types file
const { AlreadyInRoomError, RoomDoesNotExistError } = require('../../src/errors');
const { checkIfRoomExists, checkIfRoomDoesNotExist, checkIfInAnyRoom, checkIfInThisRoom, checkIfNotHost, getRoomOfUser } = require('../../src/handler-helpers');

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
    getRoomOfUser.mockImplementation(() => 'room123');

    handleExitRoomOnDisconnect(mockSocket.id);

    expect(mockSocket.leave).toHaveBeenCalledWith('room123');
  });

  it('should do nothing if the user is not in a room', () => {
    getRoomOfUser.mockImplementation(() => undefined);

    handleExitRoomOnDisconnect(mockSocket.id);

    expect(mockSocket.leave).not.toHaveBeenCalled();
  });
});
