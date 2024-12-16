export type User = {
  id: string;
};

export type Game = {
  code: string;
  host: string; // User id
  players: Set<string>; // User id
};

export const games: Record<string, Game> = {};
