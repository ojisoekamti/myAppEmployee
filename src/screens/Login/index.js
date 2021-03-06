import React, {useState, useEffect} from 'react';
import {Alert, StyleSheet, BackHandler, ActivityIndicator} from 'react-native';
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
  Icon,
  View,
} from 'native-base';
import {setAsyncData, deleteAsyncData, getAsyncData} from '../../asyncStorage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [show, setShow] = React.useState(false);
  const [isLoading, setIsLoading] = useState('');
  const [tokenId, setTokenId] = useState();

  useEffect(() => {
    getData();
    deleteAsyncData();
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit ?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => {
            deleteAsyncData();
            BackHandler.exitApp();
          },
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      // console.log('test', value);
      if (value !== null) {
        // value previously stored
        setTokenId(value);
      }
    } catch (e) {
      // error reading value
    }
  };
  const proses = () => {
    console.log(email);
    console.log(password);
    console.log(tokenId);
    setIsLoading(true);
    fetch('https://thecityresort.com/api/user-login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        tokenId: tokenId,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          console.log(responseJson.data);
          setAsyncData('uuid', responseJson.data.id);
          setAsyncData('uname', responseJson.data.name);
          setAsyncData('uemail', responseJson.data.email);
          setAsyncData('uphone', responseJson.data.phone_number);
          setAsyncData('uavatar', responseJson.data.avatar);
          setAsyncData('urole', responseJson.data.role_id);
          setAsyncData('token', responseJson.data.mobile_token);
          setIsLoading(false);
          navigation.push('Otp', {
            phone: responseJson.data.phone_number,
          });
        } else {
          Alert.alert('Username / Password Salah');
          setIsLoading(false);
        }
      });
    //navigation.navigate('Otp');
  };

  const handleClick = () => setShow(!show);
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
              type={show ? 'text' : 'password'}
              onChangeText={password => {
                setPassword(password);
              }}
              value={password}
              InputRightElement={
                <Icon
                  as={
                    <MaterialIcons
                      name={show ? 'visibility-off' : 'visibility'}
                    />
                  }
                  size={5}
                  mr="2"
                  color="muted.400"
                  onPress={handleClick}
                />
              }
              placeholder="Password"
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
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e4ff0000',
          }}>
          {isLoading ? (
            <ActivityIndicator color={'#fbbf24'} size="large" />
          ) : (
            <View></View>
          )}
        </View>
      ) : (
        <></>
      )}
    </NativeBaseProvider>
  );
};

export default Login;

const styles = StyleSheet.create({});
