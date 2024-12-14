type User = {
  id: string;
}

type Game = {
  code: string;
  host: User;
  players: User[];
}