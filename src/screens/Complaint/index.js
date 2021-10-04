import React from 'react';
import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import {Heading, Stack, Center, VStack, ImageButton} from 'native-base';
const Complaint = () => {
  return (
    <View style={{backgroundColor: '#fff', flex: 1, alignItems: 'center'}}>
      <VStack space="2.5" mt="4">
        <Stack direction="row" mb="2.5" mt="1.5" ml="2" space={3}>
          <TouchableOpacity>
            <Center
              size="120"
              bg="primary.500"
              rounded="sm"
              _text={{
                color: 'warmGray.50',
                fontWeight: 'medium',
              }}
              shadow={'3'}>
              Security
            </Center>
          </TouchableOpacity>
          <TouchableOpacity>
            <Center
              bg="secondary.500"
              size="120"
              rounded="sm"
              _text={{
                color: 'warmGray.50',
                fontWeight: 'medium',
              }}
              shadow={'3'}>
              CSO
            </Center>
          </TouchableOpacity>
          <TouchableOpacity>
            <Center
              size="120"
              bg="emerald.500"
              rounded="sm"
              _text={{
                color: 'warmGray.50',
                fontWeight: 'medium',
              }}
              shadow={'3'}>
              Admin
            </Center>
          </TouchableOpacity>
        </Stack>
      </VStack>
      <View style={styles.bottom}>
        <TouchableOpacity>
          <Center
            height={20}
            width={300}
            bg="danger.500"
            rounded="sm"
            _text={{
              color: 'warmGray.50',
              fontWeight: 'bold',
              fontSize:20
            }}
            shadow={'3'}>
            Panic!!!
          </Center>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Complaint;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 0,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
});
