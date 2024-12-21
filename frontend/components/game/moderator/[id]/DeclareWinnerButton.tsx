import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface DeclareWinnerButtonProps {
  id: string
}

const DeclareWinnerButton = ({ id }: DeclareWinnerButtonProps) => {

  function handleDeclareWinner() {

  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => { handleDeclareWinner() }}>
        <Text style={styles.text}>Declare Winner</Text>
      </Pressable>
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