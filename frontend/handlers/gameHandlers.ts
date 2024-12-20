import { ImageAndLocation, ImageAndTargetLocation, Status } from '@/types/game';
import { socket } from '@/utils/socket';
import { Callback } from '@/types/socket'

export function insertImage(roomCode: string, imageAndLocation: ImageAndLocation): Promise<string> {
  console.log('sending photo to server...'); // testing 
  return new Promise((resolve, reject) => {
    socket.emit('insertImage', roomCode, imageAndLocation, (response: Callback) => {
      if (response.success) {
        resolve('image inserted');
      } else {
        switch (response.type) {
          case 'RoomDoesNotExist':
            resolve('Error: The room you are trying to connect to does not exist.');
          case 'UserNotFound':
            resolve('Error: The user was not found in the server.');
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

export function getPlayerData(roomCode: string, id: string) {
  return new Promise((resolve, reject) => {
    socket.emit('getPlayerData', roomCode, id, ((response: Callback) => {
      if (response.success && response.data) {
        resolve(response.data) // Return the player data
      } else {
        switch (response.type) {
          case 'RoomDoesNotExist':
            resolve('Error: The room you are trying to connect to does not exist.');
          case 'UserNotFound':
            resolve('Error: The user was not found in the server.');
          case 'UnknownError':
            resolve('An unexpected error occurred. Please try again later.');
            break;
          default: 
            resolve (response.error || 'An unknown error occurred.');
            break;
        }
      }
    }));
  });

}

export function navigateToPlayerList(roomCode: string) {
  return new Promise((resolve, reject) => {
    socket.emit('navigateToPlayerList', roomCode, ((response: Callback) => {
      if (response.success) {
        resolve('');
      } else {
        switch(response.type) {
          case 'RoomDoesNotExist':
            resolve('Error: The room you are trying to connect to does not exist.');
          case 'UserNotFound':
            resolve('Error: The user was not found in the server.');
          case 'UnknownError':
            resolve('An unexpected error occurred. Please try again later.');
            break;
          default: 
            resolve (response.error || 'An unknown error occurred.');
            break;
        }
      }
    }));
  })
}

export function setImageStatus(roomCode: string, id: string, location: {categoryIndex: number, imageIndex: number}, status: Status) {
  return new Promise((resolve, reject) => {
    socket.emit('setImageStatus', roomCode, id, location, status, ((response: Callback) => {
      if (response.success) {
        resolve('');
      } else {
        switch(response.type) {
          case 'RoomDoesNotExist':
            resolve('Error: The room you are trying to connect to does not exist.');
          case 'UserNotFound':
            resolve('Error: The user was not found in the server.');
          case 'UnknownError':
            resolve('An unexpected error occurred. Please try again later.');
            break;
          default: 
            resolve (response.error || 'An unknown error occurred.');
            break;
        }
      }
    }));
  })
}