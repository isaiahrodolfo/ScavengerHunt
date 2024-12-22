import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useGameState } from '@/store/useGameState';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface DeleteImageButtonProps {
  onPress: () => void;
}

const DeleteImageButton = ({ onPress }: DeleteImageButtonProps) => {

  const { gameState } = useGameState();

  return (
    <TouchableOpacity style={[styles.deleteImageButton, {
      display: ['view', 'retake'].includes(gameState) ? 'flex' : 'none'
    }]} onPress={() => { onPress() }}>
      {gameState == 'view' &&
        <Ionicons name="trash" size={40} color="red" />
      }
    </TouchableOpacity>
  );
}

export default DeleteImageButton

const styles = StyleSheet.create({
  deleteImageButton: {
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