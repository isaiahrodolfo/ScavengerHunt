import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import React from 'react';
import { CameraCapturedPicture } from 'expo-camera';

interface CategoryObjectProps {
  backgroundColor: string;
  number: number;
  text: string;
  images: string[]; // Array of CameraCapturedPicture objects
}

const CategoryObject = ({ backgroundColor, number, text, images }: CategoryObjectProps) => {
  return (
    <View style={[styles.container, { backgroundColor: 'lavender' }]}>
      {/* Top Half: Number and Text */}
      <View style={styles.description}>
        <Text style={styles.number}>{number}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>

      {/* Bottom Half: Scrollable Images */}
      <View style={styles.images}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          {images.map((imageUri, index) => (
            <Image
              key={index}
              source={{ uri: imageUri }}
              style={styles.image}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default CategoryObject;

const styles = StyleSheet.create({
  container: {
    width: '45%', // Slightly less than half the screen width
    height: 130, // Adjust the height as needed
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden', // Prevent content overflow
  },
  description: {
    flex: 1, // Takes half of the container's height
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  number: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,
    marginRight: 15
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 1, // Prevent overflow of text
    marginRight: 10
  },
  images: {
    flex: 1, // Takes the other half
    paddingVertical: 5,
    marginLeft: 5,
    marginRight: 5,
  },
  image: {
    width: 60, // Fixed width for each image
    height: 50, // Fixed height for each image
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 10,
    backgroundColor: '#ccc', // Placeholder for images
  },
});
