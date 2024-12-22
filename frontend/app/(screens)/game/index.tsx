import React from 'react';
import { router } from 'expo-router';
import { useRoomState } from '@/store/useRoomState';

export default function GameScreen() {
  const { roomState } = useRoomState();

  if (roomState.isModerator) {
    router.replace('/(screens)/game/moderator/player-list');
  } else {
    router.replace('/(screens)/game/player/game')
  }

  return (
    <>
    </>
  );

}