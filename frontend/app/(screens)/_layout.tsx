import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="home/index" />
      <Stack.Screen name="countdown/index" />
      <Stack.Screen name="game/index" />
      <Stack.Screen name="game-room/index" />
      <Stack.Screen name="game-over/index" />
    </Stack>
  );
}