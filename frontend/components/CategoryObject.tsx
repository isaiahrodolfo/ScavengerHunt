import { StyleSheet, Text, View, ScrollView, Image, Pressable, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { CameraCapturedPicture } from 'expo-camera';

interface CategoryObjectProps {
  categoryIndex: number;
  backgroundColor: string;
  number: number;
  text: string;
  images: string[]; // Array of CameraCapturedPicture objects
  onPress: (index: number) => void;
  isSelecting: boolean;
}

const CategoryObject = ({ categoryIndex: index, backgroundColor, number, text, images, onPress, isSelecting }: CategoryObjectProps) => {

  const scrollViewRef = useRef<ScrollView | null>(null);

  // Use an effect to scroll to the end after the images have been laid out
  useEffect(() => {
    if (images.length > 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [images]); // This will trigger whenever images change

  return (
    <View style={[styles.container, { backgroundColor: isSelecting ? 'thistle' : 'lavender' }]} pointerEvents={isSelecting ? 'auto' : 'none'}>
      <Pressable onPress={() => {
        onPress(index);
        scrollViewRef.current?.scrollToEnd();
      }}>
        {/* Top Half: Number and Text */}
        <View style={styles.description}>
          <Text style={styles.number}>{number}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>

        {/* Bottom Half: Scrollable Images */}
        <View style={styles.imagesWrapper} pointerEvents='auto'>
          {images.length > 0 ? (
            // Cannot select individual photos when selecting a category
            <ScrollView
              style={styles.scrollView}
              horizontal showsHorizontalScrollIndicator={true}
              pointerEvents={isSelecting ? 'none' : 'auto'}
              ref={scrollViewRef}
            >
              {images.map((imageUri, index) => (
                <TouchableOpacity key={index} style={styles.image}>
                  <Image source={{ uri: imageUri }} style={styles.image} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            // Placeholder when there are no images
            <View style={styles.scrollView}>
              <View style={styles.emptyImagePlaceholder} />
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};

export default CategoryObject;

const styles = StyleSheet.create({
  container: {
    width: '45%', // Slightly less than half the screen width
    height: 130, // Height remains the same for consistency
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden', // Prevent content overflow but keep rounded corners
    backgroundColor: 'lavender', // Default background color
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
  imagesWrapper: {
    flex: 1, // Takes the other half
    paddingVertical: 5,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 10, // Keep images inside rounded container
  },
  scrollView: {
    height: 60
  },
  image: {
    width: 60, // Fixed width for each image
    height: 50, // Fixed height for each image
    marginLeft: 5,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: '#ccc', // Placeholder for images
  },
  emptyImagePlaceholder: {
    height: 50, // Fixed height for placeholder image
    borderRadius: 10,
  },
});
