import {Center, NativeBaseProvider, Text} from 'native-base';
import {convertAbsoluteToRem} from 'native-base/lib/typescript/theme/tools';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {getAsyncData, deleteAsyncData} from '../../asyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      const getUserData = async () => {
        const userData = await getAsyncData('uuid');
        // console.log('Route', token);
        // console.log('userData', userData);
        if (userData) {
          navigation.replace('MainApp');
        } else {
          navigation.replace('Login');
        }
      };
      getUserData();
    }, 3000);
  }, [navigation]);

  return (
    <NativeBaseProvider>
      <Center flex={1} bg="amber.400">
        <Text fontFamily="body" fontWeight="bold" fontSize={50} color="#fff">
          The City Resort
        </Text>
        <Text fontFamily="body" fontWeight="bold" fontSize={30} color="#fff">
          Apartment
        </Text>
      </Center>
    </NativeBaseProvider>
  );
};

export default Splash;

const styles = StyleSheet.create({});
