"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateRoom = handleCreateRoom;
exports.handleJoinRoom = handleJoinRoom;
exports.handleStartRoom = handleStartRoom;
exports.handleExitRoom = handleExitRoom;
exports.handleExitRoomOnDisconnect = handleExitRoomOnDisconnect;
function handleCreateRoom(roomCode, socket) {
    socket.join(roomCode);
}
function handleJoinRoom(roomCode, socket) {
    socket.join(roomCode);
}
function handleStartRoom(roomCode, socket) {
    socket.to(roomCode).emit("startRoom");
}
// export function handleCloseRoom(roomCode: string, socket: any) {
//   socket.to(roomCode).emit("startRoom");
// }
function handleExitRoom(roomCode, socket) {
    socket.leave(roomCode);
}
function handleExitRoomOnDisconnect(socket) {
}
