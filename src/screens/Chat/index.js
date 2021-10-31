import React, {useEffect, useState} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';

import {
  NativeBaseProvider,
  Box,
  Text,
  Pressable,
  Heading,
  IconButton,
  Icon,
  HStack,
  Avatar,
  VStack,
  Spacer,
} from 'native-base';
import {SwipeListView} from 'react-native-swipe-list-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {getAsyncData} from '../../asyncStorage';

export default function Chat({navigation}) {
  const [mode, setMode] = useState('Basic');

  return (
    <NativeBaseProvider>
      <Box bg="white" flex="1" safeAreaTop>
        <Heading p="4" pb="3" size="lg">
          Inbox
        </Heading>
        <Basic navigation={navigation} />
      </Box>
    </NativeBaseProvider>
  );
}

function Basic({navigation}) {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [listData, setListData] = useState();
  let data = [];

  useEffect(() => {
    const getUserData = async () => {
      const uid = await getAsyncData('uuid');
      const uname = await getAsyncData('uname');
      const urole = await getAsyncData('urole');
      setUserId(uid);
      setUserName(uname);
      setUserRole(urole);
      var url =
        'https://sb.thecityresort.com/api/user-role?uid=' +
        uid +
        '&role=' +
        urole;
      console.log(url);
      var formdata = new FormData();

      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
          result = JSON.parse(result);
          console.log(result);
          if (result[0].lev2 > 0 && result[0].lev3 > 0) {
            data.push(
              {
                id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
                fullName: 'PPRS - Security',
                prefix: 'pprs-security',
                timeStamp: '12:47 PM',
                // recentText: 'Good Day!',
                avatarUrl:
                  'https://sb.thecityresort.com/storage/settings/September2021/tmeKkn3np2dVp2tTkkgX.png',
              },
              {
                id: 'bd7acbeb-c1b1-46c2-aed5-3ad53abb28ba',
                fullName: 'Dansek - Danru ',
                prefix: 'dansek-danru',
                timeStamp: '12:47 PM',
                // recentText: 'Good Day!',
                avatarUrl:
                  'https://sb.thecityresort.com/storage/settings/September2021/tmeKkn3np2dVp2tTkkgX.png',
              },
              {
                id: 'bd7acbeb-c1b1-46c2-aed5-2ad53abb28ba',
                fullName: 'Security CRR ',
                prefix: 'security-crr',
                timeStamp: '12:47 PM',
                // recentText: 'Good Day!',
                avatarUrl:
                  'https://sb.thecityresort.com/storage/settings/September2021/tmeKkn3np2dVp2tTkkgX.png',
              },
            );
          } else if (result[0].lev2 > 0) {
            data.push(
              {
                id: 'bd7acbeb-c1b1-46c2-aed5-3ad53abb28ba',
                fullName: 'Dansek - Danru ',
                prefix: 'dansek-danru',
                timeStamp: '12:47 PM',
                // recentText: 'Good Day!',
                avatarUrl:
                  'https://sb.thecityresort.com/storage/settings/September2021/tmeKkn3np2dVp2tTkkgX.png',
              },
              {
                id: 'bd7acbeb-c1b1-46c2-aed5-2ad53abb28ba',
                fullName: 'Security CRR ',
                prefix: 'security-crr',
                timeStamp: '12:47 PM',
                // recentText: 'Good Day!',
                avatarUrl:
                  'https://sb.thecityresort.com/storage/settings/September2021/tmeKkn3np2dVp2tTkkgX.png',
              },
            );
          } else {
            data.push({
              id: 'bd7acbeb-c1b1-46c2-aed5-2ad53abb28ba',
              fullName: 'Security CRR ',
              prefix: 'security-crr',
              timeStamp: '12:47 PM',
              // recentText: 'Good Day!',
              avatarUrl:
                'https://sb.thecityresort.com/storage/settings/September2021/tmeKkn3np2dVp2tTkkgX.png',
            });
          }
          setListData(data);
          console.log(data);
        })
        .catch(error => console.log('error', error));

      console.log('twtest', uid);
      const url2 =
        'https://sb.thecityresort.com/api/user-role-additional?uid=' +
        JSON.parse(userId);
      fetch(url2, requestOptions)
        .then(response => response.text())
        .then(result => {
          result = JSON.parse(result);
          console.log('Tset', result.length);
          let nameGroup = 'Group 1';
          for (var i = 0; i < result.length; i++) {
            if (result[i].role_id == 16) {
              nameGroup = 'Group 2';
            } else if (result[i].role_id == 17) {
              nameGroup = 'Group 3';
            }
            data.push({
              id: 'bd7acbeb-c1b1-46c2-aed5-' + result[i].role_id,
              fullName: nameGroup,
              prefix: 'security-crr' + result[i].role_id,
              timeStamp: '12:47 PM',
              // recentText: 'Good Day!',
              avatarUrl:
                'https://sb.thecityresort.com/storage/settings/September2021/tmeKkn3np2dVp2tTkkgX.png',
            });
          }
          // setListData(data);
          // console.log(data);
        })
        .catch(error => console.log('error', error));
    };
    getUserData();
  }, []);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    const prevIndex = listData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData);
  };

  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey);
  };

  const renderItem = ({item, index}) => (
    <Box>
      <Pressable
        onPress={() => navigation.navigate('ChatScreen', {prefix: item.prefix})}
        bg="white">
        <Box pl="4" pr="5" py="2">
          <HStack alignItems="center" space={3}>
            <Avatar size="48px" source={{uri: item.avatarUrl}} />
            <VStack>
              <Text color="coolGray.800" _dark={{color: 'warmGray.50'}} bold>
                {item.fullName}
              </Text>
              <Text color="coolGray.600" _dark={{color: 'warmGray.200'}}>
                {item.recentText}
              </Text>
            </VStack>
            <Spacer />
            <Text
              fontSize="xs"
              color="coolGray.800"
              _dark={{color: 'warmGray.50'}}
              alignSelf="flex-start">
              {item.timeStamp}
            </Text>
          </HStack>
        </Box>
      </Pressable>
    </Box>
  );

  const renderHiddenItem = (data, rowMap) => (
    <HStack flex="1" pl="2">
      <Pressable
        w="70"
        ml="auto"
        cursor="pointer"
        bg="coolGray.200"
        justifyContent="center"
        onPress={() => closeRow(rowMap, data.item.key)}
        _pressed={{
          opacity: 0.5,
        }}>
        <VStack alignItems="center" space={2}>
          <Icon
            as={<Entypo name="dots-three-horizontal" />}
            size="xs"
            color="coolGray.800"
          />
          <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
            More
          </Text>
        </VStack>
      </Pressable>
      <Pressable
        w="70"
        cursor="pointer"
        bg="red.500"
        justifyContent="center"
        onPress={() => deleteRow(rowMap, data.item.key)}
        _pressed={{
          opacity: 0.5,
        }}>
        <VStack alignItems="center" space={2}>
          <Icon as={<MaterialIcons name="delete" />} color="white" size="xs" />
          <Text color="white" fontSize="xs" fontWeight="medium">
            Delete
          </Text>
        </VStack>
      </Pressable>
    </HStack>
  );

  return (
    <Box bg="white" safeArea flex="1">
      <SwipeListView
        data={listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-130}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
      />
    </Box>
  );
}
