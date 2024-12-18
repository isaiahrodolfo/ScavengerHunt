import { ImageAndLocation, Room, rooms } from '../types';
import {
  checkIfRoomDoesNotExist,
  checkIfRoomExists,
  checkIfInAnyRoom,
  checkIfNotHost,
  checkIfNotInThisRoom,
  checkIfHost,
  getRoomOfUser,
} from '../handler-helpers';

/**
 * Handles image insertion.
 */
export function handleInsertImage(roomCode: string, imageAndLocation: ImageAndLocation, callback: any, socket: any) {
  
  // TODO: Fill this in

  callback({ success: true });
}
