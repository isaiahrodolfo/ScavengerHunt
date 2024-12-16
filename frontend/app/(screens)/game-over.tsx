import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { socket } from '@utils/socket'

export default function GameOverScreen() {
  const { roomCode, isHost } = useLocalSearchParams();

  function handlePressNavigateToGameRoom() {
    console.log("hi")
    router.replace({
      pathname: '/(screens)/game-room',
      params: { roomCode, isHost }
    });
  }

  function handlePressNavigateToHomeScreen() {
    socket.emit('closeRoom', roomCode); // Close room
    router.replace('/(screens)/home'); // Go home
  }

  return (
    <View style={styles.container}>
      <Text>{roomCode}</Text>
      <Text>Play Again?</Text>
      <Button title="Back to Game Room" onPress={handlePressNavigateToGameRoom} />
      {isHost && <Button title="Close Game" onPress={handlePressNavigateToHomeScreen} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
