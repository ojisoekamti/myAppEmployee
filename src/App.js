import React, {useEffect} from 'react';
import {
  NativeBaseProvider,
  Box,
  Center,
  useColorMode,
  View,
  Text,
  Button,
  StatusBar,
  HStack,
  IconButton,
  VStack,
  Icon,
} from 'native-base';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Routes from './routes';

export const HomeScreen = ({navigation}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Button
        colorScheme="success"
        onPress={() => navigation.navigate('Details')}>
        Go to details
      </Button>
    </View>
  );
};
export const DetailsScreen = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details Screen</Text>
    </View>
  );
};


export const Example = () => {
  return (
    <>
      <Box
        bg="amber.500"
        p="3"
        _text={{
          fontSize: 'md',
          fontWeight: 'medium',
          color: 'warmGray.50',
          letterSpacing: 'lg',
        }}>
        This is a Box
      </Box>
    </>
  );
};

export default function App() {
  const {colorMode, toggleColorMode} = useColorMode();
  const Stack = createNativeStackNavigator();

  // console.log(colorMode);
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <>
      <NativeBaseProvider>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </NativeBaseProvider>
    </>
  );
}
