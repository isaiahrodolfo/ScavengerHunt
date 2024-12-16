export type User = {
  id: string;
};

export type Game = {
  code: string;
  host: string; // User id
  players: string[]; // User id
};

export const games: Record<string, Game> = {};
