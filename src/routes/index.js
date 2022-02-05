import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Icon, IconButton, Image} from 'native-base';

import Home from '../screens/Home';
import Splash from '../screens/Splash';
import Chat from '../screens/Chat';
import Profile from '../screens/Profile';
import Login from '../screens/Login';
import Complaint from '../screens/Complaint';
import otp from '../screens/Login/otp';
import ComplaintDetail from '../screens/Complaint/ComplaintDetail';
import ChatScreen from '../screens/Chat/ChatScreen';
import TukarShift from '../screens/Shift';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import ShiftFrom from '../screens/Shift/ShiftFrom';
import ApprovalForm from '../screens/Shift/ApprovalForm';
import ContactListScreen from '../screens/Chat/ContactListScreen';
//import {setAsyncData} from '../asyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RequestMenu from '../screens/RequestMenu';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const MainApp = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarActiveTintColor: '#f59e0b',
        tabBarInactiveTintColor: '#a8a29e',
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Icon size="sm" as={<MaterialIcon name="home" />} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          headerShown: false,
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Icon
                size="sm"
                as={<MaterialIcon name="message" />}
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Icon
                size="sm"
                as={<MaterialIcon name="account-circle" />}
                color={color}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};
const Routes = ({token, notifData}) => {
  //console.log('TOKEN route', token)
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

  const setAsyncData = async (key, item) => {
    try {
      await AsyncStorage.setItem(key, item);
    } catch (error) {
      console.log(error);
    }
  };
  const mobile_token = getData();
  if (mobile_token) {
    setAsyncData('token', token);
  } else if (mobile_token != token) {
    Alert.alert('Hold on!', 'Are you sure you want to exit ?', [
      {
        text: '',
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
    // const backAction = () => {
    //   Alert.alert('Hold on!', 'Are you sure you want to exit ?', [
    //     {
    //       text: 'Cancel',
    //       onPress: () => null,
    //       style: 'cancel',
    //     },
    //     {
    //       text: 'YES',
    //       onPress: () => {
    //         deleteAsyncData();
    //         BackHandler.exitApp();
    //       },
    //     },
    //   ]);
    //   return true;
    // };

    // const backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   backAction,
    // );

    // return () => backHandler.remove();
  }
  if (notifData) {
    setAsyncData('screenNotif', notifData.data.screen);
  }
  //screenNoGumi = 'Chat';
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="MainApp"
        component={MainApp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false, test: 'test'}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ContactListScreen"
        component={ContactListScreen}
        options={{title: 'Contact List'}}
      />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="Otp" component={otp} options={{headerShown: false}} />
      <Stack.Screen name="Complaint" component={Complaint} />
      <Stack.Screen
        name="ComplaintDetail"
        component={ComplaintDetail}
        options={{title: 'Resopnse Complaint Form'}}
      />
      <Stack.Screen
        name="ShiftFrom"
        component={ShiftFrom}
        options={{title: 'Tukar Shift Form'}}
      />
      <Stack.Screen
        name="TukarShift"
        component={TukarShift}
        options={{title: 'Tukar Shift'}}
      />
      <Stack.Screen
        name="ApprovalForm"
        component={ApprovalForm}
        options={{title: 'Approval Form'}}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{title: 'Edit Profile'}}
      />
      <Stack.Screen
        name="RequestMenu"
        component={RequestMenu}
        options={{title: 'Request Menu'}}
      />
    </Stack.Navigator>
  );
};

export default Routes;

const styles = StyleSheet.create({});
