import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { socket } from '@/utils/socket'
import { useRoomState } from '@/store/useRoomState'
import { declareWinner } from '@/handlers/gameHandlers'
import { router } from 'expo-router'
import { usePlayerProfiles } from '@/store/usePlayerProfiles'
import { useModeratorSelectedImage } from '@/store/useModeratorSelectedImage';
import { usePlayerProgress } from '@/store/usePlayerProgress'
import { useSelectedPlayerData } from '@/store/useSelectedPlayerData'


interface DeclareWinnerButtonProps {
  id: string;
}

const DeclareWinnerButton = ({ id }: DeclareWinnerButtonProps) => {

  const { roomState, setRoomState } = useRoomState();
  const { playerProfiles } = usePlayerProfiles();

  function handleDeclareWinner() {
    declareWinner(roomState.roomCode, id)
      .then(() => {
        setRoomState({ ...roomState, gameInProgress: false });
        router.replace({
          pathname: '/(screens)/game-over',
          params: { winnerName: playerProfiles[id].name }
        })
      })
  }

  return (
    <View style={styles.container}>
      {roomState.gameInProgress && <Pressable style={styles.button} onPress={() => { handleDeclareWinner() }}>
        <Text style={styles.text}>Declare Winner</Text>
      </Pressable>}
    </View>
  )
}

export default DeclareWinnerButton

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // TODO: Add spacing between these buttons
    // justifyContent: 'space-between',
    // maxWidth: 500,
    marginVertical: 10,
  },
  button: {
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
})