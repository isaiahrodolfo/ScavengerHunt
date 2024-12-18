import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const Player = () => {

  const { userId } = useLocalSearchParams();

  return (
    <View>
      <Text>{userId}</Text>
    </View>
  )
}

export default Player

const styles = StyleSheet.create({})