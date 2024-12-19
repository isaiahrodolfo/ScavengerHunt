import { rooms } from '../types';

export function calculateProgress(roomCode: string, id: string) {

  const player = rooms[roomCode].gameData[id]

  let noneSetCount = 0, uncheckedSetCount = 0, validSetCount = 0, invalidSetCount = 0;
  let noneImageCount = 0, uncheckedImageCount = 0, validImageCount = 0, invalidImageCount = 0;

  for (const category of player) {

    // Reset image data for next category
    let noneCategoryImageCount = 0, uncheckedCategoryImageCount = 0, validCategoryImageCount = 0, invalidCategoryImageCount = 0;

    for (const image of category) {

      // Get image data per category 
      switch (image.status) {
        case 'unchecked':
          uncheckedCategoryImageCount += 1;
          break;
        case 'valid':
          validCategoryImageCount += 1;
          break;
        case 'invalid':
          invalidCategoryImageCount += 1;
          break;
        case 'none':
          noneCategoryImageCount += 1;
          break;
        default:
      }
    }

    // testing
    console.log('noneCategoryImageCount', noneCategoryImageCount);
    console.log('uncheckedCategoryImageCount', uncheckedCategoryImageCount);
    console.log('validCategoryImageCount', validCategoryImageCount);
    console.log('invalidCategoryImageCount', invalidCategoryImageCount);


    // Update total image counts
    noneImageCount += noneCategoryImageCount;
    uncheckedImageCount += uncheckedCategoryImageCount;
    validImageCount += validCategoryImageCount;
    invalidImageCount += invalidCategoryImageCount;

    // Use category images to determine status of sets

    // If at least one image is invalid, the whole set is
    if (invalidCategoryImageCount) {
      invalidSetCount += 1;
    // If all images are valid, the whole set is
    } else if (!(uncheckedCategoryImageCount || invalidCategoryImageCount || noneCategoryImageCount)) {
      validSetCount += 1;
    // If all images were taken (no 'none' status), none are invalid, and at least one of them is in review, the whole set is in review
    } else if (!(noneCategoryImageCount || invalidCategoryImageCount) && uncheckedCategoryImageCount) { // not(a) and not(b) = not(a or b)
      uncheckedSetCount += 1;
    } else {
      noneSetCount += 1;
    }
    
  }

  return {
    id,
    images: {
      none: noneImageCount,
      unchecked: uncheckedImageCount,
      valid: validImageCount,
      invalid: invalidImageCount
    },
    sets: {
      none: noneSetCount,
      unchecked: uncheckedSetCount,
      valid: validSetCount,
      invalid: invalidSetCount
    }
  };
}