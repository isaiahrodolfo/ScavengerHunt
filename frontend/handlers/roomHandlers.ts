import { socket } from '@/utils/socket';

export function createRoom(inputtedRoomCode: string): Promise<string> {
  return new Promise((resolve, reject) => {
    socket.emit('createRoom', inputtedRoomCode, (response: { success: boolean; error?: string; type?: string }) => {
      if (response.success) {
        resolve('');
      } else {
        switch (response.type) {
          case 'RoomDoesAlreadyExists':
            resolve('Error: The room you are trying to create already exists.');
            break;
          case 'AlreadyInRoom':
            resolve('Error: You are already in a game room. Leave the current room before joining a new one.');
            break;
          case 'UnknownError':
            resolve('An unexpected error occurred. Please try again later.');
            break;
          default: 
            resolve (response.error || 'An unknown error occurred.');
            break;
        }
      }
    });
  });
}

export function joinRoom(inputtedRoomCode: string): Promise<string>{
  return new Promise((resolve, reject) => {
    socket.emit('joinRoom', inputtedRoomCode, (response: { success: boolean; error?: string; type?: string }) => {
      if (response.success) {
        resolve('');
      } else {
        switch (response.type) {
          case 'RoomDoesNotExist':
            resolve("The game you're trying to join does not exist.");
            break;
          case 'AlreadyInRoom':
            resolve('Error: You are already in a game room. Leave the current room before joining a new one.');
            break;
          case 'UnknownError':
            resolve('An unexpected error occurred. Please try again later.');
            break;
          default:
            resolve(response.error || 'An unknown error occurred.');
            break;
        }
      }
    });
  });
}