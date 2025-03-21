import { Pressable, StyleSheet, Text, View, Image, ScrollView, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useNavigation } from "@react-navigation/native";
import { useRoomState } from '@/store/useRoomState';
import { socket } from '@/utils/socket';
import { useSelectedPlayerData } from '@/store/useSelectedPlayerData';
import { PlayerData, Status } from '@/types/game';
import ValidInvalidButtons from '@/components/game/moderator/[id]/ValidInvalidButtons';
import ModeratorCategoryObject from '@/components/game/moderator/[id]/ModeratorCategoryObject';
import { useModeratorSelectedImage } from '@/store/useModeratorSelectedImage';
import { usePlayerProgress } from '@/store/usePlayerProgress';
import { useGameGoals } from '@/store/useGameGoals';
import { usePlayerProfiles } from '@/store/usePlayerProfiles';
import DeclareWinnerButton from '@/components/game/moderator/[id]/DeclareWinnerButton';

const Player = () => {

  const { id } = useLocalSearchParams();

  const { width } = useWindowDimensions();

  const { roomState } = useRoomState();
  const { selectedPlayerData, setSelectedPlayerData } = useSelectedPlayerData();
  const { moderatorSelectedImage, setModeratorSelectedImage } = useModeratorSelectedImage();
  const { gameGoals } = useGameGoals();
  const { playerProfiles } = usePlayerProfiles();
  const { playerProgress } = usePlayerProgress(); // Multiple player's progresses
  const [areAllImagesValid, setAreAllImagesValid] = useState<boolean>(false);

  useEffect(() => {
    socket.on('getPlayerData', (updatedPlayerData: PlayerData) => {
      setSelectedPlayerData(updatedPlayerData);
      console.log('updatedPlayerData', updatedPlayerData);
      console.log('currentModeratorSelectedImage', moderatorSelectedImage);
      if (moderatorSelectedImage.imageUri != '' && typeof moderatorSelectedImage.categoryIndex != 'undefined' && typeof moderatorSelectedImage.imageIndex != 'undefined') {
        // const updatedModeratorSelectedImage = updatedPlayerData[moderatorSelectedImage.categoryIndex!][moderatorSelectedImage.imageIndex!].imageUri;
        // setModeratorSelectedImage({ ...moderatorSelectedImage, imageUri: updatedModeratorSelectedImage });

        // If selected coordiates causes no selected image, use the next available image as the selected one 
        const { categoryIndex, imageIndex } = moderatorSelectedImage;
        const nextValidImageIndex = Math.min(imageIndex, updatedPlayerData[categoryIndex].length - 1);
        if (nextValidImageIndex >= 0) {
          setModeratorSelectedImage({ ...moderatorSelectedImage, imageUri: updatedPlayerData[categoryIndex][nextValidImageIndex].imageUri, imageIndex: nextValidImageIndex });
        } else {
          setModeratorSelectedImage({ imageUri: '', categoryIndex: undefined, imageIndex: undefined });
        }
      }
      // console.log('moderatorSelectedImage', moderatorSelectedImage); // testing
    });

    // Clean up socket listeners
    return () => {
      socket.off('getPlayerData');
    };
  }, [moderatorSelectedImage])

  // TODO: Make this global
  function calculateTotalImages(): number {
    let totalImages = 0;
    for (const category of gameGoals) {
      totalImages += category.imageCount;
    }
    return totalImages;
  }

  useEffect(() => {
    setAreAllImagesValid(
      playerProgress[id.toString()].images.completed >= calculateTotalImages()
    );
  }, [playerProgress]);

  // Set header title
  const navigation = useNavigation();
  navigation.setOptions({
    headerTitle: `${playerProfiles[id.toString()].name}`
  });

  const getBorderColor = (status: Status) => {
    switch (status) {
      case 'unchecked': return 'yellow';
      case 'valid': return 'green';
      case 'invalid': return 'red';
      case 'none': return 'gray';
      default: return 'gray';
    }
  };

  function imageIsSelected(): boolean {
    return (moderatorSelectedImage.imageUri != '' && typeof moderatorSelectedImage.categoryIndex == 'number' && typeof moderatorSelectedImage.imageIndex == 'number');
  }

  return (
    <View style={styles.container}>
      {/* <Text>{id}</Text> */}
      {/* <Pressable style={{ width: 20, height: 20, backgroundColor: 'gray' }} onPress={() => {
        console.log('playerProfiles', playerProfiles); // testing
        socket.emit('logState', roomState.roomCode);
      } // TESTING: Using the flip camera button to check server state
      } /> */}

      {areAllImagesValid && <DeclareWinnerButton id={id.toString()} />}

      {/* Show selected image */}
      <View style={styles.image}>
        {imageIsSelected() ?
          <Image style={styles.image} source={{ uri: moderatorSelectedImage.imageUri }} />
          :
          <View style={[styles.image, { alignContent: 'center', justifyContent: 'center' }]}>
            <Text style={{ textAlign: 'center' }}>Select an image</Text>
          </View>
        }
      </View>

      <ValidInvalidButtons id={id.toString()} />

      {/* Render the grid of images */}
      <ScrollView
        style={[styles.scrollContainer, { width: width - 20 }]}
        contentContainerStyle={styles.categoryGrid}
      >
        {selectedPlayerData?.map((categoryImages: { imageUri: string, status: Status }[], index: number) => (
          <View key={index} style={[styles.categoryWrapper]}>
            <ModeratorCategoryObject
              images={categoryImages}
              categoryIndex={index}
              backgroundColor='lavender'
              number={gameGoals[index].imageCount}
              text={gameGoals[index].categoryName}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  )

  // TODO: Make a JSON object that stores this data
  function getCategoryNumber(index: number) {
    const numbers = [4, 6, 3, 5];
    return numbers[index] || 0;
  }
}

export default Player

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  image: {
    flex: 1,
    aspectRatio: 3 / 4,
    // width: '50%',
    // height: 100,
    // borderRadius: 8,
  },
  categoryObjects: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  imageContainer: {
    borderWidth: 4,
    borderRadius: 8,
    padding: 4,
  },
  testButton: {
    width: 300,
    height: 50,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 10,
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
});