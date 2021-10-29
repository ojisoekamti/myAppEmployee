import React, {Component, useState, useEffect} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {VStack, Center, Input} from 'native-base';
import {getAsyncData} from '../../asyncStorage';

export class EditProfileScreen extends Component {
  render() {
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userAvatar, setUserAvatar] = useState('');

    useEffect(() => {
      const getUserData = async () => {
        const uid = await getAsyncData('uuid');
        const uname = await getAsyncData('uname');
        const uemail = await getAsyncData('uemail');
        const uphone = await getAsyncData('uphone');
        const uavatar = await getAsyncData('uavatar');
        setUserId(uid);
        setUserName(uname.replace(/['"]+/g, ''));
        setUserEmail(uemail.replace(/['"]+/g, ''));
        setUserPhone(uphone.replace(/['"]+/g, ''));
        setUserAvatar(uavatar.replace(/['"]+/g, ''));
      };
      getUserData();
    }, []);
    return (
      <>
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <Input
            mx="3"
            placeholder={{userName}}
            w={{
              base: '75%',
              md: '25%',
            }}
          />
        </View>
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
  }
}

export default EditProfileScreen;
