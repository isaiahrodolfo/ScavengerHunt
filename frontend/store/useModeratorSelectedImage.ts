import { ImageAndTargetLocation } from '@/types/game';
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface ModeratorSelectedImage {
  moderatorSelectedImage: {imageUri: string; categoryIndex: number | undefined; imageIndex: number | undefined};
  setModeratorSelectedImage: (to: {imageUri: string; categoryIndex: number | undefined; imageIndex: number | undefined}) => void;
}

export const useModeratorSelectedImage = create<ModeratorSelectedImage>()(
  // devtools
  ((set) => ({
    moderatorSelectedImage: {imageUri: '', categoryIndex: 0, imageIndex: 0},
    setModeratorSelectedImage: (to) => set((state) => ({ moderatorSelectedImage: to })),
  }))
);