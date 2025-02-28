import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Button, GestureResponderEvent, ScrollView, Pressable, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Camera from '@/components/game/player/Camera';
import PlayerCategoryObject from '@/components/game/player/PlayerCategoryObject';
import { useGameState } from '@/store/useGameState';
import { useCategoryImages } from '@/store/useCategoryImages';
import { useRoomState } from '@/store/useRoomState';
import { socket } from '@/utils/socket';
import { PlayerData, PlayerProfiles, Profile } from '@/types/game';
import { usePlayerData } from '@/store/usePlayerData';
import { useGameGoals } from '@/store/useGameGoals';
import { useSelectedImage } from '@/store/useSelectedImage';
import { endGame } from '@/handlers/gameHandlers';
import { useSelectedPlayerData } from '@/store/useSelectedPlayerData';
import { usePlayerProgress } from '@/store/usePlayerProgress';

export default function PlayerGameScreen() {
  // const { roomCode, isHost } = useLocalSearchParams();
  // const [timer, setTimer] = useState(1000);
  const { width } = useWindowDimensions();

  // const { roomState } = useRoomState();

  const { gameState, setGameState } = useGameState();
  // const { categoryImages, setCategoryImages } = useCategoryImages();
  const { selectedImage } = useSelectedImage();
  const { roomState, setRoomState } = useRoomState();
  const { setPlayerProgress } = usePlayerProgress(); // Multiple player's progresses
  const { setSelectedPlayerData } = useSelectedPlayerData();
  const { setSelectedImage } = useSelectedImage();
  const { playerData, setPlayerData } = usePlayerData();
  const { gameGoals } = useGameGoals();

  // // Timer logic
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimer((prev) => prev - 1);
  //   }, 1000);

  //   if (timer === 0) {
  //     clearInterval(interval);
  //     router.replace('/(screens)/game-over');
  //   }

  //   return () => clearInterval(interval);
  // }, [timer]);

  // Receive updated statuses on my images
  useEffect(() => {
    socket.on('getPlayerData', (data: PlayerData) => {
      setPlayerData(data);
    });

    socket.on('declareWinner', (data: Profile) => {
      // // Reset game data
      setRoomState({ ...roomState, gameInProgress: false });
      // setSelectedImage({ imageUri: '', categoryIndex: undefined, imageIndex: undefined });
      // setPlayerData([]);
      // setGameState('take');
      router.replace({
        pathname: '/(screens)/game-over',
        params: { winnerName: data.name }
      })
    });

    socket.on('endGame', () => {
      setRoomState({ ...roomState, gameInProgress: false });
      // // Reset game data
      // setSelectedImage({ imageUri: '', categoryIndex: undefined, imageIndex: undefined });
      // setPlayerData([]);
      // setGameState('take');
      router.replace({
        pathname: '/(screens)/game-over',
        params: { winnerName: '' } // No declared winner
      });
    });

    return () => {
      socket.off('getPlayerData');
      socket.off('declareWinner');
      socket.off('endGame');
    }
  }, []);

  function handleEndGame() {
    endGame(roomState.roomCode)
      .then(() => {
        setRoomState({ ...roomState, gameInProgress: false });
        // // Reset all game data
        // setSelectedImage({ imageUri: '', categoryIndex: undefined, imageIndex: undefined });
        // setSelectedPlayerData({});
        // setPlayerProgress({});
        router.replace({
          pathname: '/(screens)/game-over',
          params: { winnerName: '' } // No declared winner
        });
      })
      .catch((error: Error) => {
        // TODO: Error message
        console.error(error);
      })
  }

  function handlePressCancel(event: GestureResponderEvent): void {
    switch (gameState) {
      case 'view': // Canceled viewing an image
      case 'retake': // Canceled retaking an image
        setGameState('take');
    }
  }

  function handleNavigateToGameRoom(event: GestureResponderEvent): void {
    router.replace('/(screens)/game-room');
  }

  function imageIsSelected(): boolean {
    return (selectedImage.imageUri != '' && typeof selectedImage.categoryIndex == 'number' && typeof selectedImage.imageIndex == 'number');
  }

  return (
    <View style={styles.container}>
      {roomState.isHost && roomState.gameInProgress && <Pressable style={styles.endGameButton} onPress={handleEndGame}>
        <Text style={styles.endGameText}>End Game For All</Text>
      </Pressable>}
      {/* <Text style={styles.timer}>{timer}</Text> */}

      {/* Camera View (while game is in progess) */}
      {roomState.gameInProgress &&
        <View>
          <Camera setHasPermissions={() => { }} onPressCancel={handlePressCancel} />
        </View>
      }

      {/* Image View (when game is over) */}
      {!roomState.gameInProgress && (imageIsSelected() ?
        <Image style={styles.image} source={{ uri: selectedImage.imageUri }} />
        :
        <View style={[styles.image, { alignContent: 'center', justifyContent: 'center' }]}>
          <Text style={{ textAlign: 'center' }}>Select an image</Text>
        </View>)
      }

      {/* Back to game room button (when game is over) */}
      {!roomState.gameInProgress &&
        <View style={{ marginTop: 10 }}>
          <Button title={'Back to Game Room'} onPress={handleNavigateToGameRoom} />
        </View>
      }

      <ScrollView
        style={[styles.scrollContainer, { width: width - 20 }]}
        contentContainerStyle={styles.categoryGrid}
      >
        {playerData.map((category, index) => (
          <View key={index} style={[styles.categoryWrapper]}>
            <PlayerCategoryObject
              key={index}
              categoryIndex={index}
              backgroundColor={getCategoryColor(index)}
              number={gameGoals[index].imageCount || 0}
              text={gameGoals[index].categoryName || ''}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );

  // TODO: Make a JSON object that stores gameGoals
  function getCategoryColor(index: number) { // TODO: I have no use for this for now
    const colors = ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4'];
    return colors[index] || '#ccc';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  image: {
    flex: 1,
    aspectRatio: 3 / 4,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 0,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryWrapper: {
    width: '95%', // One per row with some spacing
    height: 135,
    marginHorizontal: 10, // Horizontal spacing
    marginVertical: 10, // Fixed vertical spacing
    aspectRatio: 1.5, // Rectangle shape
    borderRadius: 10,
    overflow: 'hidden',
  },
  endGameButton: {
    left: 20,
    top: 20,
    position: 'absolute'
  },
  endGameText: {
    color: 'black',
    fontSize: 10
  }
});
