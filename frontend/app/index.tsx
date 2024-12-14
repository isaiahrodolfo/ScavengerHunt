import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'

const App = () => {

  return (
    <Redirect href={'/(screens)/home'} />
  );
}

export default App

const styles = StyleSheet.create({})