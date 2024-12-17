const { rooms } = require('../../src/types');  // Import rooms from your types file
const { checkIfRoomExists } = require('../../src/handler-helpers');

describe('checkIfRoomExists', () => {
  let callback;

  beforeEach(() => {
    callback = jest.fn();
    Object.keys(rooms).forEach(key => delete rooms[key]); // Reset rooms
  });

  test('should return true and call callback if room exists', () => {
    rooms['room123'] = { code: 'room123', host: 'user1', players: new Set() };

    const result = checkIfRoomExists('room123', callback);

    expect(result).toBe(true);
    expect(callback).toHaveBeenCalledWith({ success: false, type: 'RoomExists' });
  });

  test('should return false if room does not exist', () => {
    const result = checkIfRoomExists('room123', callback);

    expect(result).toBe(false);
    expect(callback).not.toHaveBeenCalled();
  });
});
