import { State, Status } from '@/types/game';
import { create, useStore } from 'zustand'
import { devtools } from 'zustand/middleware'

interface ImageStatus {
  imageStatus: Status;
  setImageStatus: (to: Status) => void;
}
 
const createImageStatusStore = () => 
  create<ImageStatus>()(
  // devtools
  ((set) => ({
    imageStatus: 'none',
    setImageStatus: (to) => set((state) => ({ imageStatus: to })),
  }))
);

// Use a unique store per tab
const imageStatusStore = createImageStatusStore();

export const useImageStatus = () => useStore(imageStatusStore);
