import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ActivityIndicator, Button, GestureResponderEvent } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Camera from '@/components/Camera';
import CategoryObject from '@/components/CategoryObject';
import { CameraCapturedPicture } from 'expo-camera';
import { useGameState } from '@/store/useGameState';
import { Category, ImageAndTargetLocation } from '@/types/game';
import { useSelectedImage } from '@/store/useSelectedImage';
import { useCategoryImages } from '@/store/useCategoryImages';

export default function GameScreen() {
  const { roomCode, isHost } = useLocalSearchParams();
  const [timer, setTimer] = useState(1000);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string>('');
  const { width } = useWindowDimensions();

  const [target, setTarget] = useState<ImageAndTargetLocation>();
  const { gameState, setGameState } = useGameState();
  const { selectedImage, setSelectedImage } = useSelectedImage();
  const { categoryImages, setCategoryImages } = useCategoryImages();

  // Timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    if (timer === 0) {
      clearInterval(interval);
      router.replace({
        pathname: '/(screens)/game-over',
        params: { roomCode, isHost },
      });
    }

    return () => clearInterval(interval);
  }, [timer]);

  // // Once an image is captured...
  // useEffect(() => {
  //   if (imageUri) {
  //     switch (gameState) {
  //       case 'take':
  //         setIsSelecting(true); // Now put the image where it should go
  //         setGameState('put');
  //       case 'retake':
  //         ; // Retake that image
  //       default: break;
  //     }
  //   }
  //   // TODO: What is this below for?
  //   else {
  //     setIsSelecting(false);
  //   }
  // }, [imageUri]);

  // // Place photo at specifc location (overwrite old photo)
  // const placeImageAtLocation = (target: ImageAndTargetLocation) => {
  //   // TODO: If longer than the current length, tack to end of current length, not end of entire list
  //   setCategoryImages((prevCategories) => {
  //     const updatedCategories = [...prevCategories];
  //     const updatedImages = updatedCategories[target.categoryIndex].images;
  //     updatedImages[target.imageIndex] = target.imageUri;
  //     updatedCategories[target.categoryIndex] = { images: updatedImages };
  //     return updatedCategories;
  //   });
  // }

  // // Once an image is pressed...
  // useEffect(() => {
  //   if (target) {
  //     switch (gameState) {
  //       case 'take': // Selected a image to view
  //         setGameState('view');
  //       case 'retake': ; // Toggle selection mode
  //       default: break;
  //     }
  //   }
  // }, [target])

  // // Once a category is pressed...
  // function handleCategoryPressed(categoryIndex: number) {
  //   switch (gameState) {
  //     case 'put': // Put the image the user just took in the selected category
  //       addImageToCategory(categoryIndex);
  //       setGameState('take');
  //     default: break;
  //   }
  // };

  // // Once an image is pressed...
  // function handleImagePressed(target: ImageAndTargetLocation): void {
  //   switch (gameState) {
  //     case 'take': // Selected an image to view
  //     case 'view': // View another image
  //       setImageUri(target.imageUri); // Set the selected image URI
  //       setTarget(target); // Save the target for further actions
  //       setGameState('view'); // Stay or switch to view mode
  //       break;
  //     // TODO: Move the image to a different location
  //     default: break;
  //   }
  // }

  function handlePressCancel(event: GestureResponderEvent): void {
    switch (gameState) {
      case 'view': // Canceled viewing an image
        setGameState('take');
      case 'retake': // Canceled retaking an image
        setGameState('take');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{timer}</Text>

      {/* Camera View */}
      <View style={styles.camera}>
        <Camera setHasPermissions={() => { }} />
      </View>

      <Button title={'Cancel'} onPress={handlePressCancel} />

      <View style={[styles.categoryObjects, { width: width - 20 }]}>
        {categoryImages.map((category, index) => (
          <CategoryObject
            key={index}
            categoryIndex={index}
            backgroundColor={getCategoryColor(index)}
            isSelecting={isSelecting}
            number={getCategoryNumber(index)}
            text={getCategoryName(index)}
            images={category.images}
          />
        ))}
      </View>
    </View>
  );
}

// TODO: Make a JSON object that stores this data
function getCategoryNumber(index: number) {
  const numbers = [4, 6, 3, 5];
  return numbers[index] || 0;
}

function getCategoryColor(index: number) {
  const colors = ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4'];
  return colors[index] || '#ccc';
}

function getCategoryName(index: number) {
  const colors = ['musical instruments', 'TVs', 'fridges/freezers', 'different types of bibles'];
  return colors[index] || '#ccc';
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: 'white' },
  camera: {
    flex: 1,
    aspectRatio: 3 / 4,
    // width: '50%',
  },
  timer: { fontSize: 20 },
  categoryObjects: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', width: '100%' },
});
