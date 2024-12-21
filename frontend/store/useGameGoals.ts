import { GameGoals, State } from '@/types/game';
import { create, useStore } from 'zustand'
import { devtools } from 'zustand/middleware'

interface GameGoalsState {
  gameGoals: GameGoals;
  setGameGoals: (to: GameGoals) => void;
}
 
const createGameGoalsStore = () => 
  create<GameGoalsState>()(
  devtools
  ((set) => ({
    gameGoals: [{categoryName: '', imageCount: 0}],
    setGameGoals: (to) => set((state) => ({ gameGoals: to })),
  }))
);

// Use a unique store per tab
const gameGoalsStore = createGameGoalsStore();

export const useGameGoals = () => useStore(gameGoalsStore);
