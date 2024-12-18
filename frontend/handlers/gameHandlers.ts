import { ImageAndLocation } from '@/types/game';
import { socket } from '@/utils/socket';

export function insertPhoto(roomCode: string, imageAndLocation: ImageAndLocation): Promise<string> {
  console.log('sending photo to server...'); // testing 
  return new Promise((resolve, reject) => {
    socket.emit('insertPhoto', roomCode, imageAndLocation, (response: { success: boolean; error?: string; type?: string }) => {
      if (response.success) {
        resolve('');
      } else {
        switch (response.type) {
          case '':
            
          break;
        
          default:
            break;
        }
      }
    });
  });
}