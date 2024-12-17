import { socket } from '@/utils/socket';

export function createRoom(roomCode: string): Promise<string> {
  return new Promise((resolve, reject) => {
    socket.emit('createRoom', roomCode, (response: { success: boolean; error?: string; type?: string }) => {
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

export function joinRoom(roomCode: string): Promise<string>{
  return new Promise((resolve, reject) => {
    socket.emit('joinRoom', roomCode, (response: { success: boolean; error?: string; type?: string }) => {
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

export function startRoom(roomCode: string): Promise<string>{
  return new Promise((resolve, reject) => {
    socket.emit('startRoom', roomCode, (response: { success: boolean; error?: string; type?: string }) => {
      if (response.success) {
        resolve('');
      } else {
        switch (response.type) {
          case 'RoomDoesNotExist':
            resolve("Error: The game you're trying to join does not exist.");
            break;
          case 'NotHost':
            resolve('Error: You are not the host. Only the host can start the game.');
            break;
          case 'GameEmpty':
            resolve('Cannot start the game. No players have joined.');
            break;
          case 'GameStarted':
            resolve('You cannot start this game because the game has already started.');
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

export function closeRoom(roomCode: string): Promise<string>{
  return new Promise((resolve, reject) => {
    socket.emit('closeRoom', roomCode, (response: { success: boolean; error?: string; type?: string }) => {
      if (response.success) {
        resolve('');
      } else {
        switch (response.type) {
          case 'RoomDoesNotExist':
            resolve("Error: The game you're trying to close does not exist.");
            break;
          case 'NotHost':
            resolve('Error: You are not the host. Only the host can close the room.');
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

export function exitRoom(roomCode: string): Promise<string>{
  return new Promise((resolve, reject) => {
    socket.emit('exitRoom', roomCode, false, (response: { success: boolean; error?: string; type?: string }) => {
      if (response.success) {
        resolve('');
      } else {
        switch (response.type) {
          case 'RoomDoesNotExist':
            resolve("Error: The game you're trying to close does not exist.");
            break;
          case 'Host':
            resolve('Error: You are the host. The host cannot exit the room unless they close it.');
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