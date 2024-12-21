import { create, useStore } from 'zustand'
import { devtools } from 'zustand/middleware'

interface JoinedPlayersState {
  joinedPlayers: string[];
  setJoinedPlayers: (to: string[]) => void;
}
 
const createJoinedPlayersStore = () => 
  create<JoinedPlayersState>()(
  // devtools
  ((set) => ({
    joinedPlayers: [],
    setJoinedPlayers: (to) => set((state) => ({ joinedPlayers: to })),
  }))
);

// Use a unique store per tab
const joinedPlayersStore = createJoinedPlayersStore();

export const useJoinedPlayers = () => useStore(joinedPlayersStore);
