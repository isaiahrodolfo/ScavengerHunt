const { handleStartRoom } = require('../../src/handlers');
const { rooms } = require('../../src/types');

describe('handleStartRoom', () => {
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

  it('should start the room successfully if host starts it', () => {
    // Arrange: Create a room with the host and players
    rooms['room1'] = {
      code: 'room1',
      host: 'host1',
      players: new Set(['host1', 'user2']),
      started: false,
    };

    // Act: Call handleStartRoom
    handleStartRoom('room1', callback, socket);

    // Assert: Room is marked as started
    expect(rooms['room1'].started).toBe(true);
    expect(callback).toHaveBeenCalledWith({ success: true });
  });

  it('should fail to start the room if it does not exist', () => {
    // Act: Call handleStartRoom with a nonexistent room
    handleStartRoom('invalidRoom', callback, socket);

    // Assert: Callback receives an error
    expect(callback).toHaveBeenCalledWith({ success: false, type: 'RoomDoesNotExist' });
  });

  it('should fail to start the room if the user is not the host', () => {
    // Arrange: Create a room where the socket is not the host
    rooms['room1'] = {
      code: 'room1',
      host: 'host1',
      players: new Set(['host1', 'user2']),
      started: false,
    };

    socket.id = 'user2'; // Not the host

    // Act: Call handleStartRoom
    handleStartRoom('room1', callback, socket);

    // Assert: Callback receives an error
    expect(callback).toHaveBeenCalledWith({ success: false, type: 'NotHost', message: 'Only the host can perform this action.' });
  });

  it('should fail to start the room if there are no players', () => {
    // Arrange: Create a room with no players
    rooms['room1'] = {
      code: 'room1',
      host: 'host1',
      players: new Set(),
      started: false,
    };

    // Act: Call handleStartRoom
    handleStartRoom('room1', callback, socket);

    // Assert: Callback receives an error
    expect(callback).toHaveBeenCalledWith({ success: false, message: 'Cannot start a room with no players' });
  });

  it('should not re-start the room if it has already started', () => {
    // Arrange: Create a room that is already started
    rooms['room1'] = {
      code: 'room1',
      host: 'host1',
      players: new Set(['host1', 'user2']),
      started: true,
    };

    // Act: Call handleStartRoom
    handleStartRoom('room1', callback, socket);

    // Assert: Callback receives an appropriate message
    expect(callback).toHaveBeenCalledWith({ success: false, message: 'Room has already started' });
  });
});
