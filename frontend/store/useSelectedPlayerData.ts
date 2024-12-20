import { create, useStore } from 'zustand'
import { devtools } from 'zustand/middleware'

// Same as usePlayerData, just different naming because it's being used by the moderator

// TODO: Use any type instead of PlayerData, since I am having trouble type guarding
interface SelectedPlayerDataState {
  selectedPlayerData: any; // TODO: Start as something? But it will be set, anyway...
  setSelectedPlayerData: (to: any) => void;
}
 
const createSelectedPlayerDataStore = () => 
  create<SelectedPlayerDataState>()(
  // devtools
  ((set) => ({
    selectedPlayerData: {},
    setSelectedPlayerData: (to) => set((state) => ({ selectedPlayerData: to })),
  }))
);

// Use a unique store per tab
const selectedPlayerData = createSelectedPlayerDataStore();

export const useSelectedPlayerData = () => useStore(selectedPlayerData);
