import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Camera from '@/components/Camera';
import CategoryObject from '@/components/CategoryObject';
import { CameraCapturedPicture } from 'expo-camera';

type Category = {
  images: string[];
};

type ImageTargetLocation = {
  category: number;
  imageIndex: number; // 0+ as index, -1 for append to list
};

export default function GameScreen() {
  const { roomCode, isHost } = useLocalSearchParams();
  const [timer, setTimer] = useState(1000);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [image, setImage] = useState<CameraCapturedPicture | null>(null);
  const [categoryImages, setCategoryImages] = useState<Category[]>([
    { images: [] },
    { images: [] },
    { images: [] },
    { images: [] },
  ]);
  const { width } = useWindowDimensions();

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

  // Handle image addition to a selected category
  const handleCategoryPressed = (index: number) => {
    if (isSelecting && image) {
      setCategoryImages((prevCategories) => {
        const updatedCategories = [...prevCategories];
        updatedCategories[index] = {
          images: [...updatedCategories[index].images, image.uri],
        };
        return updatedCategories;
      });
      setIsSelecting(false);
      setImage(null); // Reset captured image
    }
  };

  // Once an image is captured, toggle selection mode
  useEffect(() => {
    if (image) {
      setIsSelecting(true);
    } else {
      setIsSelecting(false);
    }
  }, [image]);

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{timer}</Text>

      {/* Camera View */}
      <View>
        <Camera setHasPermissions={() => { }} setImage={setImage} isSelecting={isSelecting} />
      </View>

      <View style={[styles.categoryObjects, { width: width - 20 }]}>
        {categoryImages.map((category, index) => (
          <CategoryObject
            key={index}
            categoryIndex={index}
            backgroundColor={getCategoryColor(index)}
            onPress={() => handleCategoryPressed(index)} // Triggered on press
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
  // camera: {
  //   flex: 1,
  //   aspectRatio: 9 / 16, // Maintain 4:3 aspect ratio
  //   width: '50%',
  // },
  timer: { fontSize: 20 },
  categoryObjects: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', width: '100%' },
});
