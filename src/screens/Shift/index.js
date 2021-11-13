import React, {useState, useEffect, onChange} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {
  Center,
  Box,
  Heading,
  Text,
  Input,
  Divider,
  Stack,
  TextArea,
} from 'native-base';
import {getAsyncData} from '../../asyncStorage';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export function ShiftDetail({date, from, to, delegate, action}) {
  return (
    <View style={{backgroundColor: '#fff', flex: 1, paddingHorizontal: 20}}>
      <Heading>Tukar Shift</Heading>
      <Heading size="sm">{date}</Heading>
      <Heading size="xs">
        Dari Jam {from} sampai {to}
      </Heading>
      <Text fontSize="xs">
        Pengganti : <Text bold>{delegate}</Text>
      </Text>
      <Text>
        Status :{' '}
        <Text
          highlight
          _dark={{
            color: 'coolgray.800',
          }}>
          {action ? action : 'Waiting For Approval'}
        </Text>
      </Text>
    </View>
  );
}

const TukarShift = ({navigation}) => {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [disabled, setDisabled] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [delegate, setDelegate] = useState('');
  const [action, setAction] = useState('');

  const [mode, setMode] = useState('date');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isPickerTimeShow, setIsPickerTimeShow] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState(new Date(Date.now()));

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setDate(date);
    hideDatePicker();
  };

  useEffect(() => {
    const getUserData = async () => {
      const uid = await getAsyncData('uuid');
      const uname = await getAsyncData('uname');
      setUserId(uid);
      setUserName(uname);
      // console.log(uid);
      var url = 'https://sb.thecityresort.com/api/user-shift?uid=' + uid;
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
          if (result.id > 0) {
            setDate(result.date);
            setFrom(result.from);
            setTo(result.to);
            setDelegate(result.delegate);
            setAction(result.action);
            setDisabled(true);
          } else {
            // setDate(new Date());
            setFrom('');
            setTo('');
            setDelegate('');
            setAction('Buat Tukar Shift Terlebih Dahulu');
            setDisabled(false);
          }
        })
        .catch(error => {
          // setDate(new Date());
          setFrom('');
          setTo('');
          setDelegate('');
          setAction('Buat Tukar Shift Terlebih Dahulu');
          setDisabled(false);
        });
    };
    getUserData();
  }, []);

  return (
    <>
      <ShiftDetail
        date={date}
        from={from}
        to={to}
        delegate={delegate}
        action={action}
      />
      <View style={{backgroundColor: '#fff', flex: 1, alignItems: 'center'}}>
        <View style={styles.bottom}>
          <TouchableOpacity
            disabled={disabled}
            onPress={() => navigation.navigate('ShiftFrom')}>
            <Center
              height={10}
              width={300}
              bg={disabled ? 'warning.500' : 'success.500'}
              rounded="sm"
              _text={{
                color: 'warmGray.50',
                fontWeight: 'bold',
                fontSize: 20,
              }}
              shadow={'3'}>
              {disabled ? 'Tukar Shift di Proses' : 'Proses Tukar Shift'}
            </Center>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default TukarShift;

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
