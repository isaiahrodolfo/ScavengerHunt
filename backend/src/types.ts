// export type User = {
//   id: string;
// };

export type Room = {
  code: string;
  host: string; // User id
  players: Set<string>; // User id
  started: boolean;
  hostIsModerator: boolean;
  gameData: GameData;
  gameProgress: PlayerProgressState;
};

export const rooms: Record<string, Room> = {};

export type ImageAndLocation = {
  imageUri: string;
  categoryIndex: number;
  imageIndex?: number;
}

export type Status = 'unchecked' | 'valid' | 'invalid' | 'none';

export type GameData = Record<
  string, // User ID
  { image: string; status: Status }[][] // 2D array of objects with image and status
>;

// gameData: {
//   user1: [
//     [{image: '', status: ''}, {image: '', status: ''}],
//     [{image: '', status: ''}, {image: '', status: ''}]
//   ],
//   user2: [
//     [{image: '', status: ''}, {image: '', status: ''}],
//     [{image: '', status: ''}, {image: '', status: ''}]
//   ]
// }

export type Callback = (
  response: { 
    success: boolean; 
    type?: string; 
    error?: string; 
    roomCode?: string 
  }
) => void;

export type PlayerProgressState = Record<string, PlayerProgressValue>;

export type PlayerProgressValue = {
  id: string, 
  images: {
    none: number,
    unchecked: number, 
    valid: number, 
    invalid: number
  }, 
  sets: {
    none: number,
    unchecked: number, 
    valid: number, 
    invalid: number
  }
};