import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" />
      <Stack.Screen name="countdown" />
      <Stack.Screen name="game" />
      <Stack.Screen name="game-room" />
      <Stack.Screen name="game-over" />
    </Stack>
  );
}