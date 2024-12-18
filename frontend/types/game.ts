export type State = 'take' | 'put' | 'view' | 'retake';

export type Category = {
  images: string[]; // List of imageUris
};

export type ImageAndTargetLocation = {
  imageUri: string
  categoryIndex?: number;
  imageIndex?: number; // 0+ as index, -1 for append to list
};

export type ImageAndLocation = {
  imageUri: string
  categoryIndex: number;
  imageIndex?: number; // 0+ as index, -1 for append to list
};