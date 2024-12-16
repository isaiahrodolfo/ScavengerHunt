import { Game, games } from './types'; // Import types

/**
 * Checks if the game code has an existing room associated with it
 * @param gameCode 
 * @returns Error if no game with given game code is found
 */

export function checkIfGameExists(gameCode: string): (Error | void) {
  if (Object.values(games).find((game) => game.code === gameCode)) {
    return Error(`No game exists with code ${gameCode}`);
  }
}

/**
 * Checks if user is the host of the room with the given room id. If not, returns error
 * @param gameCode 
 * @param id 
 * @returns Error if user is not the host
 */

export function checkIfHost(gameCode: string, id: string): (Error | void) {
  if (games[gameCode].host != id) {
    return Error(`User ${id} cannot start game with code ${gameCode} since user is not the host`);
  }
}

/**
 * Checks if the user is already a host or player in any room
 * @param id 
 * @returns Error if user is already in a room
 */

export function checkIfInRoom(id: string): (Error | void) {
  const existingGame = Object.values(games).find((game) => game.players.some((pid) => pid === id));

  if (existingGame) {
    return Error(`User ${id} is already part of game ${existingGame.code}`);
  }
  
}