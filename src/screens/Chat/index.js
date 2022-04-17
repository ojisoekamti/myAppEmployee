import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  TouchableOpacity,
  View,
  StatusBar,
  Animated,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';

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
  Center,
} from 'native-base';
import {SwipeListView} from 'react-native-swipe-list-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {getAsyncData} from '../../asyncStorage';
import {TabView, SceneMap} from 'react-native-tab-view';
import ActionButton from 'react-native-action-button';
import {useNavigation} from '@react-navigation/native';

import {NavigationContainer, useIsFocused} from '@react-navigation/native';

const FirstRoute = () => {
  const isFocused = useIsFocused();
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState('');

  let data = [];
  const navigation = useNavigation();

  React.useEffect(() => {
    setIsLoading(true);
    if (listData.length > 0) {
      return;
    }
    const getUserData = async () => {
      const uid = await getAsyncData('uuid');
      const uname = await getAsyncData('uname');
      const urole = await getAsyncData('urole');
      setUserId(uid);
      setUserName(uname);
      setUserRole(urole);

      if (data.length > 0) {
        return;
      }
      var url =
        'https://thecityresort.com/api/user-role?uid=' + uid + '&role=' + urole;
      console.log(url);
      var formdata = new FormData();

      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(result);
          result = JSON.parse(result);
          console.log(result);

          setListData(data);
          console.log(data);
        })
        .catch(error => console.log('error', error));

      const url2 =
        'https://thecityresort.com/api/user-role-additional?uid=' + uid;
      fetch(url2, requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log('Tset', result);
          result = JSON.parse(result);
          console.log('Tset', result.length);
          let nameGroup = 'Group 1';
          for (var i = 0; i < result.length; i++) {
            let uri = result[i].photo;
            let encodedUri = encodeURIComponent(uri);
            let decodedUri = decodeURIComponent(encodedUri);
            data.push({
              id: 'bd7acbeb-c1b1-46c2-aed5-' + result[i].id,
              fullName: result[i].name,
              prefix: 'group-chat-' + result[i].id,
              timeStamp: '12:47 PM',
              // recentText: 'Good Day!',
              avatarUrl:
                'https://thecityresort.com/storage/' + decodedUri,
            });
          }
          // setListData(data);
          // console.log(data);
        })
        .catch(error => console.log('error', error));

      console.log('twtest', uid);
    };
    getUserData();

    setIsLoading(false);
  }, [isFocused]);

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
        onPress={() =>
          navigation.navigate('ChatScreen', {
            prefix: item.prefix,
            title: item.fullName,
          })
        }
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
        // renderHiddenItem={renderHiddenItem}
        rightOpenValue={-130}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
      />
    </Box>
  );
};

const SecondRoute = () => {
  const isFocused = useIsFocused();
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState('');
  let data = [];
  const navigation = useNavigation();
  React.useEffect(() => {
    setIsLoading(true);
    if (listData.length > 0) {
      return;
    }
    const getUserData = async () => {
      const uid = await getAsyncData('uuid');
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };
      if (data.length > 0) {
        return;
      }
      setUserId(uid);
      const url3 = 'https://thecityresort.com/api/chat-list?uid=' + uid;
      fetch(url3, requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log('Tset', result);
          result = JSON.parse(result);
          for (var i in result) {
            console.log('result', result[i]);

            data.push({
              id: result[i].chat_id,
              fullName: result[i].name,
              prefix: result[i].chat_id,
              timeStamp: '12:47 PM',
              mobile_token: result[i].mobile_token,
              // recentText: 'Good Day!',
              avatarUrl:
                'https://thecityresort.com/storage/' + result[i].avatar,
            });
          }
          setListData(data);
          // console.log(data);
        })
        .catch(error => console.log('error', error));
    };
    getUserData();

    setIsLoading(false);
  }, [isFocused]);

  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey);
  };

  const renderItem = ({item, index}) => (
    <Box>
      <Pressable
        onPress={() =>
          navigation.navigate('ChatScreen', {
            prefix: item.prefix,
            title: item.fullName,
            mobile_token: item.mobile_token,
            fullName: item.fullName,
            uid: userId,
            private: true,
          })
        }
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

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <SwipeListView
        data={listData}
        renderItem={renderItem}
        // renderHiddenItem={renderHiddenItem}
        rightOpenValue={-130}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
      />
      <ActionButton
        buttonColor="#fcd34d"
        onPress={() => {
          navigation.navigate('ContactListScreen');
        }}
      />
    </View>
  );
};

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

export default function Chat({navigation}) {
  const [mode, setMode] = useState('Basic');
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'second', title: 'Private Chat', navigation: navigation},
    {key: 'first', title: 'Group Chat ', navigation: navigation},
  ]);

  return (
    <NativeBaseProvider>
      <Box bg="white" flex="1" safeAreaTop>
        <TabView
          indicatorStyle={{backgroundColor: '#d97706'}}
          style={{backgroundColor: '#d97706'}}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          navigation={navigation}
        />
      </Box>
    </NativeBaseProvider>
  );
}
