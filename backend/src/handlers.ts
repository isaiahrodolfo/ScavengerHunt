import { Room, rooms } from './types'; // Import types
import { checkIfRoomDoesNotExist, checkIfRoomExists, checkIfInAnyRoom, checkIfInThisRoom, checkIfNotHost, getRoomOfUser } from './handler-helpers';
import { AlreadyInRoomError, RoomDoesNotExistError } from './errors';

export function handleCreateRoom(roomCode: string, socket: any) {
  socket.join(roomCode);
}

export function handleJoinRoom(roomCode: string, socket: any) {
  socket.join(roomCode);
}

export function handleStartRoom(roomCode: string, socket: any) {
  socket.to(roomCode).emit("startRoom");
}

// export function handleCloseRoom(roomCode: string, socket: any) {
//   socket.to(roomCode).emit("startRoom");
// }

export function handleExitRoom(roomCode: string, socket: any) {
  socket.leave(roomCode);
}

export function handleExitRoomOnDisconnect(socket: any) {

}