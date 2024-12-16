import { Game, games } from './types'; // Import types
import { checkIfGameDoesNotExist, checkIfGameExists, checkIfInAnyRoom, checkIfInThisRoom, checkIfNotHost, getRoomOfUser } from './handler-helpers';
;
export function handleCreateGame(roomCode: string, id: string) {

  try {
    // Check that there is no game associated with that game code
    checkIfGameExists(roomCode);
    // TODO: Randomly generated game codes can be duplicated!

    // A user cannot already be part of another room if they want to create this room
    checkIfInAnyRoom(id);

    // Add to games list as host and player
    games[roomCode] = {
      code: roomCode,
      host: id,
      players: new Set([id])
    }

    // Message
    console.log(`Game with code ${roomCode} created by user: ${id}`);

  } catch (error) {
    console.error("Error creating game: ", error);
  }

  // Current state of the list
  console.log("games", games);

}

export function handleJoinGame(roomCode: string, id: string) {

  try {
    // Check if there is a game to join
    checkIfGameDoesNotExist(roomCode);

    // A user cannot already be part of another room if they want to join this room
    checkIfInAnyRoom(id);

    // Add to games list as player
    games[roomCode].players.add(id);

    // Message
    console.log(`Game with code ${roomCode} joined by user: ${id}`);

  } catch (error) {
    console.error("Error joining game: ", error);
  }

  // Current state of the list
  console.log("games", games);

}

export function handleStartGame(roomCode: string, id: string) {

  try {
    // Check that there is a game to be started
    checkIfGameDoesNotExist(roomCode);

    // Check that the user is the host
    checkIfNotHost(roomCode, id);

    // Message
    console.log(`Game with code ${roomCode} started by user: ${id}`);

  } catch (error) {
    console.error("Error starting game: ", error);
  }

  // Current state of the list
  console.log("games", games);

}

export function handleCloseRoom(roomCode: string, id: string) {

  try {
    // Check if there is a room to close
    checkIfGameDoesNotExist(roomCode);

    // Check if user is the host. (Only hosts can close games)
    checkIfNotHost(roomCode, id);

    // Delete game
    delete games[roomCode];

    // Message
    console.log(`Game with code ${roomCode} closed by user: ${id}`);
  } catch (error) {
    console.error("Error closing room: ", error);
  }

  // Current state of the list
  console.log("games", games);

}

export function handleExitRoom(roomCode: string, id: string) {

  try {
    // Check if there is a game to exit
    checkIfGameDoesNotExist(roomCode);

    // A user can only exit this game if it is a player of it
    checkIfInThisRoom(roomCode, id);

    // Remove from games list as player
    games[roomCode].players.delete(id);

    // Message
    console.log(`Game with code ${roomCode} exited by user: ${id}`);

  } catch (error) {
    console.error("Error exiting room: ", error);
  }

  // Current state of the list
  console.log("games", games);

}

export function handleExitRoomOnDisconnect(id: string) {
  // If user has joined a room, leave it before disconnecting
  const roomCode = getRoomOfUser(id);
  if (roomCode) {
    handleExitRoom(roomCode, id)
  }
}