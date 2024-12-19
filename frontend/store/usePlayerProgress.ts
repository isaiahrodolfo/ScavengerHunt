import { PlayerProgressState, State } from '@/types/game';
import { create, useStore } from 'zustand'
import { devtools } from 'zustand/middleware'

interface PlayerProgress {
  playerProgress: PlayerProgressState;
  setPlayerProgress: (to: PlayerProgressState) => void;
}
 
const createPlayerProgressStore = () => 
  create<PlayerProgress>()(
  // devtools
  ((set) => ({
    playerProgress: {},
    setPlayerProgress: (to) => set((state) => ({ playerProgress: to })),
  }))
);

// Use a unique store per tab
const playerProgressStore = createPlayerProgressStore();

export const usePlayerProgress = () => useStore(playerProgressStore);
