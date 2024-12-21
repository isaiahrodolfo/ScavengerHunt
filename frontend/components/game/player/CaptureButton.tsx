import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useGameState } from '@/store/useGameState';

interface CaptureButtonProps {
  onPress: () => void;
}

// type ButtonFunction = 'take' | 'retake';

const CaptureButton = ({ onPress }: CaptureButtonProps) => {

  const { gameState } = useGameState();

  return (
    <TouchableOpacity style={styles.captureButton} onPress={() => { onPress() }}>
      <Text style={styles.text}>{['put', 'view'].includes(gameState) ? 'Retake' : 'Take Photo'}</Text>
    </TouchableOpacity>
  );
}

export default CaptureButton

const styles = StyleSheet.create({
  captureButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 10,
    marginVertical: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
})