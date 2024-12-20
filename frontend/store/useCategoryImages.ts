import { insertImage } from '@/handlers/gameHandlers';
import { Category, ImageAndLocation } from '@/types/game';
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface CategoryImages {
  categoryImages: Category[];
  setCategoryImages: (imageAndLocation: ImageAndLocation) => void;
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
    setCategoryImages: ({ imageUri, categoryIndex, imageIndex }) => {
      // First, update the state synchronously
      set((state) => {
        const updatedCategories = [...state.categoryImages];
        const category = updatedCategories[categoryIndex];

        if (category) {
          const newImageUri = imageUri;

          if (typeof imageIndex === 'number' && imageIndex >= 0) {
            category.images.splice(imageIndex, 1, newImageUri);
          } else {
            category.images.push(newImageUri);
          }
        }

        return { categoryImages: updatedCategories };
      });
    },
  }))
);
