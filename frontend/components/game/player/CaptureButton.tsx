import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useGameState } from '@/store/useGameState';
import Icon from 'react-native-vector-icons/Ionicons';

interface CaptureButtonProps {
  onPress: () => void;
}

const CaptureButton = ({ onPress }: CaptureButtonProps) => {

  const { gameState } = useGameState();

  return (
    <TouchableOpacity style={styles.captureButton} onPress={() => { onPress() }}>
      {['put', 'view'].includes(gameState) ?
        <View>
          <Icon name="arrow-undo-circle" size={60} color="gray" />
        </View>
        :
        <View>
          <Icon name="radio-button-on-outline" size={60} color="gray" />
        </View>
      }
    </TouchableOpacity>
  );
}

export default CaptureButton

const styles = StyleSheet.create({
  captureButton: {
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