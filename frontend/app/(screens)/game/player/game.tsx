import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Button, GestureResponderEvent } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Camera from '@/components/game/player/Camera';
import PlayerCategoryObject from '@/components/game/player/PlayerCategoryObject';
import { useGameState } from '@/store/useGameState';
import { useCategoryImages } from '@/store/useCategoryImages';
import { useRoomState } from '@/store/useRoomState';
import { socket } from '@/utils/socket';

export default function PlayerGameScreen() {
  const { roomCode, isHost } = useLocalSearchParams();
  const [timer, setTimer] = useState(1000);
  const { width } = useWindowDimensions();

  const { roomState } = useRoomState();

  const { gameState, setGameState } = useGameState();
  const { categoryImages, setCategoryImages } = useCategoryImages();

  // Timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    if (timer === 0) {
      clearInterval(interval);
      router.replace('/(screens)/game-over');
    }

    return () => clearInterval(interval);
  }, [timer]);

  function handlePressCancel(event: GestureResponderEvent): void {
    switch (gameState) {
      case 'view': // Canceled viewing an image
      case 'retake': // Canceled retaking an image
        setGameState('take');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{timer}</Text>

      {/* Camera View */}
      <View style={styles.camera}>
        <Camera setHasPermissions={() => { }} />
      </View>

      {/* Cancel Button */}
      {['view', 'retake'].includes(gameState) && <Button title={'Cancel'} onPress={handlePressCancel} />}

      <View style={[styles.categoryObjects, { width: width - 20 }]}>
        {categoryImages.map((category, index) => (
          <PlayerCategoryObject
            key={index}
            categoryIndex={index}
            backgroundColor={getCategoryColor(index)}
            number={getCategoryNumber(index)}
            text={getCategoryName(index)}
            images={category.images}
          />
        ))}
      </View>
    </View>
  );
}

// TODO: Make a JSON object that stores this data
function getCategoryNumber(index: number) {
  const numbers = [4, 6, 3, 5];
  return numbers[index] || 0;
}

function getCategoryColor(index: number) {
  const colors = ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4'];
  return colors[index] || '#ccc';
}

function getCategoryName(index: number) {
  const colors = ['musical instruments', 'TVs', 'fridges/freezers', 'different types of bibles'];
  return colors[index] || '#ccc';
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: 'white' },
  camera: {
    flex: 1,
    aspectRatio: 3 / 4,
    // width: '50%',
  },
  timer: { fontSize: 20 },
  categoryObjects: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', width: '100%' },
});
