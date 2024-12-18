import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useNavigation } from "@react-navigation/native";

const Player = () => {

  const { id } = useLocalSearchParams();

  // Set header title
  const navigation = useNavigation();
  navigation.setOptions({
    headerTitle: `${id}`
  });

  return (
    <View>
      <Text>{id}</Text>
    </View>
  )
}

export default Player

const styles = StyleSheet.create({})