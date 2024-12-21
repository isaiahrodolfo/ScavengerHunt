import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Checkbox } from 'expo-checkbox';
import { socket } from '@/utils/socket'
import { closeRoom, exitRoom, startRoom } from '@/handlers/roomHandlers';
import { useRoomState } from '@/store/useRoomState';
import { GameGoals, PlayerData, PlayerProfiles } from '@/types/game';
import { usePlayerData } from '@/store/usePlayerData';
import { useGameGoals } from '@/store/useGameGoals';
import { usePlayerProfiles } from '@/store/usePlayerProfiles';

export default function GameRoomScreen() {

  const { roomState, setRoomState } = useRoomState();
  const { setPlayerData } = usePlayerData();
  const { setGameGoals } = useGameGoals();
  const { setPlayerProfiles } = usePlayerProfiles();
  const [editableGameGoals, setEditableGameGoals] = useState<GameGoals>(
    [
      { categoryName: 'musical instruments', imageCount: 2 },
      { categoryName: 'TVs', imageCount: 5 },
      { categoryName: 'fridges/freezers', imageCount: 6 },
      { categoryName: 'different types of bibles', imageCount: 8 }
    ]
  );

  // Get local search params
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for storing error message
  const [isModerator, setModerator] = useState<boolean>(roomState.isModerator);

  useEffect(() => {
    // (Player) receive exit room emission, tell server to exit the Socket room and go back home
    socket.on('exitRoom', () => {
      socket.emit('exitRoom', { roomCode: roomState.roomCode, roomIsClosed: true });
      router.replace('/(screens)/home');
    });

    // (Player) receive start game emission
    // ? tell server to start the game (we're not doing that here)
    socket.on('startGame', (hasModerator: boolean, gameGoals: { categoryName: string, imageCount: number }[]) => { // Receive message that there is or is not a moderator here
      console.log('starting game...'); // testing
      // console.log(playerProfiles); // testing
      setRoomState({ ...roomState, hasModerator });
      setGameGoals(gameGoals);
      setPlayerData(Array.from({ length: gameGoals.length }, () => ([])));
      // setPlayerProfiles(playerProfiles);
      router.replace('/(screens)/countdown');
    });

    // Clean up socket listeners
    return () => {
      socket.off('exitRoom');
      socket.off('startGame');
    };
  }, []);

  // Methods
  async function handleStartRoom() {
    // TODO: If host is not moderator, they don't need the player names
    await startRoom(roomState.roomCode, editableGameGoals, isModerator)
      .then((data) => {
        setRoomState({ ...roomState, isModerator, hasModerator: true });
        setGameGoals(editableGameGoals);
        setPlayerProfiles(data);
        console.log('player profiles', data);
        router.replace('/(screens)/countdown');
      })
      .catch((error: Error) => {
        setErrorMessage(error.message);
      });
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

  const GameGoal = ({ categoryName, imageCount }: { categoryName: string, imageCount: number }) => {
    return <View>

    </View>
  };

  return (
    <View style={styles.container}>
      <Text>Game Code: {roomState.roomCode}</Text>
      {roomState.isHost ? (
        <>
          <Button title="Start Game" onPress={handleStartRoom} />
          <Button title="Close Room" onPress={handleCloseRoom} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>Moderator</Text>
            <Checkbox style={styles.checkbox} value={isModerator} onValueChange={setModerator} />
          </View>
          <FlatList
            data={editableGameGoals}
            renderItem={({ item }) => <GameGoal categoryName={item.categoryName} imageCount={item.imageCount} />}
            keyExtractor={item => item.categoryName}
          />
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
