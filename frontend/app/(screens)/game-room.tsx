import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { socket } from '@utils/socket'

export default function GameRoomScreen() {

  // Get local search params
  const { roomCode, isHost } = useLocalSearchParams();

  const isHostBool = isHost == 'true'; // Change from string (since in a url format) to boolean

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
    router.replace({
      pathname: '/(screens)/home'
    });
  };

  const exitRoom = () => {
    socket.emit('exitRoom', roomCode);
    router.replace('/(screens)/home')
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
