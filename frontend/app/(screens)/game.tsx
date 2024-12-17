import Camera from '@/components/Camera';
import CategoryObject from '@/components/CategoryObject';
import { CameraCapturedPicture } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, FlatList, useWindowDimensions } from 'react-native';

type Category = {
  images: string[]
}

type ImageTargetLocation = {
  category: number,
  imageIndex: number, // 0+ as index, -1 for append to list
}

export default function GameScreen() {
  const { roomCode, isHost } = useLocalSearchParams();
  const [timer, setTimer] = useState(1000);
  const [hasCameraPermissions, setHasCameraPermissions] = useState<boolean>(false);

  const [imageTargetLocation, setImageTargetLocation] = useState<ImageTargetLocation | null>(null);

  const [photos, setPhotos] = useState<string[]>([]); // Array to hold image URIs
  const [categoryImages, setCategoryImages] = useState<Category[]>([
    { images: [] }, // Category 0
    { images: [] }, // Category 1
    { images: [] }, // Category 2
    { images: [] }, // Category 3
  ]);

  const [image, setImage] = useState<CameraCapturedPicture | null>(null);

  const { width } = useWindowDimensions();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    if (timer === 0) {
      clearInterval(interval);
      router.replace({
        pathname: '/(screens)/game-over',
        params: { roomCode, isHost }
      });
    }

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (image) {
      if (imageTargetLocation) {
        setCategoryImages(categoryImages => {
          const newCategoryImages = [...categoryImages]; // Create a copy of the old array
          const newImages = newCategoryImages[imageTargetLocation.category].images; // Get the old array's image list
          newImages[imageTargetLocation.imageIndex] = image.uri; // Replace the image with the new one
          newCategoryImages[imageTargetLocation.category] = { images: newImages }; // Replace the category with the one with an updated image
          return newCategoryImages; // Return the updated array
        });
      } else {
        // TODO: Now ask the user to select a location
      }
      // setPhotos((prevPhotos) => [...prevPhotos, image.uri]); // Add the new photo URI to the list
    }
  }, [image]);

  const handleCategorySelection = (categoryIndex: number) => {
    if (image) {
      setCategoryImages((prevCategories) => {
        const updatedCategories = [...prevCategories];
        updatedCategories[categoryIndex] = {
          images: [...updatedCategories[categoryIndex].images, image.uri], // Append image
        };
        return updatedCategories;
      });
      setImageTargetLocation(null); // Reset the target location
      setImage(null); // Reset the captured image
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.timer}>{timer}</Text>

      {/* Camera View */}
      <Camera
        setHasPermissions={setHasCameraPermissions}
        setImage={setImage}
      />

      <View style={styles.buttonContainer}>
        {categoryImages.map((_, index) => (
          <Text
            key={index}
            style={styles.categoryButton}
            onPress={() => handleCategorySelection(index)}
          >
            Add to Category {index + 1}
          </Text>
        ))}
      </View>

      {/* Photo List */}
      {/* <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.thumbnail} />
        )}
        contentContainerStyle={styles.photoList}
      /> */}
      <View style={[styles.categoryObjects, { width: width - 20 }]}>
        <CategoryObject backgroundColor="#FF595E" number={4} text="musical instruments" images={categoryImages[0]?.images || []} />
        <CategoryObject backgroundColor="#FFCA3A" number={6} text="TVs" images={categoryImages[1]?.images || []} />
        <CategoryObject backgroundColor="#8AC926" number={3} text="fridges/freezers" images={categoryImages[2]?.images || []} />
        <CategoryObject backgroundColor="#1982C4" number={5} text="different types of bibles" images={categoryImages[3]?.images || []} />      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  timer: {
    fontSize: 20,
    // fontSize: 50,
    // fontWeight: 'bold',
  },
  cameraPlaceholder: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    width: '100%',
    marginVertical: 10,
    borderRadius: 10,
  },
  categoryObjects: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    maxHeight: 300,
    flex: 2,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  categoryButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#007BFF',
    color: 'white',
    borderRadius: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },

});