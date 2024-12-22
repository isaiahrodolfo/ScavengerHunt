import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useGameState } from '@/store/useGameState';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CancelButtonProps {
  onPress: () => void;
}

const CancelButton = ({ onPress }: CancelButtonProps) => {

  const { gameState } = useGameState();

  return (
    <TouchableOpacity style={[styles.cancelButton, {
      display: ['view', 'retake'].includes(gameState) ? 'flex' : 'none'
    }]} onPress={() => { onPress() }}>
      {gameState == 'view' &&
        <Ionicons name="close" size={40} color="black" />
      }
    </TouchableOpacity>
  );
}

export default CancelButton

const styles = StyleSheet.create({
  cancelButton: {
    // padding: 10,
    // backgroundColor: 'blue',
    borderRadius: 10,
    marginVertical: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
})