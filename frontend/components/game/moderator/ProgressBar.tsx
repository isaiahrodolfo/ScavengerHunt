import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

interface ProgressBarProps {
  type: 'unchecked' | 'valid' | 'invalid' | 'none';
  count: number;
}

type Colors = 'gray' | 'green' | 'yellow' | 'red';

const ProgressBar = ({ type, count }: ProgressBarProps) => {

  const [width, setWidth] = useState<number>(count * 50);

  useEffect(() => {
    // Set width based on count
    setWidth(count * 50);
  }, [count])

  return (
    <View
      style={[styles.progressBar, {
        backgroundColor: type == 'unchecked' ? 'yellow' : type == 'valid' ? 'green' : type == 'invalid' ? 'red' : 'gray',
        width
      }]}
    >
    </View>
  )
}

export default ProgressBar

const styles = StyleSheet.create({
  progressBar: {
    height: 20
  }
})