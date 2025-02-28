import { StyleSheet, Text, View, ScrollView, Image, Pressable, TouchableOpacity, GestureResponderEvent } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { CameraCapturedPicture } from 'expo-camera';
import { ImageAndLocation, Status } from '@/types/game';
import { useGameState } from '@/store/useGameState';
import { useModeratorSelectedImage } from '@/store/useModeratorSelectedImage';
import { useRoomState } from '@/store/useRoomState';
import { insertImage } from '@/handlers/gameHandlers';

interface CategoryObjectProps {
  categoryIndex: number;
  backgroundColor: string;
  number: number;
  text: string;
  images: { imageUri: string, status: Status }[];
}

const ModeratorCategoryObject = ({ categoryIndex, backgroundColor, number, text, images }: CategoryObjectProps) => {

  const { moderatorSelectedImage, setModeratorSelectedImage } = useModeratorSelectedImage();

  const scrollViewRef = useRef<ScrollView | null>(null);

  // // Use an effect to scroll to the end after the images have been laid out
  // useEffect(() => {
  //   if (images.length > 0 && scrollViewRef.current) {
  //     scrollViewRef.current.scrollToEnd({ animated: true });
  //   }
  // }, [images]); // This will trigger whenever images change

  function handleImagePressed({ imageUri, categoryIndex, imageIndex }: { imageUri: string, categoryIndex: number, imageIndex: number }) {
    setModeratorSelectedImage({ imageUri, categoryIndex, imageIndex });
    console.log("categoryIndex, imageIndex", categoryIndex, imageIndex); // testing
    console.log("categoryIndex, imageIndex", moderatorSelectedImage.categoryIndex, moderatorSelectedImage.imageIndex); // testing
  }

  function getStatusColor(status: Status): string {
    switch (status) {
      case 'unchecked':
        return 'yellow';
      case 'valid':
        return 'green';
      case 'invalid':
        return 'red';
      case 'none':
      default:
        return 'gray'; // Fallback color
    }
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View>
        {/* Top Half: Number and Text */}
        <View style={styles.description}>
          <Text style={styles.number}>{number}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>

        {/* Bottom Half: Scrollable Images */}
        <View style={styles.imagesList}>
          {images.length > 0 ? (
            <ScrollView
              style={styles.scrollView}
              horizontal showsHorizontalScrollIndicator={true}
              ref={scrollViewRef}
            >
              {images.map((image, index) => (
                <Pressable
                  key={`${categoryIndex}-${index}`}
                  onPress={() => {
                    if (image.status != 'none') {
                      handleImagePressed({
                        imageUri: image.imageUri,
                        categoryIndex: categoryIndex,
                        imageIndex: index,
                      })
                    }
                  }
                  }
                >
                  <Image
                    source={{ uri: image.imageUri }}
                    style={[styles.image, moderatorSelectedImage.categoryIndex == categoryIndex && moderatorSelectedImage.imageIndex == index && { borderColor: 'blue', borderWidth: 3 }]}
                  />
                  {/* Image number */}
                  <View style={[styles.indexCircle, { backgroundColor: image.status == 'valid' ? 'green' : image.status == 'invalid' ? 'red' : 'yellow', }]}>
                    <Text style={[styles.indexText, { color: image.status == 'unchecked' ? 'black' : 'white' }]}>{index + 1}</Text>
                  </View>
                  {/* Transparent overlay */}
                  <View
                    style={[
                      styles.overlay,
                      moderatorSelectedImage.categoryIndex == categoryIndex && moderatorSelectedImage.imageIndex == index && { borderColor: 'blue', borderWidth: 3 },
                      {
                        backgroundColor: image.status == 'valid' ? 'green' : image.status == 'invalid' ? 'red' : 'gray',
                        opacity: image.status == 'unchecked' ? 0 : 0.2, // Adjust the transparency
                      },
                    ]}
                  />
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.scrollView}>
              <View style={styles.emptyImagePlaceholder} />
            </View>
          )}
          {/* Placeholder when there are no images */}
        </View>
      </View >
    </View >
  );
};

export default ModeratorCategoryObject;

const styles = StyleSheet.create({
  container: {
    width: '100%', // Slightly less than half the screen width
    height: 210, // Height remains the same for consistency
    margin: 0,
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
    paddingTop: 0,
    height: 100
  },
  number: {
    fontSize: 28,
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
  imagesList: {
    flex: 1, // Takes the other half
    paddingVertical: 0,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 10, // Keep images inside rounded container
  },
  scrollView: {
    height: 95,
  },
  imageContainer: {
    // width: 65, // Fixed width for each image
    // height: 50, // Fixed height for each image
    // marginLeft: 5,
    // // marginRight: 5,
    // borderRadius: 10,
    // justifyContent: 'center', // Center content vertically
    // alignItems: 'center', // Center content horizontally
    // // backgroundColor: '#ccc', // Placeholder for images
  },
  image: {
    width: 75, // Fixed width for each image
    height: 60, // Fixed height for each image
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 10,
    position: 'relative',
    // backgroundColor: '#ccc', // Placeholder for images
    // borderColor: 'blue',
    // borderWidth: 3
  },
  overlay: {
    width: 75, // Fixed width for each image
    height: 60,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    marginLeft: 5,
    borderRadius: 10,
  },
  emptyImagePlaceholder: {
    height: 50, // Fixed height for placeholder image
    borderRadius: 10,
  },
  imageWrapper: {
    position: 'relative', // Required for overlay positioning
  },
  indexCircle: {
    position: 'absolute',
    top: 5,
    right: 10,
    width: 16,
    height: 16,
    borderRadius: 10,
    // backgroundColor: 'gray', // Circle color
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure it stays above the image
  },
  indexText: {
    color: 'white',
    fontSize: 10,
    // fontWeight: 'bold',
  },
});

