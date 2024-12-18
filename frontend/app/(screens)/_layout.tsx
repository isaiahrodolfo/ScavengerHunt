import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="countdown" options={{ headerShown: false }} />
      <Stack.Screen name="game" options={{ headerShown: false }} />
      <Stack.Screen name="game-room" options={{ headerShown: false }} />
      <Stack.Screen name="game-over" options={{ headerShown: false }} />
    </Stack>
  );
}