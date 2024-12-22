import { FlatList, GestureResponderEvent, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ProgressBar from '../../../../components/game/moderator/playerList/ProgressBar'
import { router, useFocusEffect } from 'expo-router'
import { socket } from '@/utils/socket'
import { ImageAndLocation, PlayerProgressState, PlayerProgressValue } from '@/types/game'
import { endGame, getPlayerData, navigateToPlayerList } from '@/handlers/gameHandlers'
import { useSelectedPlayerData } from '@/store/useSelectedPlayerData'
import { useRoomState } from '@/store/useRoomState'
import { usePlayerProgress } from '@/store/usePlayerProgress'
import { useGameGoals } from '@/store/useGameGoals'
import { usePlayerProfiles } from '@/store/usePlayerProfiles'
import { useModeratorSelectedImage } from '@/store/useModeratorSelectedImage'

// This is how the backend is formatted
const dummyUserCategoryImages = {
  user1: {
    id: 'user1',
    categoryImages: [
      [{ image: '1image00', status: 'unchecked' }, { image: '1image01', status: 'unchecked' }],
      [{ image: '1image10', status: 'unchecked' }, { image: '1image11', status: 'unchecked' }]
    ]
  },
  user2: {
    id: 'user2',
    categoryImages: [
      [{ image: '2image00', status: 'unchecked' }, { image: '2image01', status: 'unchecked' }],
      [{ image: '2image10', status: 'unchecked' }, { image: '2image11', status: 'unchecked' }]
    ]
  },
}

const dummyGameGoal = {
  images: 7,
  sets: 4
}

// None of the images, just the progess
const dummyUserProgress = {
  user1: {
    id: 'user1',
    images: {
      unchecked: 4,
      valid: 5,
      invalid: 2
      // Status for "image not taken" is the rest
    },
    sets: {
      unchecked: 1,
      valid: 1,
      invalid: 1
      // Status for "set not finished" is the rest
    }
  },
  user2: {
    id: 'user2',
    images: {
      unchecked: 5,
      valid: 6,
      invalid: 4
      // Status for "image not taken" is the rest
    },
    sets: {
      unchecked: 3,
      valid: 0,
      invalid: 0
      // Status for "set not finished" is the rest
    }
  },
}

export default function PlayerList() {

  const { width } = useWindowDimensions();

  // TODO: Show all players at onset, even if they don't have photos yet
  const { playerProgress, setPlayerProgress } = usePlayerProgress(); // Multiple player's progresses
  const { roomState, setRoomState } = useRoomState();
  const { gameGoals } = useGameGoals();
  const { playerProfiles } = usePlayerProfiles();
  const { moderatorSelectedImage, setModeratorSelectedImage } = useModeratorSelectedImage();
  const { setSelectedPlayerData } = useSelectedPlayerData();
  const [sortedPlayerProgress, setSortedPlayerProgress] = useState<PlayerProgressValue[]>();

  // Update UI when data changes
  useEffect(() => {

    socket.on('updateProgress', (playerProgress: PlayerProgressState) => { // TODO: All three fields must exist in ImageAndLocation
      setPlayerProgress(playerProgress); // Turn the record into an array
      console.log('playerProgress', playerProgress);
    });

    // Clean up socket listeners
    return () => {
      socket.off('updateProgress');
    };

  }, []);

  // Sort the leaderboard, those most ahead are on top
  useEffect(() => {
    setSortedPlayerProgress(
      Object.values(playerProgress).sort((a, b) => {
        // Sort by images.completed (descending)
        if (b.images.completed !== a.images.completed) {
          return b.images.completed - a.images.completed;
        }

        // Sort by sets.valid (descending)
        if (b.sets.valid !== a.sets.valid) {
          return b.sets.valid - a.sets.valid;
        }

        // Sort by sets.unchecked (descending)
        if (b.sets.unchecked !== a.sets.unchecked) {
          return b.sets.unchecked - a.sets.unchecked;
        }

        // Sort by sets.invalid (descending)
        if (b.sets.invalid !== a.sets.invalid) {
          return b.sets.invalid - a.sets.invalid;
        }

        // Sort by images.valid (descending)
        if (b.images.valid !== a.images.valid) {
          return b.images.valid - a.images.valid;
        }

        // Sort by images.unchecked (descending)
        if (b.images.unchecked !== a.images.unchecked) {
          return b.images.unchecked - a.images.unchecked;
        }

        // Sort by images.invalid (descending)
        return b.images.invalid - a.images.invalid;
      })
    );
  }, [playerProgress]);

  // When navigate back to this page, moderator is not on any player's page
  useFocusEffect(
    useCallback(() => {

      // Reset player-based data
      setModeratorSelectedImage({ imageUri: '', categoryIndex: undefined, imageIndex: undefined });
      console.log('moderatorSelectedImage', moderatorSelectedImage); // testing
      // setSelectedPlayerData(null);

      // Tell the server that the moderator is back at Player List Page
      const handleNavigation = async () => {
        const res = await navigateToPlayerList(roomState.roomCode);
        if (res) {
          console.error(res);
        }
      };

      handleNavigation();
    }, [])
  );

  // Convert object to array for FlatList
  // const userArray = Object.values(dummyUserProgress);

  // Render each user's progress item
  const Player = ({ id, images, sets }: PlayerProgressValue) => {

    const { selectedPlayerData, setSelectedPlayerData } = useSelectedPlayerData();

    async function handleItemPressed(event: GestureResponderEvent): Promise<void> { // ? What is Promise<void>?
      const data = await getPlayerData(roomState.roomCode, id);
      if (data) {
        setSelectedPlayerData(data);
        router.push({
          pathname: '/(screens)/game/moderator/[id]',
          params: { id }
        })
      } else {
        console.error('failed getting player data'); // testing
        return;
      }
    }

    // TODO: Make this global
    function calculateTotalImages(): number {
      let totalImages = 0;
      for (const category of gameGoals) {
        totalImages += category.imageCount;
      }
      return totalImages;
    }

    // TODO: Why is images.none returning nothing?
    return (
      <Pressable style={styles.item} onPress={handleItemPressed}>
        <Text style={styles.title}>{playerProfiles[id].name}</Text>
        <View style={styles.progress}>
          <Text style={styles.imagesProgress}>{(images.unchecked + images.valid + images.completed) + "/" + calculateTotalImages()}</Text>
          <View style={[styles.progressBar, { maxWidth: width * 0.65, minWidth: 300, overflow: 'hidden' }]}>
            <ProgressBar type={'none'} count={calculateTotalImages() - images.invalid - images.unchecked - images.valid - images.completed} totalImages={calculateTotalImages()} />
            <ProgressBar type={'invalid'} count={images.invalid} totalImages={calculateTotalImages()} />
            <ProgressBar type={'unchecked'} count={images.unchecked} totalImages={calculateTotalImages()} />
            <ProgressBar type={'valid'} count={images.valid} totalImages={calculateTotalImages()} />
            <ProgressBar type={'completed'} count={images.completed} totalImages={calculateTotalImages()} />
          </View>
        </View>
      </Pressable>
    );
  };

  function handleEndGame() {
    endGame(roomState.roomCode)
      .then(() => {
        setRoomState({ ...roomState, gameInProgress: false });
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

  // All users as a list
  return (
    <View style={styles.container}>
      <ScrollView >
        <FlatList
          data={sortedPlayerProgress}
          renderItem={({ item }) => <Player {...item} />}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
      {roomState.gameInProgress && <TouchableOpacity style={styles.endGameButton} onPress={handleEndGame}>
        <Text style={styles.buttonText}>End Game For All</Text>
      </TouchableOpacity>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: 'lavender',
    borderRadius: 8,
    justifyContent: 'space-between', // Separate to the sides of the container
    alignItems: 'center', // Centered vertically
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center', // Centered vertically
  },
  progressBar: {
    flexDirection: 'row', // Put all different bar types/colors right next to one another
  },
  imagesProgress: {
    fontSize: 16,
    margin: 10
  },
  endGameButton: {
    position: 'absolute',
    bottom: 0, // Anchors the button to the bottom
    left: 0,
    right: 0, // Ensures the button spans the full width of the screen
    backgroundColor: 'lightgray',
    padding: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ff4f4b',
    // color: '#ff6865',
    fontSize: 10,
  },
});