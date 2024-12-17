const { handleJoinRoom } = require('../../src/handlers');
const { rooms } = require('../../src/types');

describe('handleJoinRoom', () => {
  let socket;
  let callback;

  beforeEach(() => {
    socket = { id: 'user1', join: jest.fn() };
    callback = jest.fn();
    Object.keys(rooms).forEach((key) => delete rooms[key]);
  });

  it('should allow a user to join an existing room', () => {
    rooms['room1'] = { code: 'room1', host: 'host1', players: new Set(['host1']) };

    handleJoinRoom('room1', callback, socket);

    expect(rooms['room1'].players.has(socket.id)).toBeTruthy();
    expect(socket.join).toHaveBeenCalledWith('room1');
    expect(callback).toHaveBeenCalledWith({ success: true });
  });

  it('should fail if room does not exist', () => {
    handleJoinRoom('nonexistent', callback, socket);

    expect(callback).toHaveBeenCalledWith({ success: false, type: 'RoomDoesNotExist' });
    expect(socket.join).not.toHaveBeenCalled();
  });

  it('should fail if user is already in another room', () => {
    rooms['room1'] = { code: 'room1', host: 'host1', players: new Set(['host1', socket.id]) };
    rooms['room2'] = { code: 'room2', host: 'host2', players: new Set(['host2']) };

    handleJoinRoom('room2', callback, socket);

    expect(callback).toHaveBeenCalledWith({ success: false, type: 'AlreadyInRoom', roomCode: 'room1' });
    expect(socket.join).not.toHaveBeenCalled();
  });

  it('should fail if user is already in the same room', () => {
    rooms['room1'] = { code: 'room1', host: 'host1', players: new Set(['host1', socket.id]) };

    handleJoinRoom('room1', callback, socket);

    expect(callback).toHaveBeenCalledWith({ success: false, type: 'AlreadyInRoom', roomCode: 'room1' });
    expect(socket.join).not.toHaveBeenCalled();
  });
});
