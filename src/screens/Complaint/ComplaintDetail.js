import {
  Heading,
  TextArea,
  Divider,
  Box,
  Stack,
  Center,
  VStack,
  HStack,
} from 'native-base';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const ComplaintDetail = () => {
  return (
    <>
      <Stack
        style={{
          flex: 1,
          backgroundColor: '#fff',
          paddingTop: 10,
          paddingLeft: 10,
        }}>
        <Box>
          <Heading size="lg" style={{}}>
            Barang Mencurigakan
          </Heading>
          <Divider my="2" />
        </Box>
        <Text style={{padding: 5, fontWeight: 'bold'}}>Keterangan</Text>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
        <Divider my="2" />
        <Text style={{padding: 5, fontWeight: 'bold'}}>Realisasi</Text>
        <TextArea placeholder="Text Area Placeholder" />

        <Divider my="2" />
        <Text style={{padding: 5, fontWeight: 'bold'}}>Penyelesaian</Text>
        <TextArea placeholder="Text Area Placeholder" />
      </Stack>
      <TouchableOpacity>
        <VStack bg={'amber.500'}>
          <Center
            height={10}
            width={100}
            rounded="sm"
            _text={{
              color: 'warmGray.50',
              fontWeight: 'bold',
            }}>
            Submit
          </Center>
        </VStack>
      </TouchableOpacity>
    </>
  );
};

export default ComplaintDetail;

const styles = StyleSheet.create({
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
});
