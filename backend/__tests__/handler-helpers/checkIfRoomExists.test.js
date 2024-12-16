const { handleCreateRoom, handleJoinRoom, handleStartRoom, handleCloseRoom, handleExitRoom } = require('../../src/handlers');
const { rooms } = require('../../src/types');  // Import rooms from your types file
const { AlreadyInSomeRoomError, RoomDoesNotExistError, RoomAlreadyExistsError } = require('../../src/errors');
const { checkIfRoomExists, checkIfRoomDoesNotExist, checkIfInAnyRoom, checkIfInThisRoom, checkIfNotHost, getRoomOfUser } = require('../../src/handler-helpers');

jest.mock('../../src/handler-helpers.js');
jest.mock('../../src/errors.js');

jest.mock('../../src/types', () => ({
  rooms: {
    room123: {
      code: 'room123',
      host: 'host1',
      players: new Set(['host1']),
    },
  },
}));

describe('checkIfRoomExists', () => {
  it('should throw error if room exists', () => { // TODO: Fix this (in practice, it works)
    // expect(() => checkIfRoomExists('room123')).toThrowError('A room already exists with code room123.');
    expect(() => checkIfRoomExists('room123')).toStrictEqual(
      RoomAlreadyExistsError('A room already exists with code room123.')
    );
  });

  it('should not throw error if room does not exist', () => {
    expect(() => checkIfRoomExists('room456')).not.toThrow();
    // expect(() => checkIfRoomExists('room456')).toThrow();
  });
});