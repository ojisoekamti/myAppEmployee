import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Stack, Center, View} from 'native-base';

const RequestMenu = () => {
  return (
    <View>
      <Stack direction="row" m="3" justifyContent="space-between">
        <TouchableOpacity>
          <Center
            size="120"
            bg="primary.500"
            rounded="sm"
            _text={{
              color: 'warmGray.50',
              fontWeight: 'bold',
              fontSize: 'md',
            }}
            shadow={'3'}>
            Form Cuti
          </Center>
        </TouchableOpacity>
        <Center
          size="120"
          bg="success.500"
          rounded="sm"
          _text={{
            color: 'warmGray.50',
            fontWeight: 'bold',
            fontSize: 'md',
          }}
          shadow={'3'}>
          Tukar Shift
        </Center>
        <Center
          size="120"
          bg="secondary.500"
          rounded="sm"
          _text={{
            color: 'warmGray.50',
            fontWeight: 'bold',
            fontSize: 'sm',
            textAlign: 'center',
          }}
          shadow={'3'}>
          Penyimpangan Waktu Kerja
        </Center>
      </Stack>
      <Stack direction="row" m="3" justifyContent="space-between">
        <Center
          size="120"
          bg="error.500"
          rounded="sm"
          _text={{
            color: 'warmGray.50',
            fontWeight: 'bold',
            fontSize: 'sm',
            textAlign: 'center',
          }}
          shadow={'3'}>
          Form Lembur
        </Center>
        <Center
          size="120"
          bg="warning.500"
          rounded="sm"
          _text={{
            color: 'warmGray.50',
            fontWeight: 'bold',
            fontSize: 'sm',
            textAlign: 'center',
          }}
          shadow={'3'}>
          Purchase Request
        </Center>
        <Center
          size="120"
          bg="info.500"
          rounded="sm"
          _text={{
            color: 'warmGray.50',
            fontWeight: 'bold',
            fontSize: 'sm',
            textAlign: 'center',
          }}
          shadow={'3'}>
          Barang Keluar
        </Center>
      </Stack>
      <Stack direction="row" m="3" justifyContent="space-between">
        <Center
          size="120"
          bg="primary.500"
          rounded="sm"
          _text={{
            color: 'warmGray.50',
            fontWeight: 'bold',
            fontSize: 'sm',
            textAlign: 'center',
          }}
          shadow={'3'}>
          Barang Masuk
        </Center>
      </Stack>
    </View>
  );
};

export default RequestMenu;

const styles = StyleSheet.create({});
