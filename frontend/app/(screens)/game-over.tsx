import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { socket } from '@/utils/socket'
import { closeRoom, exitRoom, restartRoom } from '@/handlers/roomHandlers';
import { useRoomState } from '@/store/useRoomState';

export default function GameOverScreen() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for storing error message

  const { roomState, setRoomState } = useRoomState();

  async function handleRestartRoom() {
    if (roomState.isHost) {
      // Host restarts game
      const res = await restartRoom(roomState.roomCode);
      if (res) {
        setErrorMessage(res);
      } else {
        router.replace('/(screens)/game-room');
      }
    } else {
      // TODO: Wait for host to restart game before allowed to go back to game room
      // TODO: Something like "Waiting for the host..."
      router.replace('/(screens)/game-room');
    }

  }

  async function handleCloseRoom() {
    const res = await closeRoom(roomState.roomCode);
    if (res) {
      setErrorMessage(res);
    } else {
      setRoomState({ roomCode: '', isHost: false, isModerator: false, hasModerator: false });
      router.replace('/(screens)/home');
    }
  }

  async function handleExitRoom() { // TODO: Users are still in room after game over, and not redirected to game room
    const res = await exitRoom(roomState.roomCode);
    if (res) {
      setErrorMessage(res);
    } else {
      setRoomState({ roomCode: '', isHost: false, isModerator: false, hasModerator: false });
      router.replace('/(screens)/home');
    }
  }

  return (
    <View style={styles.container}>

      <Text>Play Again?</Text>
      <Button title="Back to Game Room" onPress={handleRestartRoom} />
      {roomState.isHost && <Button title="Close Game" onPress={handleCloseRoom} />}
      {!roomState.isHost && <Button title="Exit Game" onPress={handleExitRoom} />}
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
