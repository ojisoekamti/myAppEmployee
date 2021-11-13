import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, Keyboard, Alert} from 'react-native';
import {
  Text,
  View,
  Stack,
  Box,
  Heading,
  Divider,
  TextArea,
  VStack,
  Center,
  Input,
  ScrollView,
  keyboardDismissHandlerManager,
} from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {getAsyncData} from '../../asyncStorage';
import moment from 'moment';

const ShiftFrom = ({navigation}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isDatePickerVisibleTo, setDatePickerVisibilityTo] = useState(false);
  const [dateTo, setDateTo] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [description, setDescription] = useState('');
  const [delegate, setDelegate] = useState('');
  const [userId, setUserId] = useState('');
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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    Keyboard.dismiss();
  };

  const handleConfirm = date => {
    console.warn('A date has been picked: ', date);
    setDate(moment(date).format('D-M-YYYY'));
    setTime(moment(date).format('hh:mm:ss'));
    Keyboard.dismiss();
    hideDatePicker();
  };

  const showDatePickerTo = () => {
    setDatePickerVisibilityTo(true);
  };

  const hideDatePickerTo = () => {
    setDatePickerVisibilityTo(false);
    Keyboard.dismiss();
  };

  const handleConfirmTo = datetime => {
    console.warn('A date has been picked: ', datetime);
    setDateTo(moment(datetime).format('D-M-YYYY'));
    setTimeTo(moment(datetime).format('hh:mm:ss'));
    Keyboard.dismiss();
    hideDatePickerTo();
  };
  const onSubmit = () => {
    const data = {
      date: date,
      time: time,
      dateTo: dateTo,
      timeTo: timeTo,
      description: description,
      delegate: delegate,
      userId: userId,
    };

    var formdata = new FormData();
    formdata.append('date', date);
    formdata.append('time', time);
    formdata.append('dateTo', dateTo);
    formdata.append('timeTo', timeTo);
    formdata.append('description', description);
    formdata.append('delegate', delegate);
    formdata.append('user_id', userId);

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    fetch('https://sb.thecityresort.com/api/tukar-shift', requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        navigation.navigate('MainApp');
      })
      .catch(error => {
        Alert.alert('Data Tidak sesuai');
        console.log('error', error);
      });

    console.log(data);
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
          <Text style={{padding: 5, fontWeight: 'bold'}}>from</Text>
          <Input onPressIn={() => showDatePicker('date')} value={date} />
          <Divider my="2" />
          <Input onPressIn={() => showDatePicker('time')} value={time} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode={'datetime'}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <Divider my="2" />
          <Text style={{padding: 5, fontWeight: 'bold'}}>To</Text>
          <Input onPressIn={() => showDatePickerTo()} value={dateTo} />
          <Divider my="2" />
          <Input onPressIn={() => showDatePickerTo()} value={timeTo} />
          <DateTimePickerModal
            isVisible={isDatePickerVisibleTo}
            mode={'datetime'}
            onConfirm={handleConfirmTo}
            onCancel={hideDatePickerTo}
          />
          <Divider my="2" />

          <Text style={{padding: 5, fontWeight: 'bold'}}>Description</Text>
          <TextArea
            onChangeText={value => {
              setDescription(value);
            }}
          />

          <Divider my="2" />
          <Text style={{padding: 5, fontWeight: 'bold'}}>Delegate To</Text>
          <Input
            onChangeText={value => {
              setDelegate(value);
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

export default ShiftFrom;

const styles = StyleSheet.create({});
