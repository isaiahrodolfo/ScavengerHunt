import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, TextInput } from 'react-native';
import { router } from 'expo-router';
import { HomeScreenNavigationProp } from '@/types/navigation';

export default function HomeScreen() {

  const [inputtedGameCode, setInputtedGameCode] = useState('');

  // Host-created game
  const createGame = () => {
    const createdGameCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit code // TODO: Make each game code unique
    socket.emit('createGame', createdGameCode);
    router.replace({
      pathname: '/(screens)/game-room',
      params: {
        gameCode: createdGameCode,
        isHost: "true"
      }
    });
  };

  // Non-host joins game
  const joinGame = () => {
    if (inputtedGameCode) {
      socket.emit('joinGame', inputtedGameCode);
      router.replace({
        pathname: '/(screens)/game-room',
        params: {
          gameCode: inputtedGameCode,
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
        value={inputtedGameCode}
        onChangeText={setInputtedGameCode}
      />
      <Button title="Join Game" onPress={joinGame} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: { borderWidth: 1, marginVertical: 10, padding: 5, width: 200 },
});
