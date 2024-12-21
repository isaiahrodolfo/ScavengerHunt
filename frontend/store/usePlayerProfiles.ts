import { PlayerProfiles, State } from '@/types/game';
import { create, useStore } from 'zustand'
import { devtools } from 'zustand/middleware'

interface PlayerProfilesState {
  playerProfiles: PlayerProfiles;
  setPlayerProfiles: (to: PlayerProfiles) => void;
}
 
const createPlayerProfilesStore = () => 
  create<PlayerProfilesState>()(
  // devtools
  ((set) => ({
    playerProfiles: {},
    setPlayerProfiles: (to) => set((state) => ({ playerProfiles: to })),
  }))
);

// Use a unique store per tab
const playerProfilesStore = createPlayerProfilesStore();

export const usePlayerProfiles = () => useStore(playerProfilesStore);
