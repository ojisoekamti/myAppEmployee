import React from 'react';
import {StyleSheet} from 'react-native';
import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
} from 'native-base';

const Otp = ({navigation}) => {
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p="2" py="8" w="90%" mx="auto">
        <Heading size="lg" fontWeight="600" color="coolGray.800">
          2FA Verification 
        </Heading>
        <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
          Input Otp!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label
              _text={{
                color: 'coolGray.800',
                fontSize: 'xs',
                fontWeight: 500,
              }}>
              Input Otp
            </FormControl.Label>
            <Input />
          </FormControl>
          <Button mt="2" colorScheme="amber" _text={{color: 'white'}} onPress={() => navigation.navigate('MainApp')}>
            Submit
          </Button>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default Otp;

const styles = StyleSheet.create({});
