const { handleCloseRoom } = require('../../src/handlers');
const { rooms } = require('../../src/types'); // Import rooms from your types file

describe('handleCloseRoom', () => {
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

  it('should allow the host to close an existing room', () => {

    rooms['room1'] = { code: 'room1', host: socket.id, players: new Set([socket.id, 'user2']) };

    handleCloseRoom('room1', callback, socket);

    expect(rooms['room1']).toBeUndefined(); // Room should no longer exist
    expect(socket.leave).toHaveBeenCalledWith('room1'); // Host is removed from the room
    expect(callback).toHaveBeenCalledWith({ success: true });
  });

  it('should fail if room does not exist', () => {

    handleCloseRoom('nonexistent', callback, socket);

    expect(callback).toHaveBeenCalledWith({ success: false, type: 'RoomDoesNotExist' }); // Callback reports failure
    expect(socket.leave).not.toHaveBeenCalled(); // socket.leave is never called
  });

  it('should fail if user is not the host', () => {
    // Create a room with a different host
    rooms['room1'] = { code: 'room1', host: 'otherHost', players: new Set(['otherHost', socket.id]) };

    handleCloseRoom('room1', callback, socket);

    expect(rooms['room1']).toBeDefined(); // Room still exists
    expect(callback).toHaveBeenCalledWith({ success: false, type: 'NotHost' }); // Callback reports failure due to not being the host
    expect(socket.leave).not.toHaveBeenCalled(); // socket.leave is never called
  });
});
