import { insertPhoto } from '@/handlers/gameHandlers';
import { Category, ImageAndLocation, ImageAndTargetLocation } from '@/types/game';
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useRoomState } from './useRoomState';

interface CategoryImages {
  categoryImages: Category[];
  setCategoryImages: (roomCode: string, imageAndLocation: ImageAndLocation) => void;
}

export const useCategoryImages = create<CategoryImages>()(
  
  // devtools
  ((set) => ({
    categoryImages: [
      { images: [] },
      { images: [] },
      { images: [] },
      { images: [] },
    ],
    setCategoryImages: (roomCode, {imageUri, categoryIndex, imageIndex}) =>
      set((state) => {
        // Destructure the relevant category
        const updatedCategories = [...state.categoryImages];
        const category = updatedCategories[categoryIndex];
        // // const { roomState, setRoomState } = useRoomState(); // TODO: Will this work?

        // Add the new image at the specified index or append if no index provided
        if (category) {
          const newImageUri = imageUri; // Replace with the actual image URI
          if (typeof imageIndex === 'number' && imageIndex >= 0) {
            console.log('imageIndex'); // testing
            category.images.splice(imageIndex, 1, newImageUri);
            insertPhoto(roomCode, {imageUri, categoryIndex, imageIndex}); // Update the server with the new image
          } else {
            console.log('no imageIndex'); // testing
            category.images.push(newImageUri);
            insertPhoto(roomCode, {imageUri, categoryIndex, imageIndex: 0}); // TESTING
            // insertPhoto(roomState.roomCode, {imageUri, categoryIndex, imageIndex: category.images.length - 1}); // Update the server with the new image
          }
        }

        return { categoryImages: updatedCategories };
      }),
  }))
);
