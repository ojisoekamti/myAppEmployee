import React, {useEffect, useState, Component} from 'react';
import {StyleSheet, Alert, BackHandler, TouchableOpacity} from 'react-native';
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
import Home from '../Home';
import Splash from '../Splash';

import {getAsyncData, deleteAsyncData, setAsyncData} from '../../asyncStorage';

function generateOTP() {
  // Declare a digits variable
  // which stores all digits
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  return OTP;
}

var otpVar = generateOTP();
// console.log(otpVar);
const Otp = ({route, navigation}) => {
  const {phone} = route.params;
  const [kodeOtp, setkodeOtp] = useState('');
  const [seconds, setSeconds] = React.useState(60);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [userRole, setUserRole] = useState('');
  const proses = kodeOtp => {
    if (kodeOtp.length > 5) {
      if (kodeOtp != otpVar) {
        Alert.alert('Kode Otp Salah');
      } else {
        setAsyncData('uuid', JSON.parse(userId));
        setAsyncData('uname', userName);
        setAsyncData('uemail', userEmail);
        setAsyncData('uphone', userPhone);
        setAsyncData('uavatar', userAvatar);
        setAsyncData('urole', userRole);
        navigation.navigate('Splash');
      }
    }
  };
  const timerFunc = () => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setSeconds(0);
    }
  };
  React.useEffect(() => {
    timerFunc();
  });

  const getUserData = async () => {
    const uid = await getAsyncData('uuid');
    const uname = await getAsyncData('uname');
    const uemail = await getAsyncData('uemail');
    const uphone = await getAsyncData('uphone');
    const uavatar = await getAsyncData('uavatar');
    const urole = await getAsyncData('urole');
    console.log('uid', uid);
    console.log('name', uname);
    if (uid != null) {
      setUserId(uid);
      setUserName(uname.replace(/['"]+/g, ''));
      setUserEmail(uemail.replace(/['"]+/g, ''));
      setUserPhone(uphone.replace(/['"]+/g, ''));
      setUserAvatar(uavatar.replace(/['"]+/g, ''));
      setUserRole(urole.replace(/['"]+/g, ''));
      deleteAsyncData();
    }
  };

  useEffect(() => {
    const {phone} = route.params;
    console.log(phone);
    console.log(otpVar);

    getUserData();
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
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
    backHandler.remove();
    sendOtp();
    // return;
  }, []);

  const sendOtp = () => {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    otpVar = OTP;
    // console.log(otpVar);
    // return;
    var formdata = new FormData();
    formdata.append('phone_number', phone);
    formdata.append('otp', otpVar);

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    fetch('https://sb.thecityresort.com/api/user-otp', requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
      })
      .catch(error => console.log('error', error));
  };

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
            <Input
              onChangeText={kodeOtp => {
                setkodeOtp(kodeOtp);
                proses(kodeOtp);
              }}
              keyboardType="number-pad"
              value={kodeOtp}
            />

            {seconds > 0 ? (
              <Text
                _text={{
                  fontSize: 'xs',
                  fontWeight: '500',
                  color: 'amber.500',
                }}
                disable={true}
                alignSelf="flex-end"
                mt="1">
                Resend Otp in {seconds}
              </Text>
            ) : (
              <Link
                _text={{
                  fontSize: 'xs',
                  fontWeight: '500',
                  color: 'amber.500',
                }}
                alignSelf="flex-end"
                onPress={() => {
                  sendOtp();
                  setSeconds(60);
                }}
                mt="1">
                Resend Otp ?
              </Link>
            )}
          </FormControl>
          {/* <Button
            mt="2"
            colorScheme="amber"
            _text={{color: 'white'}}
            onPress={() => navigation.navigate('MainApp')}>
            Submit
          </Button> */}
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default Otp;

const styles = StyleSheet.create({});
