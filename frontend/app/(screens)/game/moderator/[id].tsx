import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useNavigation } from "@react-navigation/native";
import { useRoomState } from '@/store/useRoomState';
import { socket } from '@/utils/socket';
import { useSelectedPlayerData } from '@/store/useSelectedPlayerData';
import { PlayerData, Status } from '@/types/game';
import ValidInvalidButtons from '@/components/game/moderator/[id]/ValidInvalidButtons';
import ModeratorCategoryObject from '@/components/game/moderator/[id]/ModeratorCategoryObject';
import { useSelectedImage } from '@/store/useModeratorSelectedImage';
import { usePlayerProgress } from '@/store/usePlayerProgress';
import { useGameGoals } from '@/store/useGameGoals';
import { usePlayerProfiles } from '@/store/usePlayerProfiles';

const Player = () => {

  const { id } = useLocalSearchParams();

  const { roomState } = useRoomState();
  const { selectedPlayerData, setSelectedPlayerData } = useSelectedPlayerData();
  const { selectedImage, setSelectedImage } = useSelectedImage();
  const { gameGoals } = useGameGoals();
  const { playerProfiles } = usePlayerProfiles();

  useEffect(() => {
    socket.on('getPlayerData', (updatedPlayerData: PlayerData) => {
      setSelectedPlayerData(updatedPlayerData);
      console.log('updatedPlayerData', updatedPlayerData);
      console.log('selectedImage', selectedImage);
      const updatedSelectedImage = updatedPlayerData[selectedImage.categoryIndex!][selectedImage.imageIndex!].imageUri;
      setSelectedImage({ ...selectedImage, imageUri: updatedSelectedImage });
      console.log('selectedImage', selectedImage);
    });

    // Clean up socket listeners
    return () => {
      socket.off('getPlayerData');
    };
  }, [selectedImage])

  // Set header title
  const navigation = useNavigation();
  navigation.setOptions({
    headerTitle: `${id}`
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
    return (selectedImage.imageUri != '' && typeof selectedImage.categoryIndex == 'number' && typeof selectedImage.imageIndex == 'number');
  }

  return (
    <View style={styles.container}>
      {/* <Text>{id}</Text> */}
      <Pressable style={{ width: 20, height: 20, backgroundColor: 'gray' }} onPress={() => {
        console.log('playerProfiles', playerProfiles); // testing
        socket.emit('logState', roomState.roomCode);
      } // TESTING: Using the flip camera button to check server state
      } />

      {/* Show selected image */}
      <View style={styles.image}>
        {imageIsSelected() ?
          <Image style={styles.image} source={{ uri: selectedImage.imageUri }} />
          :
          <View style={[styles.image, { alignContent: 'center', justifyContent: 'center' }]}>
            <Text style={{ textAlign: 'center' }}>Select an image</Text>
          </View>
        }
      </View>

      <ValidInvalidButtons id={id.toString()} />

      {/* Render the grid of images */}
      <View style={styles.categoryObjects}>
        {selectedPlayerData?.map((categoryImages: { imageUri: string, status: Status }[], index: number) => (
          <ModeratorCategoryObject
            images={categoryImages}
            categoryIndex={index}
            backgroundColor='lavender'
            number={gameGoals[index].imageCount}
            text={gameGoals[index].categoryName}
          />
          // <View key={rowIndex} style={styles.row}>
          //   {row.map((player, colIndex) => (
          //     <View
          //       key={`${rowIndex}-${colIndex}`}
          //       style={[
          //         styles.imageContainer,
          //         { borderColor: getBorderColor(player.status) }
          //       ]}
          //     >
          //       <Image
          //         source={{ uri: player.image }}
          //         style={styles.image}
          //         resizeMode="cover"
          //       />
          //     </View>
          //   ))}
          // </View>
        ))}
      </View>
    </View>
  )

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
});