import React, {useState, useEffect, onChange} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Center,
  Box,
  Heading,
  Text,
  Input,
  Divider,
  Stack,
  TextArea,
  ScrollView,
} from 'native-base';
import {getAsyncData} from '../../asyncStorage';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export function ShiftSchedDetail({shiftId}) {
  if (shiftId == 1) {
    return 'Pagi';
  } else if (shiftId == 2) {
    return 'Siang';
  } else {
    return 'Malam';
  }
  return null;
}

export function ApprovalDetail({approval, dataApproval, navigation, route}) {
  return (
    <>
      {approval ? (
        <View style={{alignItems: 'center', backgroundColor: '#fff'}}>
          <Heading size="sm">
            {route.params.lists
              ? 'Tukar Shift List'
              : 'Tukar Shift List Approval'}
          </Heading>
        </View>
      ) : (
        <></>
      )}
      {approval ? (
        dataApproval.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={(styles.card, {backgroundColor: '#fff'})}
              onPress={() => {
                navigation.navigate('ApprovalForm', {item: item});
              }}
              disabled={route.params.lists ? true : false}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Approval</Text>
                <Text style={styles.cardDetails}>
                  {/* {data} */}
                  Permohonan Approval {'\n'}Pemohon : {item.pemohon}
                  {'\n'}Pengganti : {item.delegate}
                  {'\n'}
                  Tanggal : {item.date}
                  {'\n'}
                  keterangan : {item.description}
                  {'\n'}
                  Shift : <ShiftSchedDetail shiftId={item.shift_sched} />
                  {'\n'}
                  Next Approver : {item.next_approver}
                  {'\n'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <></>
      )}
    </>
  );
}

const TukarShift = ({navigation, route}) => {
  const [disabled, setDisabled] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [delegate, setDelegate] = useState('');
  const [action, setAction] = useState('');
  const [description, setDescription] = useState('');
  const [nextApprover, setNextApprover] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [approval, setApproval] = useState(false);
  const [idForm, setIdForm] = useState('');
  const [idPemohon, setIdPemohon] = useState('');
  const [pemohon, setPemohon] = useState('');
  const [idShift, setIdShift] = useState('');
  const [uidSet, setUid] = useState('');
  const [dataApproval, setDataApproval] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      setIsLoading(true);
      const uid = await getAsyncData('uuid');
      setUid(uid);
      setApprovalData(uid, route);
      //setTukarShiftData(uid);
      setIsLoading(false);
    };

    getUserData();
  }, [setIsLoading]);

  const setTukarShiftData = uidSet => {
    var url = 'https://thecityresort.com/api/user-shift?uid=' + uidSet;
    // var formdata = new FormData();
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(url, requestOptions)
      .then(response => response.text())
      .then(result => {
        result = JSON.parse(result);
        setIsLoading(true);
        if (result.id > 0) {
          setIdForm(result.id);
          setIdPemohon(result.pemohon);
          setDate(result.date);
          setFrom(result.from);
          setTo(result.date_to);
          setDelegate(result.delegate);
          setAction(result.action);
          setDescription(result.description);
          setDisabled(true);
          setNextApprover(result.next_approver);
        } else {
          setIdForm('');
          setIdPemohon('');
          setFrom('');
          setTo('');
          setDelegate('');
          setDescription('');
          setAction('Buat Tukar Shift Terlebih Dahulu');
          setDisabled(false);
          setNextApprover('');
        }
        setIsLoading(false);
      })
      .catch(error => {
        setIdForm('');
        setIdPemohon('');
        setFrom('');
        setTo('');
        setDelegate('');
        setDescription('');
        setAction('Buat Tukar Shift Terlebih Dahulu');
        setDisabled(false);
        setNextApprover('');
      });
  };

  const setApprovalData = (uidSet, route) => {
    var uri =
      'https://thecityresort.com/api/approve-shift-info?uid=' + uidSet;

    if (route.params.lists) {
      uri = 'https://thecityresort.com/api/list-shift-info?uid=' + uidSet;
    }
    var request = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(uri, request)
      .then(response => response.text())
      .then(results => {
        let result = [];
        results = JSON.parse(results);
        console.log(result);
        if (results.length > 0) {
          setDataApproval(results);
          setApproval(true);
          setDisabled(true);
        } else {
          setApproval(false);
        }
      })
      .catch(error => {
        setApproval(false);
      });
  };

  return (
    <>
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}>
          <ActivityIndicator color={'#000'} size="large" />
        </View>
      ) : (
        <>
          <ScrollView>
            <ApprovalDetail
              approval={approval}
              idShift={idShift}
              dataApproval={dataApproval}
              navigation={navigation}
              route={route}
            />
          </ScrollView>
        </>
      )}
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
  card: {
    // height: 100,
    marginVertical: 5,
    flexDirection: 'row',
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardImgWrapper: {
    flex: 1,
  },
  cardImg: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  cardInfo: {
    flex: 2,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  cardDetails: {
    fontSize: 12,
    color: '#444',
  },
});
