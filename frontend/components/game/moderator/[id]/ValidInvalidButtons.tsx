import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useImageStatus } from '@/store/useImageStatus'
import { Status } from '@/types/game'
import { socket } from '@/utils/socket'
import { useModeratorSelectedImage } from '@/store/useModeratorSelectedImage'
import { setImageStatus } from '@/handlers/gameHandlers'
import { useRoomState } from '@/store/useRoomState'
import { usePlayerProgress } from '@/store/usePlayerProgress'

interface ValidInvalidButtonsProps {
  id: string
}

const ValidInvalidButtons = ({ id }: ValidInvalidButtonsProps) => {

  const { roomState } = useRoomState();
  const { moderatorSelectedImage } = useModeratorSelectedImage();
  const { setPlayerProgress } = usePlayerProgress(); // Multiple players' progresses

  async function handleSetImageStatus(status: Status) {
    if (moderatorSelectedImage.imageUri != '' && typeof moderatorSelectedImage.categoryIndex != 'undefined' && typeof moderatorSelectedImage.imageIndex != 'undefined') {
      setImageStatus(
        roomState.roomCode,
        id,
        {
          categoryIndex: moderatorSelectedImage.categoryIndex!,
          imageIndex: moderatorSelectedImage.imageIndex!
        },
        status) // Update status globally
        .then((data) => {
          setPlayerProgress(data); // Update status locally
        })
    }

  }

  return (
    <View style={styles.container}>
      {moderatorSelectedImage.imageUri != '' && <>
        <Pressable style={styles.valid} onPress={() => { handleSetImageStatus('valid') }}>
          <Text style={styles.text}>Valid</Text>
        </Pressable>
        <Pressable style={styles.invalid} onPress={() => { handleSetImageStatus('invalid') }}>
          <Text style={styles.text}>Invalid</Text>
        </Pressable>
      </>}
    </View>
  )
}

export default ValidInvalidButtons

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // TODO: Add spacing between these buttons
    justifyContent: 'space-between',
    maxWidth: 300,
    marginVertical: 10,
  },
  valid: {
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 10,
    marginRight: 5
  },
  invalid: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 10,
    marginLeft: 5
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
})