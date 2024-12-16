import { Room, rooms } from './types'; // Import types
import { checkIfRoomDoesNotExist, checkIfRoomExists, checkIfInAnyRoom, checkIfInThisRoom, checkIfNotHost, getRoomOfUser } from './handler-helpers';
import { AlreadyInRoomError, RoomDoesNotExistError } from './errors';

export function handleCreateRoom(roomCode: string, id: string) {

  try {
    // Check that there is no room associated with that room code
    checkIfRoomExists(roomCode);
    // TODO: Randomly generated room codes can be duplicated!

    // A user cannot already be part of another room if they want to create this room
    checkIfInAnyRoom(id);

    // Add to rooms list as host and player
    rooms[roomCode] = {
      code: roomCode,
      host: id,
      players: new Set([id])
    }

    // Message
    console.log(`Room with code ${roomCode} created by user: ${id}`);

  } catch (error) {
    console.error("Error creating room: ", error);
  }

  // Current state of the list
  console.log("rooms", rooms);

}

export function handleJoinRoom(roomCode: string, socket: any) {
  try {
    // Check if there is a room to join
    checkIfRoomDoesNotExist(roomCode);
  } catch (error) {
    if (error instanceof RoomDoesNotExistError) {
      socket.emit('joinRoomError', { type: 'RoomDoesNotExist', message: error });
    } else {
      socket.emit('joinRoomError', { type: 'UnknownError', message: "An unknown error occurred while trying to join the room." });
    }
    return;
  }

  try {
    // A user cannot already be part of another room if they want to join this room
    checkIfInAnyRoom(socket.id);
  } catch (error) {
    if (error instanceof AlreadyInRoomError) {
      socket.emit('joinRoomError', { type: 'AlreadyInRoom', message: error.message });
    } else {
      socket.emit('joinRoomError', { type: 'UnknownError', message: "An unknown error occurred while trying to join the room." });
    }
    return;
  }

  // Add to rooms list as player
  rooms[roomCode].players.add(socket.id);

  // Message
  console.log(`Room with code ${roomCode} joined by user: ${socket.id}`);

  // Current state of the list
  console.log("rooms", rooms);
}

export function handleStartRoom(roomCode: string, id: string) {

  try {
    // Check that there is a room to be started
    checkIfRoomDoesNotExist(roomCode);

    // Check that the user is the host
    checkIfNotHost(roomCode, id);

    // Message
    console.log(`Room with code ${roomCode} started by user: ${id}`);

  } catch (error) {
    console.error("Error starting room: ", error);
  }

  // Current state of the list
  console.log("rooms", rooms);

}

export function handleCloseRoom(roomCode: string, id: string) {

  try {
    // Check if there is a room to close
    checkIfRoomDoesNotExist(roomCode);

    // Check if user is the host. (Only hosts can close rooms)
    checkIfNotHost(roomCode, id);

    // Delete room
    delete rooms[roomCode];

    // Message
    console.log(`Room with code ${roomCode} closed by user: ${id}`);
  } catch (error) {
    console.error("Error closing room: ", error);
  }

  // Current state of the list
  console.log("rooms", rooms);

}

export function handleExitRoom(roomCode: string, id: string) {

  try {
    // Check if there is a room to exit
    checkIfRoomDoesNotExist(roomCode);

    // A user can only exit this room if it is a player of it
    checkIfInThisRoom(roomCode, id);

    // Remove from rooms list as player
    rooms[roomCode].players.delete(id);

    // Message
    console.log(`Room with code ${roomCode} exited by user: ${id}`);

  } catch (error) {
    console.error("Error exiting room: ", error);
  }

  // Current state of the list
  console.log("rooms", rooms);

}

export function handleExitRoomOnDisconnect(id: string) {
  // If user has joined a room, leave it before disconnecting
  const roomCode = getRoomOfUser(id);
  if (roomCode) {
    handleExitRoom(roomCode, id)
  }
}