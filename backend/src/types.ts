// export type User = {
//   id: string;
// };

export type Room = {
  code: string;
  host: string; // User id
  players: Record<string, Profile>; // User id, name
  started: boolean;
  hostIsModerator: boolean;
  gameGoals: GameGoals;
  gameData: GameData;
  gameProgress: PlayerProgressState;
  hostOnPlayerPage: string;
};

export type Profile = {
  id: string;
  name: string;
}

export const rooms: Record<string, Room> = {};

export type ImageAndLocation = {
  imageUri: string;
  categoryIndex: number;
  imageIndex?: number;
}

export type Status = 'unchecked' | 'valid' | 'invalid' | 'none';

export type GameGoals = {
  categoryName: string;
  imageCount: number;
}[]

export type GameData = Record<
  string, // User ID
  { imageUri: string; status: Status }[][] // 2D array of objects with image and status
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
    roomCode?: string;
    data?: any; // Any data you want to return
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