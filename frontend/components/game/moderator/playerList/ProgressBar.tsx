import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
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

  const { width: screenWidth } = useWindowDimensions();

  const calculateWidth = () => {
    // Ensure minimum width of 300 and limit max width to 65% of screen width
    const maxWidth = Math.max(300, screenWidth * 0.65);
    return (maxWidth / totalImages) * count;
  };

  const [width, setWidth] = useState<number>(calculateWidth());

  useEffect(() => {
    // Update width dynamically when `count` or `screenWidth` changes
    setWidth(calculateWidth());
  }, [count, screenWidth, totalImages]);

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