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

const Player = () => {

  const { id } = useLocalSearchParams();

  const { roomState } = useRoomState();
  const { selectedPlayerData, setSelectedPlayerData } = useSelectedPlayerData();

  useEffect(() => {
    socket.on('getPlayerData', (updatedPlayerData: PlayerData) => {
      setSelectedPlayerData(updatedPlayerData);
    });

    // Clean up socket listeners
    return () => {
      socket.off('getPlayerData');
    };
  })

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

  return (
    <View>
      <Text>{id}</Text>

      <ValidInvalidButtons />

      {/* Render the grid of images */}
      <View style={styles.gridContainer}>
        {selectedPlayerData.map((categoryImages: { imageUri: string, status: Status }[], index: number) => ( // TODO: Fix typing
          <ModeratorCategoryObject
            images={categoryImages}
            categoryIndex={index}
            backgroundColor='lavender'
            number={getCategoryNumber(index)}
            text={getCategoryName(index)}
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

      <Pressable style={{ width: 300, height: 300, backgroundColor: 'gray' }} onPress={() =>
        socket.emit('logState', roomState.roomCode) // TESTING: Using the flip camera button to check server state
      } />
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
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  gridContainer: {
    flex: 1,
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
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