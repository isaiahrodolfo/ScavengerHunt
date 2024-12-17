export type User = {
  id: string;
};

export type Room = {
  code: string;
  host: string; // User id
  players: Set<string>; // User id
  started: boolean;
};

export const rooms: Record<string, Room> = {};
