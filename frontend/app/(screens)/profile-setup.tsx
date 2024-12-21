import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router';
import { useRoomState } from '@/store/useRoomState';
import { setupProfile } from '@/handlers/roomHandlers';
import { socket } from '@/utils/socket';

const ProfileSetup = () => {

  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for storing error message

  const { roomState } = useRoomState();

  useEffect(() => {
    // (Player) receive exit room emission, tell server to exit the Socket room and go back home
    socket.on('exitRoom', () => {
      socket.emit('exitRoom', { roomCode: roomState.roomCode, roomIsClosed: true });
      router.replace('/(screens)/home');
    });

    // Clean up socket listeners
    return () => {
      socket.off('exitRoom');
    };
  }, []);

  async function handleSetupProfile() {
    // Make sure user inputted a name
    if (!name) {
      setErrorMessage('Please enter a name before proceeding.');
      return;
    }
    setupProfile(roomState.roomCode, name)
      .then((data) => {
        console.log('joinedPlayers', data)
        // setJoinedPlayers(data);
      })
      .catch((error) => {
        setErrorMessage(error);
        return;

      })
    router.replace('/(screens)/game-room');
  }

  return (
    <View style={styles.container}>
      {/* <Text>profile-setup</Text> */}
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Continue" onPress={handleSetupProfile} />
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>} {/* Display error message */}
    </View>
  )
}

export default ProfileSetup

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    borderWidth: 1,
    marginVertical: 10,
    padding: 5,
    width: 200
  },
  errorText: {
    color: 'red',
    marginTop: 10
  },
})