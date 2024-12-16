import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, TextInput } from 'react-native';
import { router } from 'expo-router';
import { HomeScreenNavigationProp } from '@/types/navigation';
import { socket } from '@utils/socket'

export default function HomeScreen() {

  const [inputtedRoomCode, setinputtedRoomCode] = useState('');

  // Host-created game
  const createGame = () => {
    const createdroomCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit code // TODO: Make each game code unique
    socket.emit('createGame', createdroomCode);
    router.replace({
      pathname: '/(screens)/game-room',
      params: {
        roomCode: createdroomCode,
        isHost: "true"
      }
    });
  };

  // Non-host joins game
  const joinGame = () => {
    if (inputtedRoomCode) {
      socket.emit('joinGame', inputtedRoomCode);
      router.replace({
        pathname: '/(screens)/game-room',
        params: {
          roomCode: inputtedRoomCode,
          isHost: "false"
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Host Game" onPress={createGame} />
      <TextInput
        style={styles.input}
        placeholder="Enter Game Code"
        value={inputtedRoomCode}
        onChangeText={setinputtedRoomCode}
      />
      <Button title="Join Game" onPress={joinGame} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: { borderWidth: 1, marginVertical: 10, padding: 5, width: 200 },
});
