import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import { ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React, { useRef, useState } from 'react';

interface CameraProps {
  setHasPermissions: (hasPermissions: boolean) => void;
  setImage: (image: CameraCapturedPicture | null) => void;
  isSelecting: boolean;
}

export default function Camera({ setImage, setHasPermissions, isSelecting }: CameraProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const cameraRef = useRef<any>(null);

  if (!permission) {
    return <ActivityIndicator size="large" />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  setHasPermissions(true);

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync();
        setImage(photo);
        setImageUrl(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  }

  function resetImage() {
    setImage(null);
    setImageUrl('');
  }

  return (
    <View style={styles.container}>
      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        onCameraReady={() => setIsCameraReady(true)}
      >
        {/* Image Overlay */}
        {isSelecting && (
          <Image
            style={[styles.camera, { position: 'absolute', }]}
            source={{ uri: imageUrl }}
          />
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* Capture or Retake Button */}
      <TouchableOpacity
        style={styles.captureButton}
        onPress={() => {
          isSelecting ? resetImage() : takePicture();
        }}
      >
        <Text style={styles.text}>{isSelecting ? 'Retake' : 'Take Photo'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  camera: {
    flex: 1,
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: 'black',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
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
});
