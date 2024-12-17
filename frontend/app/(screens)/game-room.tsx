import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { socket } from '@/utils/socket'
import { closeRoom, exitRoom, startRoom } from '@/handlers/roomHandlers';

export default function GameRoomScreen() {

  // Get local search params
  const { roomCode, isHost } = useLocalSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for storing error message

  const roomCodeString = roomCode.toString()
  const isHostBool = isHost == 'true'; // Change from string (since in a url format) to boolean

  useEffect(() => {
    // Receive exit room emission, tell server to exit the Socket room and go back home
    socket.on('exitRoom', () => {
      socket.emit('exitRoom', { roomCode: roomCode, roomIsClosed: true });
      router.replace('/(screens)/home');
    });

    // Receive start room emission, tell server to start the game
    socket.on('startGame', () => {
      router.replace({ // TODO: Sync countdown and game timer with host's timer
        pathname: '/(screens)/countdown',
        params: { roomCode, isHost }
      });
    });
  }, []);

  // Methods
  async function handleStartRoom() {
    const res = await startRoom(roomCodeString);
    if (res) {
      setErrorMessage(res);
    } else {
      router.replace({
        pathname: '/(screens)/countdown',
        params: { roomCode, isHost }
      });
    }
  }

  async function handleCloseRoom() {
    const res = await closeRoom(roomCodeString);
    if (res) {
      setErrorMessage(res);
    } else {
      router.replace('/(screens)/home');
    }
  }

  async function handleExitRoom() {
    const res = await exitRoom(roomCodeString);
    if (res) {
      setErrorMessage(res);
    } else {
      router.replace('/(screens)/home');
    }
  }

  return (
    <View style={styles.container}>
      <Text>Game Code: {roomCode}</Text>
      {isHostBool ? (
        <>
          <Button title="Start Game" onPress={handleStartRoom} />
          <Button title="Close Room" onPress={handleCloseRoom} />
        </>
      ) : (
        <Button title="Exit Game" onPress={handleExitRoom} />
      )}
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>} {/* Display error message */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    color: 'red',
    marginTop: 10
  },
});
