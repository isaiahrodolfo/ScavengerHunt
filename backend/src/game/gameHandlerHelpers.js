"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateProgress = calculateProgress;
const types_1 = require("../types");
function calculateProgress(roomCode, id) {
    const gameGoals = types_1.rooms[roomCode].gameGoals;
    const player = types_1.rooms[roomCode].gameData[id];
    let noneSetCount = 0, uncheckedSetCount = 0, validSetCount = 0, invalidSetCount = 0;
    let noneImageCount = 0, uncheckedImageCount = 0, validImageCount = 0, invalidImageCount = 0;
    let completedImageCount = 0;
    player.forEach((category, categoryIndex) => {
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
                default:
                    noneCategoryImageCount += 1;
            }
        }
        // testing
        console.log('noneCategoryImageCount', noneCategoryImageCount);
        console.log('uncheckedCategoryImageCount', uncheckedCategoryImageCount);
        console.log('validCategoryImageCount', validCategoryImageCount);
        console.log('invalidCategoryImageCount', invalidCategoryImageCount);
        // Use category images to determine status of sets
        // If at least one image is invalid, the whole set is
        if (invalidCategoryImageCount) {
            invalidSetCount += 1;
            // If all images are valid, the whole set is
        }
        else if (validCategoryImageCount == gameGoals[categoryIndex].imageCount) {
            validSetCount += 1;
            // All counted valid images are actually completed
            completedImageCount += validCategoryImageCount;
            validCategoryImageCount = 0;
            // If all images were taken, none are invalid, the whole set is not all valid, and at least one of them is in review, the whole set is in review (i.e. green and yellow only)
        }
        else if (category.length >= gameGoals[categoryIndex].imageCount) { // not(a) and not(b) = not(a or b)
            uncheckedSetCount += 1;
        }
        else {
            noneSetCount += 1;
        }
        // Update total image counts
        noneImageCount += noneCategoryImageCount;
        uncheckedImageCount += uncheckedCategoryImageCount;
        validImageCount += validCategoryImageCount;
        invalidImageCount += invalidCategoryImageCount;
    });
    return {
        id,
        images: {
            none: noneImageCount,
            unchecked: uncheckedImageCount,
            valid: validImageCount,
            invalid: invalidImageCount,
            completed: completedImageCount // Images whose sets are also completed
        },
        sets: {
            none: noneSetCount,
            unchecked: uncheckedSetCount,
            valid: validSetCount,
            invalid: invalidSetCount
        }
    };
}
