import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { socket } from '@/utils/socket'

export default function GameRoomScreen() {

  // Get local search params
  const { roomCode, isHost } = useLocalSearchParams();

  const isHostBool = isHost == 'true'; // Change from string (since in a url format) to boolean

  useEffect(() => {
    // Receive exit room emission, tell server to exit the Socket room and go back home
    socket.on('exitRoom', () => {
      socket.emit('exitRoom', { roomCode: roomCode, roomIsClosed: true });
      router.replace('/(screens)/home');
    });

    // Receive start room emission, tell server to start the game
    socket.on('startGame', () => {
      router.replace({ // TODO: Sync countdown and game timer with host's timer
        pathname: '/(screens)/countdown',
        params: { roomCode, isHost }
      });
    });
  }, []);

  // Methods
  const startGame = () => {
    socket.emit('startRoom', roomCode);
    router.replace({
      pathname: '/(screens)/countdown',
      params: { roomCode, isHost }
    });
  };

  const closeRoom = () => {
    socket.emit('closeRoom', roomCode);
    router.replace('/(screens)/home');
  };

  const exitRoom = () => {
    socket.emit('exitRoom', roomCode, false);
    router.replace('/(screens)/home');
  };

  const logState = () => { // testing
    socket.emit('logState', roomCode);
  };

  return (
    <View style={styles.container}>
      <Text>Game Code: {roomCode}</Text>
      {isHostBool ? (
        <>
          <Button title="Start Game" onPress={startGame} />
          <Button title="Close Room" onPress={closeRoom} />
        </>
      ) : (
        <Button title="Exit Game" onPress={exitRoom} />
      )}
      <Button title="Log State" onPress={logState} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
