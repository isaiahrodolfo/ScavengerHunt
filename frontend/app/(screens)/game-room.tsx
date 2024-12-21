import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Checkbox } from 'expo-checkbox';
import { socket } from '@/utils/socket'
import { closeRoom, exitRoom, startRoom } from '@/handlers/roomHandlers';
import { useRoomState } from '@/store/useRoomState';
import { GameGoals, PlayerData, PlayerProfiles } from '@/types/game';
import { usePlayerData } from '@/store/usePlayerData';
import { useGameGoals } from '@/store/useGameGoals';
import { usePlayerProfiles } from '@/store/usePlayerProfiles';
import { TextInput } from 'react-native-gesture-handler';
import { useJoinedPlayers } from '@/store/useJoinedPlayers';

export default function GameRoomScreen() {

  const { roomState, setRoomState } = useRoomState();
  const { setPlayerData } = usePlayerData();
  const { gameGoals, setGameGoals } = useGameGoals();
  const { setPlayerProfiles } = usePlayerProfiles();
  const [editableGameGoals, setEditableGameGoals] = useState<GameGoals>(gameGoals);
  const [categoryNameInput, setCategoryNameInput] = useState<string>('');
  const [imageCountInput, setImageCountInput] = useState<string>(''); // Type check, isNumber when submitting
  const { joinedPlayers, setJoinedPlayers } = useJoinedPlayers();

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
      // TODO: Only set player data if game has moderator?
      setPlayerData(Array.from({ length: gameGoals.length }, () => ([])));
      // setPlayerProfiles(playerProfiles);
      router.replace('/(screens)/countdown');
    });

    // TODO: Remove player if they disconnect
    // Get the players who have joined
    socket.on('getPlayers', (joinedPlayers: string[]) => {
      console.log('joinedPlayers', joinedPlayers); // testing
      setJoinedPlayers(joinedPlayers);
    });

    // Clean up socket listeners
    return () => {
      socket.off('exitRoom');
      socket.off('startGame');
      socket.off('getPlayers');
    };
  }, []);

  // Methods
  async function handleStartRoom() {
    // Check if the host has made one or more goals
    if (!editableGameGoals || editableGameGoals.length === 0) {
      setErrorMessage('You must add at least one goal before starting the game.');
      return;
    }

    await startRoom(roomState.roomCode, editableGameGoals, isModerator)
      .then((data) => {
        setRoomState({ ...roomState, isModerator, hasModerator: true });
        setGameGoals(editableGameGoals);
        setPlayerProfiles(data);
        if (!isModerator) {
          setPlayerData(Array.from({ length: gameGoals.length }, () => ([])));
        }
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

  function handleAddCategory() {
    const parsedImageCount = parseInt(imageCountInput, 10);

    if (isNaN(parsedImageCount) || parsedImageCount > 20 || parsedImageCount < 1) {
      setErrorMessage("Please enter a valid number between 1 and 20.");
      return;
    }

    if (categoryNameInput == '') {
      setErrorMessage("Please enter a category name.");
      return;
    }

    const updatedEditableGameGoals = [...editableGameGoals, {
      categoryName: categoryNameInput,
      imageCount: parsedImageCount
    }];

    setEditableGameGoals(updatedEditableGameGoals);
    setCategoryNameInput('');
    setImageCountInput('');
    setErrorMessage(null); // Clear any previous error
  }

  function handleDeleteCategory(index: number) {
    const updatedEditableGameGoals = editableGameGoals.filter((_, i) => i !== index); // This makes sure remount
    console.log('updatedEditableGameGoals', updatedEditableGameGoals); // testing
    setEditableGameGoals(updatedEditableGameGoals);
    setErrorMessage(null); // Clear any previous error
  }

  const GameGoal = ({ categoryName, imageCount, index }: { categoryName: string, imageCount: number, index: number }) => {
    return <View style={{ flexDirection: 'row', alignContent: 'center' }}>
      <Text style={{ width: 200 }}>{imageCount} {categoryName}</Text>
      <Pressable onPress={() => { handleDeleteCategory(index) }}>
        <Text style={{ color: 'red', fontWeight: 'bold' }}>✕</Text>
      </Pressable>
    </View>
  };

  const JoinedPlayer = ({ name, index }: { name: string, index: number }) => {
    if (index == 0) {
      return (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Host</Text>
          <Text style={{ marginBottom: 20 }}>{name}</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Players</Text>
        </View>
      );
    }

    return (
      <View style={{ alignItems: 'center' }}>
        <View style={{ flexDirection: 'row' }}>
          <Text>{name}</Text>
          <Text style={{ color: 'gray' }}> {index == 0 && '(Host)'}</Text>
        </View>
      </View>
    );
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

          {/* Game Goal Input */}
          <View style={{ marginTop: 30 }}>
            <TextInput
              style={styles.input}
              placeholder="Number (ex. 8)"
              value={imageCountInput}
              onChangeText={setImageCountInput}
            />
            <TextInput
              style={styles.input}
              placeholder="Item (ex. bugs)"
              value={categoryNameInput}
              onChangeText={setCategoryNameInput}
            />
            <Button title={'Add Category'} onPress={handleAddCategory} />
          </View>

          {/* Game Goals List */}
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
            <FlatList
              data={editableGameGoals}
              renderItem={({ item, index }) => <GameGoal categoryName={item.categoryName} imageCount={item.imageCount} index={index} />}
              keyExtractor={item => item.categoryName}
            />
          </View>
        </>
      ) : (
        <Button title="Exit Game" onPress={handleExitRoom} />
      )}
      {/* Joined Players List */}
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
        <FlatList
          data={joinedPlayers}
          renderItem={({ item, index }) => <JoinedPlayer name={item} index={index} />}
          keyExtractor={item => item}
        />
      </View>
      {errorMessage && <Text style={[styles.errorText, { marginTop: 50 }]}>{errorMessage}</Text>} {/* Display error message */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    borderWidth: 1,
    marginVertical: 10,
    padding: 5,
    width: 200
  },
  errorText: {
    color: 'red',
    marginTop: 10
  },
  checkbox: {
    margin: 8
  }
});
