import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the parameter list for your stack navigator
export type RootStackParamList = {
  Home: undefined; // No parameters expected for Home
  GameRoom: {
    gameCode: string;
    isHost: boolean;
  }
  // Details: { itemId: number }; // Details screen expects an itemId parameter
};

// Type for the navigation prop of the Home screen
export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;
