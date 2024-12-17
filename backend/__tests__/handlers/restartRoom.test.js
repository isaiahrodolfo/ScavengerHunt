const { handleRestartRoom } = require('../../src/handlers');
const { rooms } = require('../../src/types');

describe('handleRestartRoom', () => {
  let socket;
  let callback;

  beforeEach(() => {
    // Reset rooms object before each test
    for (const key in rooms) {
      delete rooms[key];
    }

    // Mock socket object
    socket = {
      id: 'host1',
      to: jest.fn(() => ({ emit: jest.fn() }))
    };

    // Mock callback function
    callback = jest.fn();
  });

  it('should restart the room successfully if user is host', () => {
    // Arrange: Create a room with the host and players
    rooms['room1'] = {
      code: 'room1',
      host: 'host1',
      players: new Set(['host1', 'user2']),
      started: true,
    };

    // Act: Call handleRestartRoom
    handleRestartRoom('room1', callback, socket);

    // Assert: Room is marked as not started
    expect(rooms['room1'].started).toBe(false);
    expect(callback).toHaveBeenCalledWith({ success: true });
  });

  it('should fail to restart the room if it does not exist', () => {
    // Act: Call handleRestartRoom with a nonexistent room
    handleRestartRoom('invalidRoom', callback, socket);

    // Assert: Callback receives an error
    expect(callback).toHaveBeenCalledWith({ success: false, type: 'RoomDoesNotExist' });
  });

  it('should fail to restart the room if the user is not the host', () => {
    // Arrange: Create a room where the socket is not the host
    rooms['room1'] = {
      code: 'room1',
      host: 'host1',
      players: new Set(['host1', 'user2']),
      started: true,
    };

    socket.id = 'user2'; // Not the host

    // Act: Call handleRestartRoom
    handleRestartRoom('room1', callback, socket);

    // Assert: Callback receives an error
    expect(callback).toHaveBeenCalledWith({ success: false, type: 'NotHost', error: 'Only the host can perform this action.' });
  });

  it('should not restart the room if it has not started', () => {
    // Arrange: Create a room that has not started
    rooms['room1'] = {
      code: 'room1',
      host: 'host1',
      players: new Set(['host1', 'user2']),
      started: false,
    };

    // Act: Call handleRestartRoom
    handleRestartRoom('room1', callback, socket);

    // Assert: Callback receives an appropriate message
    expect(callback).toHaveBeenCalledWith({ success: false, type: "GameHasNotStarted", error: 'Game has not started' });
  });
});
