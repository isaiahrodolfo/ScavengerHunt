import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useNavigation } from "@react-navigation/native";
import { useRoomState } from '@/store/useRoomState';
import { socket } from '@/utils/socket';

const Player = () => {

  const { id } = useLocalSearchParams();

  const { roomState } = useRoomState();

  // Set header title
  const navigation = useNavigation();
  navigation.setOptions({
    headerTitle: `${id}`
  });

  return (
    <View>
      <Text>{id}</Text>
      <Pressable style={{ width: 300, height: 300, backgroundColor: 'gray' }} onPress={() =>
        socket.emit('logState', roomState.roomCode) // TESTING: Using the flip camera button to check server state
      } />
    </View>
  )
}

export default Player

const styles = StyleSheet.create({})