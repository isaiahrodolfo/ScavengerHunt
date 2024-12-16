import { Game, games } from './types'; // Import types

/**
 * Checks if the game code does not have an existing room associated with it
 * @param gameCode 
 * @returns Error if a game with given game code is found
 */

export function checkIfGameExists(gameCode: string): (Error | void) {
  if (Object.values(games).find((game) => game.code === gameCode)) {
    console.log(`A game already exists with code ${gameCode}.`)
    throw Error(`A game already exists with code ${gameCode}.`);
  }
}

/**
 * Checks if the game code has an existing room associated with it
 * @param gameCode 
 * @returns Error if no game with given game code is found
 */

export function checkIfGameDoesNotExist(gameCode: string): (Error | void) {
  if (!Object.values(games).find((game) => game.code === gameCode)) {
    console.log(`No game exists with code ${gameCode}.`)
    throw Error(`No game exists with code ${gameCode}.`);
  }
}

/**
 * Checks if user is the host of the room with the given room id. If not, returns error
 * @param gameCode 
 * @param id 
 * @returns Error if user is not the host
 */

export function checkIfNotHost(gameCode: string, id: string): (Error | void) {
  if (games[gameCode].host != id) {
    throw Error(`User ${id} cannot start game with code ${gameCode} since user is not the host.`);
  }
}

/**
 * Gets the room of the given user
 * @param id 
 * @returns string if room exists, undefined otherwise
 */

export function getRoomOfUser(id: string): (string | undefined) {
  const existingGame = Object.values(games).find((game) => game.players.has(id));

  return existingGame?.code; // Returns the game code or undefined  
}

/**
 * Checks if the user is already a host or player in any room
 * @param id 
 * @returns Error if user is already in a room
 */

export function checkIfInAnyRoom(id: string): (Error | void) {
  const roomCode = getRoomOfUser(id);

  if (roomCode) {
    console.log(`User ${id} is already part of game ${roomCode}.`);
  } else {
    console.log(`User ${id} is not part of any game.`);
  }
}

/**
 * Checks if the user is already a host or player in the given room
 * @param gameCode
 * @param id 
 * @returns Error if user is not in the given room
 */
export function checkIfInThisRoom(gameCode: string, id: string): (Error | void) {
  // Check if the user is the host or a player in the room
  const game = games[gameCode];
  if (game.host !== id && !game.players.has(id)) {
    throw Error(`User ${id} is not part of the game with code ${gameCode}.`);
  }
}
