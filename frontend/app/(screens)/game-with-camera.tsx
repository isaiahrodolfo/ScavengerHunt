import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ActivityIndicator, Image, FlatList } from 'react-native';

export default function GameScreen() {
  const { roomCode, isHost } = useLocalSearchParams();
  const [timer, setTimer] = useState(30);

  // State variables for camera
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [photos, setPhotos] = useState<string[]>([]); // Store the list of captured photo URIs

  const cameraRef = useRef<any>(null); // Reference to the camera

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

  if (!permission) {
    // Camera permissions are still loading.
    return <ActivityIndicator size={'large'} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync();
        setPhotos((prevPhotos) => [...prevPhotos, photo.uri]); // Add the new photo to the list
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.timer}>{timer}</Text>

      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* Take Picture Button */}
      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <Text style={styles.text}>Take Picture</Text>
      </TouchableOpacity>

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
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  captureButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 10,
    marginVertical: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
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
