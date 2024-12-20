export type State = 'take' | 'put' | 'view' | 'retake';

export type Category = {
  images: string[]; // List of imageUris
};

export type ImageData = {
  imageUri: string
  categoryIndex: number;
  imageIndex: number;
  status: Status;
}

export type ImageAndTargetLocation = {
  imageUri: string
  categoryIndex?: number;
  imageIndex?: number; // 0+ as index, -1 for append to list
};

export type ImageAndLocation = {
  imageUri: string
  categoryIndex: number;
  imageIndex?: number;
};

export type Status = 'unchecked' | 'valid' | 'invalid' | 'none';

export type PlayerData = { 
  imageUri: string; 
  status: Status;
}[][];

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