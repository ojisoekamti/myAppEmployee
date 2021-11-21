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
  Select,
} from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {getAsyncData} from '../../asyncStorage';
import moment from 'moment';
// import Picker from 'react-native-simple-modal-picker';

const ShiftFrom = ({navigation}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [delegate, setDelegate] = useState('');
  const [userId, setUserId] = useState('');
  let [language, setLanguage] = React.useState('');
  const [items, setItems] = useState([]);
  const [shift, setShift] = useState('');
  const [minDatePicker, setMinDatePicker] = useState('');
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const uid = await getAsyncData('uuid');
    const urole = await getAsyncData('urole');
    // console.log(uid);
    if (uid != null) {
      var url =
        'https://sb.thecityresort.com/api/get-user-delegate?uid=' +
        uid +
        '&role=' +
        urole;
      // console.log(url);
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
          setItems(result);
        })
        .catch(error => {
          console.log(error);
        });
      setUserId(uid);
      setMinDatePicker(new Date(moment(new Date()).add(2, 'days')));
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
    // console.warn('A date has been picked: ', date);
    setDate(moment(date).format('D-M-YYYY'));
    Keyboard.dismiss();
    hideDatePicker();
  };

  const onSubmit = () => {
    const data = {
      date: date,
      description: description,
      delegate: delegate,
      userId: userId,
      shift: shift,
    };
    if (date == '') {
      Alert.alert('Pilih Tanggal');
      return;
    } else if (description == '') {
      Alert.alert('Isi Description');
      return;
    } else if (delegate == '') {
      Alert.alert('Pilih Delegation');
      return;
    } else if (shift == '') {
      Alert.alert('Pilih Shift');
      return;
    }
    var formdata = new FormData();
    formdata.append('date', date);
    formdata.append('description', description);
    formdata.append('delegate', delegate);
    formdata.append('user_id', userId);
    formdata.append('shift', shift);

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
          paddingRight: 10,
        }}>
        <ScrollView>
          <Text style={{padding: 5, fontWeight: 'bold'}}>Date</Text>
          <Input onPressIn={() => showDatePicker('date')} value={date} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode={'date'}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            minimumDate={minDatePicker == '' ? new Date() : minDatePicker}
          />
          <Divider my="2" />

          <Select
            placeholder="Select Shift "
            selectedValue={shift}
            // width={150}
            onValueChange={itemValue => setShift(itemValue)}>
            <Select.Item label="Pagi" value="1" />
            <Select.Item label="Siang" value="2" />
            <Select.Item label="Malam" value="3" />
          </Select>
          <Divider my="2" />
          <Text style={{padding: 5, fontWeight: 'bold'}}>Description</Text>
          <TextArea
            onChangeText={value => {
              setDescription(value);
            }}
          />

          <Divider my="2" />
          <Text style={{padding: 5, fontWeight: 'bold'}}>Delegate To</Text>

          <Select
            placeholder="Select Delegate"
            selectedValue={delegate}
            // width={150}
            onValueChange={itemValue => setDelegate(itemValue)}>
            {items.map((item, index) => {
              return (
                <Select.Item key={index} label={item.lev1} value={item.lev1} />
              );
            })}
          </Select>
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
