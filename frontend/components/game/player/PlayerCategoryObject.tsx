import { StyleSheet, Text, View, ScrollView, Image, Pressable, TouchableOpacity, GestureResponderEvent } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { CameraCapturedPicture } from 'expo-camera';
import { ImageAndLocation, PlayerData } from '@/types/game';
import { useGameState } from '@/store/useGameState';
import { useSelectedImage } from '@/store/useSelectedImage';
import { useCategoryImages } from '@/store/useCategoryImages';
import { useRoomState } from '@/store/useRoomState';
import { insertImage } from '@/handlers/gameHandlers';
import { socket } from '@/utils/socket';
import { usePlayerData } from '@/store/usePlayerData';

interface CategoryObjectProps {
  categoryIndex: number;
  backgroundColor: string;
  number: number;
  text: string;
  images: string[]; // Array of CameraCapturedPicture objects
}

const PlayerCategoryObject = ({ categoryIndex, backgroundColor, number, text, images }: CategoryObjectProps) => {

  const { roomState } = useRoomState();
  const { gameState, setGameState } = useGameState();
  const { selectedImage, setSelectedImage } = useSelectedImage();
  const { categoryImages, setCategoryImages } = useCategoryImages();
  const { playerData, setPlayerData } = usePlayerData();

  const scrollViewRef = useRef<ScrollView | null>(null);

  // Use an effect to scroll to the end after the images have been laid out
  useEffect(() => {
    if (images.length > 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [images]); // This will trigger whenever images change

  function handleImagePressed({ imageUri, categoryIndex, imageIndex }: ImageAndLocation) {
    switch (gameState) {
      case 'take':
      case 'view':
        setSelectedImage({ imageUri, categoryIndex, imageIndex });
        setGameState('view'); // State is already 'view', if 'view'
        break;
    }
  }

  function handleCategoryPressed(categoryIndex: number) {
    switch (gameState) {
      case 'put': // Put the image the user just took in the selected category
        addImageToCategory(categoryIndex);
        setGameState('take');
      default: break;
    }
  }

  // Helper function
  async function addImageToCategory(categoryIndex: number, imageIndex?: number) {
    if (selectedImage) {

      setCategoryImages({
        imageUri: selectedImage.imageUri,
        categoryIndex: categoryIndex!,
        imageIndex: imageIndex
      });

      // UPDATE PLAYER DATA LOCALLY
      const updatedPlayerData = playerData;
      updatedPlayerData[categoryIndex].push({ imageUri: selectedImage.imageUri, status: 'unchecked' });

      console.log('updatedPlayerData', updatedPlayerData);
      setPlayerData(updatedPlayerData);

      // Now update the server with the new image
      const res = await insertImage(roomState.roomCode, { imageUri: selectedImage.imageUri, categoryIndex, imageIndex: imageIndex ? imageIndex : categoryImages[categoryIndex].images.length - 1 })
      if (res) {
        console.log(res);
      }
      setSelectedImage({ imageUri: '' }); // That image is placed, and now we remove it from the cache
    }
  }

  // function handlePressOutside(event: GestureResponderEvent): void {
  //   switch (gameState) {
  //     case 'view': // When pressed out of an image (the user does not want to look at images anymore)
  //       setGameState('take');
  //       break;
  //   }
  // }

  return (
    <View style={[styles.container, { backgroundColor: gameState == 'put' ? 'thistle' : 'lavender' }]} pointerEvents={gameState == 'put' ? 'auto' : 'none'}>
      <Pressable
        onPress={() => {
          handleCategoryPressed(categoryIndex);
          scrollViewRef.current?.scrollToEnd();
        }}>
        {/* Top Half: Number and Text */}
        <View style={styles.description}>
          <Text style={styles.number}>{number}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>

        {/* Bottom Half: Scrollable Images */}
        {/* Cannot select individual photos when selecting a category */}
        <View style={styles.imagesList} pointerEvents='auto'>
          {images.length > 0 ? (
            <ScrollView
              style={styles.scrollView}
              horizontal showsHorizontalScrollIndicator={true}
              pointerEvents={['put'].includes(gameState) ? 'none' : 'auto'}
              ref={scrollViewRef}
            >
              {categoryImages[categoryIndex].images.map((imageUri, index) => (
                <Pressable
                  key={`${categoryIndex}-${index}`}
                  onPress={() =>
                    handleImagePressed({
                      imageUri,
                      categoryIndex: categoryIndex,
                      imageIndex: index,
                    })
                  }
                >
                  <Image
                    source={{ uri: imageUri }}
                    style={[styles.image, ['view', 'retake'].includes(gameState) && selectedImage.categoryIndex == categoryIndex && selectedImage.imageIndex == index && { borderColor: 'blue', borderWidth: 3 }]}
                  />
                  {/* Transparent overlay */}
                  <View
                    style={[
                      styles.overlay,
                      selectedImage.categoryIndex == categoryIndex && selectedImage.imageIndex == index && { borderColor: 'blue', borderWidth: 3 },
                      {
                        // backgroundColor: image.status == 'unchecked' ? 'yellow' : image.status == 'valid' ? 'green' : image.status == 'invalid' ? 'red' : 'gray',
                        opacity: 0.2, // Adjust the transparency
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
      </Pressable >
    </View >
  );
};

export default PlayerCategoryObject;

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
  imagesList: {
    flex: 1, // Takes the other half
    paddingVertical: 5,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 10, // Keep images inside rounded container
  },
  scrollView: {
    height: 60
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
    width: 65, // Fixed width for each image
    height: 50, // Fixed height for each image
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 10,
    position: 'relative',
    // backgroundColor: '#ccc', // Placeholder for images
    // borderColor: 'blue',
    // borderWidth: 3
  },
  overlay: {
    width: 65, // Fixed width for each image
    height: 50,
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
});

