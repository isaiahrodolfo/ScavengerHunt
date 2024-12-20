import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Checkbox } from 'expo-checkbox';
import { socket } from '@/utils/socket'
import { closeRoom, exitRoom, startRoom } from '@/handlers/roomHandlers';
import { useRoomState } from '@/store/useRoomState';
import { PlayerData } from '@/types/game';
import { usePlayerData } from '@/store/usePlayerData';
import { useGameGoals } from '@/store/useGameGoals';

export default function GameRoomScreen() {

  const { roomState, setRoomState } = useRoomState();
  const { setPlayerData } = usePlayerData();
  const { setGameGoals } = useGameGoals();

  // Get local search params
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for storing error message
  const [isModerator, setModerator] = useState<boolean>(roomState.isModerator);

  useEffect(() => {
    // Receive exit room emission, tell server to exit the Socket room and go back home
    socket.on('exitRoom', () => {
      socket.emit('exitRoom', { roomCode: roomState.roomCode, roomIsClosed: true });
      router.replace('/(screens)/home');
    });

    // Receive start game emission
    // ? tell server to start the game (we're not doing that here)
    socket.on('startGame', (hasModerator: boolean, gameGoals: { categoryName: string, imageCount: number }[]) => { // Receive message that there is or is not a moderator here
      // console.log('starting game...'); // testing
      setRoomState({ ...roomState, hasModerator });
      setGameGoals(gameGoals);
      setPlayerData(Array.from({ length: gameGoals.length }, () => ([])));
      router.replace('/(screens)/countdown');
    });

    // Clean up socket listeners
    return () => {
      socket.off('exitRoom');
      socket.off('startGame');
    };
  }, []);

  const gameGoals = [
    { categoryName: 'a', imageCount: 1 },
    { categoryName: 'b', imageCount: 2 },
    { categoryName: 'c', imageCount: 1 },
    { categoryName: 'd', imageCount: 3 },
  ]; // dummy data

  // Methods
  async function handleStartRoom() {
    const res = await startRoom(roomState.roomCode, gameGoals, isModerator);
    if (res) {
      setErrorMessage(res);
    } else {
      setRoomState({ ...roomState, isModerator, hasModerator: true });
      router.replace('/(screens)/countdown');
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

  async function handleExitRoom() {
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
      <Text>Game Code: {roomState.roomCode}</Text>
      {roomState.isHost ? (
        <>
          <Button title="Start Game" onPress={handleStartRoom} />
          <Button title="Close Room" onPress={handleCloseRoom} />
          <Text>Moderator</Text>
          <Checkbox style={styles.checkbox} value={isModerator} onValueChange={setModerator} />
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
  checkbox: {
    margin: 8
  }
});
