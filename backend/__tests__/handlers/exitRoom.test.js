const { handleExitRoom, handleCloseRoom } = require('../../src/handlers');
const { rooms } = require('../../src/types');

describe('handleExitRoom', () => {
  let socket;
  let callback;

  beforeEach(() => {
    // Reset mocks for socket and callback
    socket = { 
      id: 'user1', 
      leave: jest.fn(), // Add a mock for socket.leave
      to: jest.fn(() => ({ emit: jest.fn() }))
    };
    callback = jest.fn();
    Object.keys(rooms).forEach((key) => delete rooms[key]); // Clear rooms before each test
  });

  it('should allow the non-host user to exit an existing room', () => {

    rooms['room1'] = { code: 'room1', host: 'host1', players: new Set(['host1', socket.id]) };

    handleExitRoom('room1', callback, socket, false);

    expect(rooms['room1']).toBeDefined(); // Room should still exist
    expect(rooms['room1'].players.has(socket.id)).toBeFalsy(); // User is removed from the room
    expect(socket.leave).toHaveBeenCalledWith('room1'); // User is removed from the Socket room
    expect(callback).toHaveBeenCalledWith({ success: true });
  });

  it('should fail if room does not exist', () => {

    handleExitRoom('nonexistent', callback, socket, false);

    expect(callback).toHaveBeenCalledWith({ success: false, type: 'RoomDoesNotExist' }); // Callback reports failure
    expect(socket.leave).not.toHaveBeenCalled(); // socket.leave is never called
  });

  it('should exit the room if user disconnects as non-host', () => {
    // Create a room with a user as host
    rooms['room1'] = { code: 'room1', host: 'host1', players: new Set(['host1', socket.id]) };

    handleExitRoom('room1', callback, socket, true);

    expect(rooms['room1']).toBeDefined(); // Room should still exist
    expect(rooms['room1'].players.has(socket.id)).toBeFalsy(); // User is removed from the room
    expect(socket.leave).toHaveBeenCalledWith('room1'); // User is removed from the Socket room
    expect(callback).toHaveBeenCalledWith({ success: true });
  });

  it('should close the room if user disconnects as host', () => {
    // Create a room with a user as host
    rooms['room1'] = { code: 'room1', host: socket.id, players: new Set([socket.id, 'otherPlayer']) };

    handleExitRoom('room1', callback, socket, true);

    // expect(handleCloseRoom).toHaveBeenCalled(); // Close the room
    expect(rooms['room1']).toBeFalsy(); // Room is now removed
    // TODO: Shows message, but we can't do anything about it since user is disconnecting
    expect(callback).toHaveBeenCalledWith({ success: false, type: 'Host', message: 'Only non-host players can perform this action.' }); // Callback reports failure due to not being the host
    expect(socket.leave).toHaveBeenCalled(); // socket.leave is never called
  });
});