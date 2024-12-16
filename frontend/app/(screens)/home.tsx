import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, TextInput } from 'react-native';
import { router } from 'expo-router';
import { socket } from '@utils/socket';

export default function HomeScreen() {

  const [inputtedRoomCode, setinputtedRoomCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for storing error message

  useEffect(() => {
    // Listen for the join game error event
    socket.on('joinRoomError', (error) => {
      console.log(error.type);
      switch (error.type) {
        case 'RoomDoesNotExist':
          setErrorMessage("The game you're trying to join does not exist.");
          break;
        case 'AlreadyInRoom':
          setErrorMessage("Error: You are already in a game room. Leave the current room before joining a new one.");
          break;
        case 'UnknownError':
          setErrorMessage("An unexpected error occurred. Please try again later.");
          break;
        default:
          setErrorMessage("An unknown error occurred.");
      }
    });

    // Cleanup the socket listener when the component unmounts
    return () => {
      socket.off('joinRoomError');
    };
  }, []);

  // Host-created game
  const createGame = () => {
    const createdroomCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit code // TODO: Make each game code unique
    socket.emit('createRoom', createdroomCode);
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
      socket.emit('joinRoom', inputtedRoomCode);
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
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>} {/* Display error message */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: { borderWidth: 1, marginVertical: 10, padding: 5, width: 200 },
  errorText: { color: 'red', marginTop: 10 },
});
