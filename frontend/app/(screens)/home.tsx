import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, TextInput } from 'react-native';
import { router } from 'expo-router';
import { socket } from '@utils/socket';

export default function HomeScreen() {

  const [inputtedRoomCode, setinputtedRoomCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for storing error message

  const createGame = () => {
    const createdRoomCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit code // TODO: Make each game code unique
    socket.emit('createRoom', createdRoomCode);
    router.replace({
      pathname: '/(screens)/game-room',
      params: {
        roomCode: createdRoomCode,
        isHost: "true"
      }
    });
  };

  // Non-host joins game
  const joinGame = () => {
    if (inputtedRoomCode) {
      // Emit the event and pass a callback to handle the response
      socket.emit('joinRoom', inputtedRoomCode, (response: { success: boolean; error?: string; type?: string }) => {
        if (response.success) {
          // Navigate to the game room on success
          const roomCode = inputtedRoomCode;
          router.replace({
            pathname: '/(screens)/game-room',
            params: {
              roomCode: roomCode,
              isHost: 'false',
            },
          });
        } else {
          // Handle error
          console.log(response.type); // log error to console, to see what the error is
          switch (response.type) {
            case 'RoomDoesNotExist':
              setErrorMessage("The game you're trying to join does not exist.");
              break;
            case 'AlreadyInRoom':
              setErrorMessage('Error: You are already in a game room. Leave the current room before joining a new one.');
              break;
            case 'UnknownError':
              setErrorMessage('An unexpected error occurred. Please try again later.');
              break;
            default:
              setErrorMessage(response.error || 'An unknown error occurred.');
          }
        }
      });
    } else {
      // No room code submitted
      setErrorMessage('Please enter a room code.');
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
