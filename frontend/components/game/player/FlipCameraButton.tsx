import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useGameState } from '@/store/useGameState';
import Icon from 'react-native-vector-icons/Ionicons';

interface FlipCameraButtonProps {
  onPress: () => void;
}

const FlipCameraButton = ({ onPress }: FlipCameraButtonProps) => {

  const { gameState } = useGameState();

  return (
    <TouchableOpacity style={styles.flipcameraButton} onPress={() => { onPress() }}>
      {['put', 'view'].includes(gameState) ?
        <View>
        </View>
        :
        <View>
          <Icon name="camera-reverse" size={40} color="black" />
        </View>
      }
    </TouchableOpacity>
  );
}

export default FlipCameraButton

const styles = StyleSheet.create({
  flipcameraButton: {
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