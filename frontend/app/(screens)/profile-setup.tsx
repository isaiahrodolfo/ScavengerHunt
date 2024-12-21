import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router';
import { useRoomState } from '@/store/useRoomState';
import { setupProfile } from '@/handlers/roomHandlers';

const ProfileSetup = () => {

  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for storing error message

  const { roomState } = useRoomState();

  async function handleSetupProfile() {
    const res = await setupProfile(roomState.roomCode, name);
    if (res) {
      setErrorMessage(res);
      return;
    }
    router.replace('/(screens)/game-room');
  }

  return (
    <View style={styles.container}>
      <Text>profile-setup</Text>
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