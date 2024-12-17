import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { socket } from '@/utils/socket'
import { closeRoom, exitRoom, restartRoom } from '@/handlers/roomHandlers';

export default function GameOverScreen() {
  const { roomCode, isHost } = useLocalSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for storing error message

  const isHostBool = isHost == 'true';
  const roomCodeString = roomCode.toString();

  async function handleRestartRoom() {
    if (isHostBool) {
      // Host restarts game
      const res = await restartRoom(roomCodeString);
      if (res) {
        setErrorMessage(res);
      } else {
        router.replace({
          pathname: '/(screens)/game-room',
          params: { roomCode, isHost }
        });
      }
    } else {
      // TODO: Wait for host to restart game before allowed to go back to game room
      // TODO: Something like "Waiting for the host..."
      router.replace({
        pathname: '/(screens)/game-room',
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

  async function handleExitRoom() { // TODO: Users are still in room after game over, and not redirected to game room
    const res = await exitRoom(roomCodeString);
    if (res) {
      setErrorMessage(res);
    } else {
      router.replace('/(screens)/home');
    }
  }

  return (
    <View style={styles.container}>
      <Text>{roomCode}</Text>
      <Text>Play Again?</Text>
      <Button title="Back to Game Room" onPress={handleRestartRoom} />
      {isHostBool && <Button title="Close Game" onPress={handleCloseRoom} />}
      {!isHostBool && <Button title="Exit Game" onPress={handleExitRoom} />}
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
