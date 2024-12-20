import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ValidInvalidButtons = () => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.valid} onPress={() => { console.log('valid') }}>
        <Text style={styles.text}>Valid</Text>
      </Pressable>
      <Pressable style={styles.invalid} onPress={() => { console.log('invalid') }}>
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