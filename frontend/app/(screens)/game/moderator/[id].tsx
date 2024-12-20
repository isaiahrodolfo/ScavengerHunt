import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useNavigation } from "@react-navigation/native";
import { useRoomState } from '@/store/useRoomState';
import { socket } from '@/utils/socket';
import { useSelectedPlayerData } from '@/store/useSelectedPlayerData';
import { Status } from '@/types/game';

const Player = () => {

  const { id } = useLocalSearchParams();

  const { roomState } = useRoomState();
  const { selectedPlayerData } = useSelectedPlayerData();

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

      {/* Render the grid of images */}
      <View style={styles.gridContainer}>
        {selectedPlayerData?.map((row: any[], rowIndex: React.Key | null | undefined) => ( // TODO: Fix typing
          <View key={rowIndex} style={styles.row}>
            {row.map((player, colIndex) => (
              <View
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.imageContainer,
                  { borderColor: getBorderColor(player.status) }
                ]}
              >
                <Image
                  source={{ uri: player.image }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>
        ))}
      </View>

      <Pressable style={{ width: 300, height: 300, backgroundColor: 'gray' }} onPress={() =>
        socket.emit('logState', roomState.roomCode) // TESTING: Using the flip camera button to check server state
      } />
    </View>
  )
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