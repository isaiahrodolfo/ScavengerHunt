import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useImageStatus } from '@/store/useImageStatus'
import { Status } from '@/types/game'
import { socket } from '@/utils/socket'
import { useSelectedImage } from '@/store/useSelectedImage'
import { setImageStatus } from '@/handlers/gameHandlers'
import { useRoomState } from '@/store/useRoomState'
import { usePlayerProgress } from '@/store/usePlayerProgress'

interface ValidInvalidButtonsProps {
  id: string
}

const ValidInvalidButtons = ({ id }: ValidInvalidButtonsProps) => {

  const { roomState } = useRoomState();
  const { selectedImage } = useSelectedImage();
  const { setPlayerProgress } = usePlayerProgress(); // Multiple player's progresses

  async function handleSetImageStatus(status: Status) {
    setImageStatus(
      roomState.roomCode,
      id,
      {
        categoryIndex: selectedImage.categoryIndex!,
        imageIndex: selectedImage.imageIndex!
      },
      status) // Update status globally
      .then((data) => {
        setPlayerProgress(data); // Update status locally
      })
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.valid} onPress={() => { handleSetImageStatus('valid') }}>
        <Text style={styles.text}>Valid</Text>
      </Pressable>
      <Pressable style={styles.invalid} onPress={() => { handleSetImageStatus('invalid') }}>
        <Text style={styles.text}>Invalid</Text>
      </Pressable>
    </View>
  )
}

export default ValidInvalidButtons

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // TODO: Add spacing between these buttons
    // justifyContent: 'space-between',
    // maxWidth: 500,
    marginVertical: 10,
  },
  valid: {
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 10,
  },
  invalid: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
})