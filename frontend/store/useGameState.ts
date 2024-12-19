import { State } from '@/types/game';
import { create, useStore } from 'zustand'
import { devtools } from 'zustand/middleware'

interface GameState {
  gameState: State;
  setGameState: (to: State) => void;
}
 
const createGameStore = () => 
  create<GameState>()(
  // devtools
  ((set) => ({
    gameState: 'take',
    setGameState: (to) => set((state) => ({ gameState: to })),
  }))
);

// Use a unique store per tab
const gameStore = createGameStore();

export const useGameState = () => useStore(gameStore);
