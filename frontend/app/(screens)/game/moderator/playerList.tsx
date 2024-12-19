import { FlatList, GestureResponderEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import ProgressBar from '../../../../components/game/moderator/ProgressBar'
import { router } from 'expo-router'
import { socket } from '@/utils/socket'
import { ImageAndLocation } from '@/types/game'

// This is how the backend is formatted
const dummyUserCategoryImages = {
  user1: {
    id: 'user1',
    categoryImages: [
      [{ image: '1image00', status: 'unchecked' }, { image: '1image01', status: 'unchecked' }],
      [{ image: '1image10', status: 'unchecked' }, { image: '1image11', status: 'unchecked' }]
    ]
  },
  user2: {
    id: 'user2',
    categoryImages: [
      [{ image: '2image00', status: 'unchecked' }, { image: '2image01', status: 'unchecked' }],
      [{ image: '2image10', status: 'unchecked' }, { image: '2image11', status: 'unchecked' }]
    ]
  },
}

const dummyGameGoal = {
  images: 16,
  sets: 4
}

// None of the images, just the progess
const dummyUserProgress = {
  user1: {
    id: 'user1',
    images: {
      unchecked: 4,
      valid: 5,
      invalid: 2
      // Status for "image not taken" is the rest
    },
    sets: {
      unchecked: 1,
      valid: 1,
      invalid: 1
      // Status for "set not finished" is the rest
    }
  },
  user2: {
    id: 'user2',
    images: {
      unchecked: 5,
      valid: 6,
      invalid: 4
      // Status for "image not taken" is the rest
    },
    sets: {
      unchecked: 3,
      valid: 0,
      invalid: 0
      // Status for "set not finished" is the rest
    }
  },
}

const PlayerList = () => {

  // Update UI when data changes
  useEffect(() => {

    // Receive exit room emission, tell server to exit the Socket room and go back home
    socket.on('insertImage', (imageAndLocation: ImageAndLocation, playerId: string) => { // TODO: All three fields must exist in ImageAndLocation
      console.log('received image location (', imageAndLocation.categoryIndex, ", ", imageAndLocation.imageIndex, "), player id is ", playerId); // testing
    });

  }, [])

  // Convert object to array for FlatList
  const userArray = Object.values(dummyUserProgress);

  // Render each user's progress item
  const Item = ({ user }: { user: typeof dummyUserProgress['user1'] }) => { // using one of the dummy's type
    const images = user.images;
    const sets = user.sets;

    function handleItemPressed(event: GestureResponderEvent): void {
      router.push({
        pathname: '/(screens)/game/moderator/[id]',
        params: { id: user.id }
      })
    }

    return (
      // <View>
      <Pressable style={styles.item} onPress={handleItemPressed}>
        <Text style={styles.title}>{user.id}</Text>
        <View style={styles.progress}>
          <Text style={styles.imagesProgress}>{Object.values(user.images).reduce((a, b) => a + b, 0) + "/" + dummyGameGoal.images}</Text>
          <View style={styles.progressBar}>
            <ProgressBar type={'unchecked'} count={sets.unchecked} />
            <ProgressBar type={'valid'} count={sets.valid} />
            <ProgressBar type={'invalid'} count={sets.invalid} />
            <ProgressBar type={'none'} count={dummyGameGoal.sets - Object.values(user.sets).reduce((a, b) => a + b, 0)} />
          </View>
        </View>
      </Pressable>
      // </View>
    );
  };

  // All users as a list
  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={userArray}
        renderItem={({ item }) => <Item user={item} />}
        keyExtractor={(item) => item.id}
      />
    </ScrollView>
  );
};

export default PlayerList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: 'lavender',
    borderRadius: 8,
    justifyContent: 'space-between', // Separate to the sides of the container
    alignItems: 'center', // Centered vertically
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center', // Centered vertically
  },
  progressBar: {
    flexDirection: 'row', // Put all different bar types/colors right next to one another
  },
  imagesProgress: {
    fontSize: 16,
    margin: 10
  }
});