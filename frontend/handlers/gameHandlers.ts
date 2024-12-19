import { ImageAndLocation } from '@/types/game';
import { socket } from '@/utils/socket';

export function insertImage(roomCode: string, imageAndLocation: ImageAndLocation): Promise<string> {
  console.log('sending photo to server...'); // testing 
  return new Promise((resolve, reject) => {
    socket.emit('insertImage', roomCode, imageAndLocation, (response: { success: boolean; error?: string; type?: string }) => {
      if (response.success) {
        resolve('hihihi');
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