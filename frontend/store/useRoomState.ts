import { State } from '@/types/room';
import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import { useStore } from 'zustand';

interface RoomState {
  roomState: State;
  setRoomState: (to: State) => void;
}

const createRoomStore = () =>
  createStore<RoomState>()(
    // devtools
    ((set) => ({
      roomState: { roomCode: '', isHost: false, isModerator: false, hasModerator: false },
      setRoomState: (to) => set(() => ({ roomState: to })),
    }))
  );

// Use a unique store per tab
const roomStore = createRoomStore();

export const useRoomState = () => useStore(roomStore);
