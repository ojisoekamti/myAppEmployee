import React, {useEffect, useState} from 'react';
import {StyleSheet, Alert} from 'react-native';
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
console.log(otpVar);
const Otp = ({route, navigation}) => {
  const {phone} = route.params;
  const [kodeOtp, setkodeOtp] = useState('');
  const proses = kodeOtp => {
    if (kodeOtp.length > 5) {
      if (kodeOtp != otpVar) {
        Alert.alert('Kode Otp Salah');
      } else {
        navigation.navigate('MainApp');
      }
    }
  };

  useEffect(() => {
    const {phone} = route.params;
    console.log(phone);
    return;
    fetch(
      'https://api.k1nguniverse.com/api/v1/send?api_key=veoWXwRgiYOcsXa&api_pass=6rL8A2k0&module=SMS&sub_module=LONGNUMBER&sid=K1NGLONGOTP&destination=' +
        phone +
        '&content=Your OTP is' +
        otpVar,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.success) {
          navigation.push('Otp', {
            phone: responseJson.data.phone_number,
          });
        }
      });
  }, []);
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
