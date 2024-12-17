import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

interface ShutterButtonProps {
  isSelecting: boolean;
  takePicture: () => void;
}

// type ButtonFunction = 'take' | 'retake';

const ShutterButton = ({ isSelecting, takePicture }: ShutterButtonProps) => {

  // const [buttonFunction, setButtonFunction] = useState<ButtonFunction>('take');

  return (
    <TouchableOpacity style={styles.captureButton} onPress={() => { if (!isSelecting) takePicture() }}>
      <Text style={styles.text}>{isSelecting ? 'Retake' : 'Take Photo'}</Text>
    </TouchableOpacity>
  );
}

export default ShutterButton

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