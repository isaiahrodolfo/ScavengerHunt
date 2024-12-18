import { State } from '@/types/game';
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface GameState {
  gameState: State;
  setGameState: (to: State) => void;
}

export const useGameState = create<GameState>()(
  // devtools
  ((set) => ({
    gameState: 'take',
    setGameState: (to) => set((state) => ({ gameState: to })),
  }))
);