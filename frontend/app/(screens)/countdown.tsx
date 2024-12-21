import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { socket } from '@/utils/socket';
import { useRoomState } from '@/store/useRoomState';

export default function CountdownScreen() {

  const [countdown, setCountdown] = useState(1); // TODO: Set countdown to 3
  const { roomState } = useRoomState();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(interval);
      router.replace('/(screens)/game');
    }

    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    // (Player) receive exit room emission, tell server to exit the Socket room and go back home
    socket.on('exitRoom', () => {
      socket.emit('exitRoom', { roomCode: roomState.roomCode, roomIsClosed: true });
      router.replace('/(screens)/home');
    });

    // Clean up socket listeners
    return () => {
      socket.off('exitRoom');
    };
  }, []);

  return (
    <View style={styles.container}>

      <Text style={styles.countdown}>{countdown}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  countdown: { fontSize: 100, fontWeight: 'bold' },
});
