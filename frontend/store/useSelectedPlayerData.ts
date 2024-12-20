import { PlayerData } from '@/types/game';
import { create, useStore } from 'zustand'
import { devtools } from 'zustand/middleware'

// TODO: Use any type instead of PlayerData, since I am having trouble type guarding
interface PlayerDataState {
  selectedPlayerData: any | {}; // TODO: Start as something? But it will be set, anyway...
  setSelectedPlayerData: (to: any) => void;
}
 
const createSelectedPlayerDataStore = () => 
  create<PlayerDataState>()(
  // devtools
  ((set) => ({
    selectedPlayerData: {},
    setSelectedPlayerData: (to) => set((state) => ({ selectedPlayerData: to })),
  }))
);

// Use a unique store per tab
const playerData = createSelectedPlayerDataStore();

export const useSelectedPlayerData = () => useStore(playerData);
