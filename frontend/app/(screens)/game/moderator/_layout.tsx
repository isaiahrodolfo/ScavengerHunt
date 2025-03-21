import { Stack } from "expo-router";

export default function ChannelStack() {
  return <Stack>
    <Stack.Screen name='player-list' options={{ headerTitle: 'Player List', headerShown: true }} />
    <Stack.Screen name='[id]' options={{ headerShown: true }} />
  </Stack>
}