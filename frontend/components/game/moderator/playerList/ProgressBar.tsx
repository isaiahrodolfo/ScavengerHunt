import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Status } from '@/types/game';
import { useGameGoals } from '@/store/useGameGoals';

interface ProgressBarProps {
  type: Status;
  count: number;
  totalImages: number;
}

type Colors = 'gray' | 'green' | 'yellow' | 'red';

const ProgressBar = ({ type, count, totalImages }: ProgressBarProps) => {

  const [width, setWidth] = useState<number>((300 / totalImages) * count);

  useEffect(() => {
    // Set width based on count
    setWidth((300 / totalImages) * count); // Make the progress bar always 300px wide, regardless of the number of images
  }, [count])

  return (
    <View
      style={[styles.progressBar, {
        backgroundColor: type == 'unchecked' ? 'yellow' : type == 'valid' ? 'green' : type == 'completed' ? 'darkgreen' : type == 'invalid' ? 'red' : 'gray',
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