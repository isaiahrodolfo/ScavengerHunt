import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react'

interface CategoryObjectProps {
  backgroundColor: string;
  text: string;
}

const CategoryObject = ({ backgroundColor, text }: CategoryObjectProps) => {
  const { width, height } = useWindowDimensions();

  return (
    <View style={[styles.container, { backgroundColor: 'white' }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

export default CategoryObject

const styles = StyleSheet.create({
  container: {
    width: '45%', // Slightly less than 50% for spacing
    height: '45%', // Takes roughly half the vertical space
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 15,
    borderWidth: 3,
    // elevation: 5, // Adds shadow on Android
    // shadowColor: '#000', // Adds shadow on iOS
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
  },
  text: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});