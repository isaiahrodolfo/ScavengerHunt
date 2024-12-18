import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface SelectedImage {
  selectedImageUri: string;
  setSelectedImageUri: (to: string) => void;
}

export const useSelectedImageUri = create<SelectedImage>()(
  devtools((set) => ({
    selectedImageUri: 'take',
    setSelectedImageUri: (to) => set((state) => ({ selectedImageUri: to })),
  }))
);