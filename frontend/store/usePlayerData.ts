import { PlayerData } from '@/types/game';
import { create, useStore } from 'zustand'
import { devtools } from 'zustand/middleware'

// TODO: Use any type instead of PlayerData, since I am having trouble type guarding
interface PlayerDataState {
  playerData: PlayerData; // TODO: Start as something? But it will be set, anyway...
  setPlayerData: (to: PlayerData) => void;
}
 
const createPlayerDataStore = () => 
  create<PlayerDataState>()(
  // devtools
  ((set) => ({
    playerData: [],
    setPlayerData: (to) => set((state) => ({ playerData: to })),
  }))
);

// Use a unique store per tab
const playerData = createPlayerDataStore();

export const usePlayerData = () => useStore(playerData);
