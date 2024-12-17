const { handleExitRoomOnDisconnect } = require('../../src/handlers');
const { rooms } = require('../../src/types');

// Mock implementation for getRoomOfUser
jest.mock('../../src/handlers', () => {
  const originalModule = jest.requireActual('../../src/handlers');

  return {
    ...originalModule,
    getRoomOfUser: jest.fn(),
  };
});

const { getRoomOfUser } = require('../../src/handlers');

describe('handleExitRoomOnDisconnect', () => {
  let socket;

  beforeEach(() => {
    // Reset the rooms object before each test
    for (const key in rooms) {
      delete rooms[key];
    }

    // Mock socket object
    socket = {
      id: 'user1',
      leave: jest.fn(),
    };
  });

  it('should remove the user from the room on disconnect', () => {
    // Arrange: Set up a room with a user
    rooms['room1'] = {
      code: 'room1',
      host: 'host1',
      players: new Set(['user1', 'user2']),
    };

    getRoomOfUser.mockReturnValue('room1'); // Mock user being in 'room1'

    // Act: Call handleExitRoomOnDisconnect
    handleExitRoomOnDisconnect(socket);

    // Assert: Verify the user was removed from the room
    expect(rooms['room1'].players.has('user1')).toBe(false);
    expect(rooms['room1'].players.has('user2')).toBe(true); // Ensure other players remain
    expect(socket.leave).toHaveBeenCalledWith('room1');
  });

  it('should do nothing if the user is not in any room', () => {
    // Arrange: No room associated with user
    getRoomOfUser.mockReturnValue(null);

    // Act: Call handleExitRoomOnDisconnect
    handleExitRoomOnDisconnect(socket);

    // Assert: Ensure no side effects
    expect(socket.leave).not.toHaveBeenCalled();
  });

  // TODO: Leave the room and delete the room if the last player disconnects
  it('should leave the room and delete the room if the last player disconnects', () => {
    // Arrange: Room with one player (user1)
    rooms['room1'] = {
      code: 'room1',
      host: 'user1',
      players: new Set(['user1']),
    };

    getRoomOfUser.mockReturnValue('room1');

    // Act: Call handleExitRoomOnDisconnect
    handleExitRoomOnDisconnect(socket);

    // Assert: Room should be deleted
    expect(rooms['room1']).toBeUndefined();
    expect(socket.leave).toHaveBeenCalledWith('room1');
  });

  it('should handle multiple rooms and remove user from the correct one', () => {
    // Arrange: User is in room2, other rooms exist
    rooms['room1'] = {
      code: 'room1',
      host: 'host1',
      players: new Set(['user3']),
    };
    rooms['room2'] = {
      code: 'room2',
      host: 'host2',
      players: new Set(['user1', 'user4']),
    };

    getRoomOfUser.mockReturnValue('room2'); // User1 is in room2

    // Act: Call handleExitRoomOnDisconnect
    handleExitRoomOnDisconnect(socket);

    // Assert: User1 should be removed from room2 only
    expect(rooms['room2'].players.has('user1')).toBe(false);
    expect(rooms['room2'].players.has('user4')).toBe(true);
    expect(rooms['room1'].players.has('user3')).toBe(true); // Room1 unaffected
    expect(socket.leave).toHaveBeenCalledWith('room2');
  });
});
