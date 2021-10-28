import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Center, Box, Heading, Text} from 'native-base';
import {getAsyncData} from '../../asyncStorage';
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
          {action}
        </Text>
      </Text>
    </View>
  );
}
const TukarShift = () => {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [date, setDate] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [delegate, setDelegate] = useState('');
  const [action, setAction] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      const uid = await getAsyncData('uuid');
      const uname = await getAsyncData('uname');
      setUserId(uid);
      setUserName(uname);
      // console.log(uid);
      var url = 'https://sb.thecityresort.com/api/user-shift?uid=' + uid;
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
          if (result.id > 0) {
            setDisabled(true);
            setDate(result.date);
            setFrom(result.from);
            setTo(result.to);
            setDelegate(result.delegate);
            setAction(result.action);
          } else {
            setDisabled(false);
            setDate('');
            setFrom('');
            setTo('');
            setDelegate('');
            setAction('');
          }
          console.log(result.id);
        })
        .catch(error => {
          setDisabled(false);
          setDate('');
          setFrom('');
          setTo('');
          setDelegate('');
          setAction('');
          console.log('error', error);
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
          <TouchableOpacity disabled={disabled}>
            <Center
              height={10}
              width={300}
              bg={disabled ? 'warning.500' : 'succeess.500'}
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
