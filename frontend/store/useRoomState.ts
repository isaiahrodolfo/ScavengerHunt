import { State } from '@/types/room';
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface RoomState {
  roomState: State;
  setRoomState: (to: State) => void;
}

export const useRoomState = create<RoomState>()(
  // devtools
  ((set) => ({
    roomState: {roomCode: '', isHost: false, isModerator: false},
    setRoomState: (to) => set((state) => ({ roomState: to })),
  }))
);