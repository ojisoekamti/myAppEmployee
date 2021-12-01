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
  Bold,
} from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {getAsyncData} from '../../asyncStorage';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';

// import Picker from 'react-native-simple-modal-picker';

const ShiftFrom = ({navigation, route}) => {
  const [isDatePickerVisibleTo, setDatePickerVisibilityTo] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateTo, setDateTo] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [delegate, setDelegate] = useState('');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  let [language, setLanguage] = React.useState('');
  const [items, setItems] = useState([]);
  const [shift, setShift] = useState('');
  const [minDatePicker, setMinDatePicker] = useState('');
  const [idForm, setIdForm] = useState('');
  const [idPemohon, setIdPemohon] = useState(false);
  const [shiftData, setShiftData] = useState([]);
  const [editableForm, setEditableForm] = useState(false);
  const [editableDate, setEditableDate] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    getUserData();
    console.log(route.params);
    if (route.params.idForm != '') {
      setIdForm(route.params.idForm);
      setIdPemohon(route.params.idPemohon);
    }
    setIsLoading(true);
  }, []);

  let Loading = ({loading}) =>
    loading ? (
      <View>
        <Spinner
          visible={loading}
          overlayColor="rgba(0, 0, 0, 0.5)"
          textStyle={{color: '#000'}}
          color="green"
          animation="fade"
          size="large"
        />
      </View>
    ) : null;

  const getUserData = async () => {
    setIsLoading(true);
    const uid = await getAsyncData('uuid');
    const urole = await getAsyncData('urole');
    const uname = await getAsyncData('uname');
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
      setUserName(uname);
      setMinDatePicker(new Date(moment(new Date()).add(2, 'days')));
      editableSet(userId, userName, shiftData);
      setTukarShiftData(uid);
    }

    setIsLoading(false);
  };

  const setTukarShiftData = uidSet => {
    setIsLoading(true);
    var url = 'https://sb.thecityresort.com/api/user-shift?uid=' + uidSet;
    // var formdata = new FormData();
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(url, requestOptions)
      .then(response => response.text())
      .then(result => {
        result = JSON.parse(result);
        console.log(result);
        if (result.id > 0) {
          setShiftData(result);
        } else {
        }
      })
      .catch(error => {});
    setIsLoading(false);
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
    setDate(moment(date).format('YYYY-M-D'));
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

  const handleConfirmTo = date => {
    // console.warn('A date has been picked: ', date);
    setDateTo(moment(date).format('YYYY-M-D'));
    Keyboard.dismiss();
    hideDatePickerTo();
  };

  const editableSet = (userId, userName, shiftData) => {
    setIsLoading(true);
    var userName = userName.replace(/[^\w\s]/gi, '');
    if (shiftData.pemohon == userName) {
      setEditableForm(false);
    } else {
      setEditableForm(true);
    }
    console.log(shiftData.date);
    if (shiftData.date) {
      setEditableDate(false);
    }
    setIsLoading(false);
  };

  const onSubmit = () => {
    let shiftId = shiftData.id;
    if (typeof shiftData.id == 'undefined') {
      shiftId = '';
    }
    const data = {
      date: date,
      description: description,
      delegate: delegate,
      userId: userId,
      shift: shift,
      dateTo: dateTo,
      shiftDataId: shiftId,
      idPemohon: idPemohon,
    };
    console.log(data);
    if (shiftId == null) {
      if (date == '') {
        Alert.alert('Pilih Tanggal');
        return;
      } else if (description == '') {
        Alert.alert('Isi Description');
        return;
      } else if (delegate == '' && idForm == '') {
        Alert.alert('Pilih Delegation');
        return;
      } else if (shift == '') {
        Alert.alert('Pilih Shift');
        return;
      }
    }
    var formdata = new FormData();
    formdata.append('date', date);
    formdata.append('description', description);
    formdata.append('delegate', delegate);
    formdata.append('user_id', userId);
    formdata.append('shift', shift);
    formdata.append('dateTo', dateTo);
    formdata.append('id', shiftId);
    formdata.append('id_pemohon', idPemohon);

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
          {shiftData.pemohon ? (
            <Heading>Pemohon - {shiftData.pemohon}</Heading>
          ) : (
            <></>
          )}
          <Text style={{padding: 5, fontWeight: 'bold'}}>Date</Text>
          {console.log(editableDate)}
          {shiftData.date ? (
            <>
              <Text style={{padding: 5}}>{shiftData.date}</Text>
            </>
          ) : (
            <Input
              onPressIn={() => showDatePicker('date')}
              value={shiftData.date ? shiftData.date : date}
            />
          )}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode={'date'}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            minimumDate={minDatePicker == '' ? new Date() : minDatePicker}
          />
          <Divider my="2" />
          <Text style={{padding: 5, fontWeight: 'bold'}}>Date Switch To</Text>
          <Input
            onPressIn={() => showDatePickerTo('date')}
            value={shiftData.date_to ? shiftData.date_to : dateTo}
            editable={editableForm ? (shiftData.date_to ? false : true) : false}
          />
          <DateTimePickerModal
            isVisible={isDatePickerVisibleTo}
            mode={'date'}
            onConfirm={handleConfirmTo}
            onCancel={hideDatePickerTo}
            minimumDate={minDatePicker == '' ? new Date() : minDatePicker}
          />
          <Divider my="2" />
          {shiftData.shift_sched ? (
            <>
              <Text style={{padding: 5, fontWeight: 'bold'}}>Shift</Text>
              <Text style={{padding: 5}}>
                {shiftData.shift_sched == 1
                  ? ' Pagi'
                  : shiftData.shift_sched == 2
                  ? ' Siang'
                  : ' Malam'}
              </Text>
            </>
          ) : (
            <Select
              selectedValue={shift}
              placeholder="Select Shift "
              // width={150}
              onValueChange={itemValue => setShift(itemValue)}
              isDisabled={editableForm ? '' : 'disabled'}>
              <Select.Item label="Pagi" value="1" />
              <Select.Item label="Siang" value="2" />
              <Select.Item label="Malam" value="3" />
            </Select>
          )}
          <Divider my="2" />
          <Text style={{padding: 5, fontWeight: 'bold'}}>Description</Text>
          {shiftData.description ? (
            <Text style={{padding: 5}}>{shiftData.description}</Text>
          ) : (
            <TextArea
              onChangeText={value => {
                setDescription(value);
              }}
              value={shiftData.description}
              editable={editableForm}
            />
          )}
          <Divider my="2" />
          {shiftData.delegate ? (
            <>
              <Text style={{padding: 5, fontWeight: 'bold'}}>Delegate To</Text>
              <Text style={{padding: 5}}>{shiftData.delegate}</Text>
            </>
          ) : (
            <>
              <Text style={{padding: 5, fontWeight: 'bold'}}>Delegate To</Text>

              <Select
                placeholder="Select Delegate"
                selectedValue={delegate}
                // width={150}
                onValueChange={itemValue => setDelegate(itemValue)}
                isDisabled={editableForm ? '' : 'disabled'}>
                {items.map((item, index) => {
                  return (
                    <Select.Item
                      key={index}
                      label={item.lev1}
                      value={item.lev1}
                    />
                  );
                })}
              </Select>
            </>
          )}

          <Divider my="2" />
          {shiftData.status ? (
            <>
              <Text style={{padding: 5, fontWeight: 'bold'}}> Status</Text>
              <Text style={{padding: 5}}>
                {shiftData.status == 3
                  ? 'Approve & On Progress'
                  : 'Waiting For Approval'}
              </Text>
            </>
          ) : (
            <></>
          )}
          <Divider my="2" />
          {shiftData.next_approver ? (
            <>
              <Text style={{padding: 5, fontWeight: 'bold'}}>
                Next Approval
              </Text>
              <Text style={{padding: 5}}>{shiftData.next_approver}</Text>
            </>
          ) : (
            <></>
          )}
        </ScrollView>
      </Stack>
      {shiftData.date_to ? (
        <></>
      ) : (
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
      )}

      <Loading loading={isLoading} />
    </>
  );
};

export default ShiftFrom;

const styles = StyleSheet.create({});
