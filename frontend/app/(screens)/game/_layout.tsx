import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name="moderator" options={{ headerShown: true }} />
      <Stack.Screen name="player" options={{ headerShown: false }} />
    </Stack>
  )
}