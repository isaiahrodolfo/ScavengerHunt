import { ImageAndTargetLocation } from '@/types/game';
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface SelectedImage {
  selectedImage: ImageAndTargetLocation;
  setSelectedImage: (to: ImageAndTargetLocation) => void;
}

export const useSelectedImage = create<SelectedImage>()(
  // devtools
  ((set) => ({
    selectedImage: {imageUri: '', categoryIndex: 0, imageIndex: 0},
    setSelectedImage: (to) => set((state) => ({ selectedImage: to })),
  }))
);