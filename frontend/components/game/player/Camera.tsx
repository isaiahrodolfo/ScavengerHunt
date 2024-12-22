import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import { ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useGameState } from '@/store/useGameState';
import { useSelectedImage } from '@/store/useSelectedImage';
import { useCategoryImages } from '@/store/useCategoryImages';
import { useRoomState } from '@/store/useRoomState';
import { insertImage } from '@/handlers/gameHandlers';
import { socket } from '@/utils/socket';
import { usePlayerData } from '@/store/usePlayerData';
import CaptureButton from './CaptureButton';
import FlipCameraButton from './FlipCameraButton';

interface CameraProps {
  setHasPermissions: (hasPermissions: boolean) => void;
}

export default function Camera({ setHasPermissions }: CameraProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);

  const { gameState, setGameState } = useGameState();
  const { selectedImage, setSelectedImage } = useSelectedImage();
  const { categoryImages, setCategoryImages } = useCategoryImages();
  const { playerData, setPlayerData } = usePlayerData();
  const { roomState, setRoomState } = useRoomState();

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
    // setRoomState({ ...roomState }); // TESTING: Using the flip camera button to check roomState
    // socket.emit('logState', roomState.roomCode);// TESTING: Using the flip camera button to check server state
    console.log('playerData', playerData);// TESTING: Using the flip camera button to check playerData
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current && isCameraReady) { // Check if the camera has been fully loaded in and is ready
      try {
        const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync();

        switch (gameState) {
          case 'take':
            setSelectedImage({ imageUri: photo.uri });
            setGameState('put');  // ...and place it in a category
            break;
          case 'retake':
            // TODO: Fix exclamation mark in selectedImage.categoryIndex!
            console.log('Previous selected image', selectedImage.categoryIndex, 'image', selectedImage.imageIndex);

            console.log('Retaking photo for category', selectedImage.categoryIndex, 'image', selectedImage.imageIndex);
            // Put the image where the user wanted to replace it
            console.log('putting image into category...'); // testing

            const imageUri = photo.uri;
            const categoryIndex = selectedImage.categoryIndex!;
            const imageIndex = selectedImage.imageIndex!;

            setCategoryImages({ imageUri, categoryIndex, imageIndex });
            // setPlayerData([...playerData, playerData[categoryIndex][imageIndex] = {imageUri: '', status: 'unchecked'}])

            // UPDATE PLAYER DATA LOCALLY
            const updatedPlayerData = playerData;
            updatedPlayerData[categoryIndex][imageIndex] = { imageUri, status: 'unchecked' }

            console.log('updatedPlayerData', updatedPlayerData);
            setPlayerData(updatedPlayerData);

            // Now update the server with the new image
            const res = await insertImage(roomState.roomCode, { imageUri, categoryIndex, imageIndex: imageIndex })
            if (res) {
              console.log(res);
            }
            setGameState('take'); // ...and continue the main game loop
            break;
        }
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  }

  function resetImage() {
    setSelectedImage({ imageUri: '' });
  }

  function handleCaptureButtonPressed() {
    console.log('capture button pressed');
    switch (gameState) {
      case 'take': // Pressed the "Take" button, so take a picture...
        takePicture();
        break;
      case 'put': // Pressed the "Retake" button, so restart...
        resetImage();
        setGameState('take'); // ...and take another picture
        break;
      case 'view': // Pressed the "Retake" button, so restart
        setGameState('retake'); // ...and retake the picture
        break;
      case 'retake': // Pressed the "Take" button, so retake the picture
        takePicture();
        break;
      default: break;
    }
  }

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={styles.container}
      >
        {/* Camera View */}
        <CameraView
          ref={cameraRef}
          style={[styles.camera, { aspectRatio: 3 / 4, }]}
          facing={facing}
          onCameraReady={() => setIsCameraReady(true)}
        >
          {/* Image Overlay */}
          {['put', 'view'].includes(gameState) && (
            <Image
              style={StyleSheet.absoluteFillObject}
              source={{ uri: selectedImage.imageUri }}
            />
          )}
          {/* Flip Camera Button */}
          <View style={styles.flipCameraButtonContainer}>
            <FlipCameraButton onPress={toggleCameraFacing} />
          </View>
        </CameraView>

        {/* Capture or Retake Button */}
      </View>
      <CaptureButton onPress={handleCaptureButtonPressed} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 220
  },
  camera: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  flipCameraButtonContainer: {
    top: 240,
    left: 170,
    position: 'relative'
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
