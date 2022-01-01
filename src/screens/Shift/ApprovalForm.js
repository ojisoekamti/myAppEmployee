import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Text,
  View,
  Stack,
  TextArea,
  Center,
  ScrollView,
  Input,
} from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {getAsyncData} from '../../asyncStorage';
import moment from 'moment';
// import Picker from 'react-native-simple-modal-picker';

const ApprovalForm = ({navigation, route}) => {
  const [description, setDescription] = useState('');
  const [itemData, setItemData] = useState('');
  const [isDelegate, setIsDelegate] = useState(false);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState('');
  useEffect(() => {
    getUserData();
    setItemData(route.params.item);
  }, []);

  const getUserData = async () => {
    const uid = await getAsyncData('uuid');
    const uname = await getAsyncData('uname');
    const urole = await getAsyncData('urole');
    setName(uname);
    setUserId(uid);
  };

  const onSubmit = value => {
    console.log(value);
    setIsLoading(true);

    var formdata = new FormData();
    formdata.append('id', itemData.id);
    formdata.append('uid', userId);
    formdata.append('approve', value);
    formdata.append('description', description);

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    fetch(
      'https://sb.thecityresort.com/api/approve-tukar-shift',
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        console.log(result);
        navigation.navigate('MainApp');
        setIsLoading(false);
      })
      .catch(error => {
        Alert.alert('Data Tidak sesuai');
        console.log('error', error);
      });
  };
  return (
    <>
      <Stack
        style={{
          flex: 1,
          backgroundColor: '#fff',
          paddingTop: 10,
          paddingLeft: 10,
          paddingRight: 10,
        }}>
        <ScrollView>
          <Text style={{padding: 5, fontWeight: 'bold'}}>Description</Text>
          <TextArea
            onChangeText={value => {
              setDescription(value);
            }}
          />
        </ScrollView>
      </Stack>

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => onSubmit(true)}>
          <Center
            title="Test"
            style={styles.button}
            backgroundColor={'success.600'}>
            Approve
          </Center>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => onSubmit(false)}>
          <Center
            title="Test"
            style={styles.button}
            backgroundColor={'error.600'}>
            Reject
          </Center>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e4ff0000',
          }}>
          {isLoading ? (
            <ActivityIndicator color={'#fbbf24'} size="large" />
          ) : (
            <View></View>
          )}
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

export default ApprovalForm;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    height: 40,
    color: '#fff',
  },
});
