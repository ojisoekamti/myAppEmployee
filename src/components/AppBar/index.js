import React from 'react';
import {StyleSheet, View} from 'react-native';
import {StatusBar, Box, HStack, IconButton, Icon, Text} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AppBar = () => {
  return (
    <>
      <StatusBar backgroundColor="#fbbf24" barStyle="light-content" />

      <Box safeAreaTop backgroundColor="#fbbf24" />

      <HStack
        bg="amber.500"
        px="1"
        py="3"
        justifyContent="space-between"
        alignItems="center">
        <HStack space="6" px="2" alignItems="center">
          <Text color="white" fontSize="20" fontWeight="bold">
            Home
          </Text>
        </HStack>
        <HStack space="2">
          <IconButton
            icon={
              <Icon
                as={<MaterialIcons name="qr-code" />}
                size="sm"
                color="white"
              />
            }
          />
        </HStack>
      </HStack>
    </>
  );
};

export default AppBar;

const styles = StyleSheet.create({});
