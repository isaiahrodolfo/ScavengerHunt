import { Category } from '@/types/game';
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface CategoryImages {
  categoryImages: Category[];
  setCategoryImages: (imageUri: string, toCategoryIndex: number, toImageIndex?: number) => void;
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
    setCategoryImages: (imageUri, toCategoryIndex, toImageIndex) =>
      set((state) => {
        // Destructure the relevant category
        const updatedCategories = [...state.categoryImages];
        const category = updatedCategories[toCategoryIndex];

        // Add the new image at the specified index or append if no index provided
        if (category) {
          const newImageUri = imageUri; // Replace with the actual image URI
          if (typeof toImageIndex === 'number' && toImageIndex >= 0) {
            category.images.splice(toImageIndex, 1, newImageUri);
          } else {
            category.images.push(newImageUri);
          }
        }

        return { categoryImages: updatedCategories };
      }),
  }))
);
