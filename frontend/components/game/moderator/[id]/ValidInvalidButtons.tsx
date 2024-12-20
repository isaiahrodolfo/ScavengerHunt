import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ValidInvalidButtons = () => {
  return (
    <View>
      <Pressable style={styles.valid} onPress={() => { console.log('valid') }}>Valid</Pressable>
      <Pressable style={styles.invalid} onPress={() => { console.log('invalid') }}>Invalid</Pressable>
    </View>
  )
}

export default ValidInvalidButtons

const styles = StyleSheet.create({
  valid: {
    backgroundColor: 'green'
  },
  invalid: {
    backgroundColor: 'red'
  }
})