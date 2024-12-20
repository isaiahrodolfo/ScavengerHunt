import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, TextInput } from 'react-native';
import { router } from 'expo-router';
import { createRoom, joinRoom } from '@/handlers/roomHandlers';
import { useRoomState } from '@/store/useRoomState';

export default function HomeScreen() {

  const [inputtedRoomCode, setinputtedRoomCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for storing error message

  const { roomState, setRoomState } = useRoomState();

  async function handleCreateRoom() {

    const createdRoomCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit code // TODO: Make each game code unique

    const res = await createRoom(createdRoomCode);
    if (res) {
      setErrorMessage(res);
    } else {
      // Navigate to the game room on success
      setRoomState({ ...roomState, roomCode: createdRoomCode, isHost: true, isModerator: true, hasModerator: true }); // Host is moderator as default
      router.replace('/(screens)/game-room');
    }
  }

  // Non-host joins game
  async function handleJoinRoom() {

    if (inputtedRoomCode) {
      const res = await joinRoom(inputtedRoomCode);
      if (res) {
        setErrorMessage(res);
      } else {
        // Navigate to the game room on success
        setRoomState({ ...roomState, roomCode: inputtedRoomCode });
        router.replace('/(screens)/game-room');
      }
    } else {
      // No room code submitted
      setErrorMessage('Please enter a room code.');
    }
  }


  return (
    <View style={styles.container}>
      <Button title="Host Game" onPress={handleCreateRoom} />
      <TextInput
        style={styles.input}
        placeholder="Enter Game Code"
        value={inputtedRoomCode}
        onChangeText={setinputtedRoomCode}
      />
      <Button title="Join Game" onPress={handleJoinRoom} />
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
});
