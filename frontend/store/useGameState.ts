import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type State = 'take' | 'put' | 'view' | 'retake';

interface GameState {
  gameState: State;
  setGameState: (to: State) => void;
}

export const useGameState = create<GameState>()(
  devtools((set) => ({
    gameState: 'take',
    setGameState: (to) => set((state) => ({ gameState: to })),
  }))
);