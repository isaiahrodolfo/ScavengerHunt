import Camera from '@/components/Camera';
import { CameraCapturedPicture } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, FlatList } from 'react-native';

export default function GameScreen() {
  const { roomCode, isHost } = useLocalSearchParams();
  const [timer, setTimer] = useState(30);
  const [hasCameraPermissions, setHasCameraPermissions] = useState<boolean>(false);
  const [photos, setPhotos] = useState<string[]>([]); // Array to hold image URIs

  const [image, setImage] = useState<CameraCapturedPicture | null>(null);

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
      <Text>{roomCode}</Text>
      <Text style={styles.timer}>{timer}</Text>

      {/* Camera View */}
      <Camera
        setHasPermissions={setHasCameraPermissions}
        setImage={setImage}
      />

      {/* Photo List */}
      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.thumbnail} />
        )}
        contentContainerStyle={styles.photoList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  timer: {
    fontSize: 50
  },
  photoList: {
    marginTop: 10,
    marginBottom: 20,
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
    borderRadius: 10,
  },
});
