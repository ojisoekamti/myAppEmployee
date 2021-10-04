import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const MainApp = () => {
  return (
    <Tab.Navigator
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
              <Icon size="sm" as={<MaterialIcon name="message" />} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Complaint"
        component={Complaint}
        options={{
          headerShown: false,
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Icon size="sm" as={<MaterialIcon name="assignment" />} color={color} />
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
              <Icon size="sm" as={<MaterialIcon name="account-circle" />} color={color} />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};
const Routes = () => {
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
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Otp"
        component={otp}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Routes;

const styles = StyleSheet.create({});
