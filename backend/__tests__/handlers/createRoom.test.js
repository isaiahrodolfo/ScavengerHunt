const { handleCreateRoom } = require('../../src/handlers');
const { rooms } = require('../../src/types');  // Import rooms from your types file

describe('handleCreateRoom', () => {
  let socket;
  let callback;

  beforeEach(() => {
    socket = { id: 'user1', join: jest.fn() };
    callback = jest.fn();
    Object.keys(rooms).forEach((key) => delete rooms[key]); // Reset rooms
  });

  it('should create a room successfully', () => {
    handleCreateRoom('room123', callback, socket);

    expect(rooms['room123']).toBeDefined();
    expect(rooms['room123'].host).toBe('user1');
    expect(callback).toHaveBeenCalledWith({ success: true });
    expect(socket.join).toHaveBeenCalledWith('room123');
  });

  it('should fail if room already exists', () => {
    rooms['room123'] = { code: 'room123', host: 'anotherUser', players: new Set() };

    handleCreateRoom('room123', callback, socket);

    expect(callback).toHaveBeenCalledWith({ success: false, type: 'RoomExists' });
  });

  it('should fail if user is already in another room', () => {
    rooms['room123'] = { code: 'room123', host: 'anotherUser', players: new Set(['user1']) };

    handleCreateRoom('room456', callback, socket);

    expect(callback).toHaveBeenCalledWith({ success: false, type: 'AlreadyInRoom', roomCode: 'room123' });
  });
});
