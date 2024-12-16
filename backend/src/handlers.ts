import { Game, games } from './types'; // Import types
import { checkIfGameExists, checkIfHost } from './handler-helpers';
;
export function handleCreateGame(gameCode: string, id: string) {

  try {
    checkIfGameExists(gameCode);

    // Check if the user is already a host or player in any game
    const existingGame = Object.values(games).find(
      (game) => game.host === id || game.players.some((pid) => pid === id)
    );

    if (existingGame) {
      return Error(`User ${id} is already part of game ${existingGame.code}`);
    }

    // Add to games list as host and player
    games[gameCode] = {
      code: gameCode,
      host: id,
      players: [id]
    }

    // Message
    console.log(`Game with code ${gameCode} created by user: ${id}`);

  } catch (error) {
    console.error("Error: ", error);
  }

  // Current state of the list
  console.log("games", games);

}

export function handleJoinGame(gameCode: string, id: string) {

  try {

    // Check if the user is already a host or player in any game
    const existingGame = Object.values(games).find(
      (game) => game.host === id || game.players.some((pid) => pid === id)
    );

    if (existingGame) {
      console.error(`User ${id} is already part of game ${existingGame.code}`);
      return;
    }

    try {
      // Add to games list as player
      games[gameCode].players.push(id);
    } catch (error) {
      console.error(`Error: game with code ${gameCode} does not exist`)
    }

    // Message
    console.log(`Game with code ${gameCode} join by user: ${id}`);

  } catch (error) {
    
  }

  // Current state of the list
  console.log("games", games);

}

export function handleStartGame(gameCode: string, id: string) {

  try {

    // Check if user is the host. (Only hosts can start games)
    if (games[gameCode].host != id) {
      console.error(`User ${id} cannot start game with code ${gameCode} since user is not the host`);
      return;
    }

    // Message
    console.log(`Game with code ${gameCode} started by user: ${id}`);

  } catch (error) {

  }

  // Current state of the list
  console.log("games", games);

}

export function handleCloseRoom(gameCode: string, id: string) {

  try {
    // Check if there is a room to close
    checkIfGameExists(gameCode);

    // Check if user is the host. (Only hosts can close games)
    checkIfHost(gameCode, id);

    // Delete game
    delete games[gameCode];

    // Message
    console.log(`Game with code ${gameCode} closed by user: ${id}`);
  } catch (error) {
    console.error("Error: ", error);
  }

  // Current state of the list
  console.log("games", games);

}