import Camera from '@/components/Camera';
import CategoryObject from '@/components/CategoryObject';
import { CameraCapturedPicture } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, FlatList, useWindowDimensions } from 'react-native';

export default function GameScreen() {
  const { roomCode, isHost } = useLocalSearchParams();
  const [timer, setTimer] = useState(1000);
  const [hasCameraPermissions, setHasCameraPermissions] = useState<boolean>(false);
  const [photos, setPhotos] = useState<string[]>([]); // Array to hold image URIs

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
      setPhotos((prevPhotos) => [...prevPhotos, image.uri]); // Add the new photo URI to the list
    }
  }, [image]);

  return (
    <View style={styles.container}>

      <Text style={styles.timer}>{timer}</Text>

      {/* Camera View */}
      <Camera
        setHasPermissions={setHasCameraPermissions}
        setImage={setImage}
      />

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
        <CategoryObject backgroundColor="#FF595E" number={4} text="musical instruments" images={photos} />
        <CategoryObject backgroundColor="#FFCA3A" number={6} text="TVs" images={photos} />
        <CategoryObject backgroundColor="#8AC926" number={3} text="fridges/freezers" images={photos} />
        <CategoryObject backgroundColor="#1982C4" number={5} text="different types of bibles" images={photos} />
      </View>
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
});