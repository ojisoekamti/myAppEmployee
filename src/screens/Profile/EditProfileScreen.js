import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View, Alert} from 'react-native';
import {getAsyncData, setAsyncData} from '../../asyncStorage';
import {
  Stack,
  ScrollView,
  Text,
  Input,
  Divider,
  VStack,
  Center,
} from 'native-base';
const EditProfileScreen = ({navigation}) => {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  useEffect(() => {
    getUserData();
    return;
  }, []);

  const getUserData = async () => {
    const uid = await getAsyncData('uuid');
    console.log(uid);
    if (uid != null) {
      setUserId(uid);
    }
  };

  const onSubmit = () => {
    var formdata = new FormData();
    formdata.append('name', name);
    formdata.append('uid', userId);

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    fetch('https://thecityresort.com/api/update-user', requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        setAsyncData('uname', name);
        navigation.navigate('MainApp');
      })
      .catch(error => {
        Alert.alert('Data Tidak sesuai');
        console.log('error', error);
      });

    // console.log(data);
  };
  return (
    <>
      <Stack
        style={{
          flex: 1,
          backgroundColor: '#fff',
          paddingTop: 10,
          paddingLeft: 10,
        }}>
        <ScrollView>
          <Text style={{padding: 5, fontWeight: 'bold'}}>Name</Text>
          <Input
            onChangeText={value => {
              setName(value);
            }}
          />
        </ScrollView>
      </Stack>
      <TouchableOpacity onPress={onSubmit}>
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

export default EditProfileScreen;

const styles = StyleSheet.create({});
