import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function CountdownScreen() {
  const { gameCode, isHost } = useLocalSearchParams();

  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(interval);
      router.replace({
        pathname: '/(screens)/game',
        params: { gameCode, isHost }
      });
    }

    return () => clearInterval(interval);
  }, [countdown]);

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
