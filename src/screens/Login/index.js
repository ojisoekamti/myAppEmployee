import React, {useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
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
import {setAsyncData} from '../../asyncStorage/main';
import { uid } from '../../utils/constants/const';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const proses = () => {
    console.log(email);
    console.log(password);
    fetch('https://sb.thecityresort.com/api/user-login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          setAsyncData(responseJson.data.phone_number,uid);
          console.log(getAsyncData('uid'))
          navigation.push('Otp', {
            phone: responseJson.data.phone_number,
          });
        } else {
          Alert.alert('Username / Password Salah');
        }
      });
    //navigation.navigate('Otp');
  };
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p="2" py="8" w="90%" mx="auto">
        <Heading size="lg" fontWeight="600" color="coolGray.800">
          Welcome
        </Heading>
        <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
          Sign in to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label
              _text={{
                color: 'coolGray.800',
                fontSize: 'xs',
                fontWeight: 500,
              }}>
              Email ID
            </FormControl.Label>
            <Input
              onChangeText={email => {
                setEmail(email);
              }}
              value={email}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label
              _text={{
                color: 'coolGray.800',
                fontSize: 'xs',
                fontWeight: 500,
              }}>
              Password
            </FormControl.Label>
            <Input
              type="password"
              onChangeText={password => {
                setPassword(password);
              }}
              value={password}
            />
            <Link
              _text={{fontSize: 'xs', fontWeight: '500', color: 'amber.500'}}
              alignSelf="flex-end"
              mt="1">
              Forget Password?
            </Link>
          </FormControl>
          <Button
            mt="2"
            colorScheme="amber"
            _text={{color: 'white'}}
            onPress={() => proses()}>
            Sign in
          </Button>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default Login;

const styles = StyleSheet.create({});
