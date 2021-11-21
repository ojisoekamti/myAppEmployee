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
} from 'native-base';
import {getAsyncData} from '../../asyncStorage';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export function ShiftDetail({
  date,
  from,
  to,
  delegate,
  action,
  description,
  nextApprover,
  approval,
}) {
  return (
    <>
      {date != '' && approval == false ? (
        <View style={{backgroundColor: '#fff', flex: 1, paddingHorizontal: 20}}>
          <Heading>Tukar Shift</Heading>
          <Heading size="sm">Tanggal {date}</Heading>
          <Heading size="xs">{description}</Heading>
          <Text fontSize="xs">
            Pengganti : <Text bold>{delegate}</Text>
          </Text>
          <Text fontSize="xs">
            Next Approval : <Text bold>{nextApprover}</Text>
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
      ) : (
        <></>
      )}
    </>
  );
}

export function ApprovalDetail({
  date,
  from,
  to,
  delegate,
  action,
  description,
  nextApprover,
  approval,
  pemohon,
}) {
  return (
    <>
      {approval ? (
        <View style={{backgroundColor: '#fff', flex: 1, paddingHorizontal: 20}}>
          <Heading>Tukar Shift Approval</Heading>
          <Heading size="sm">Tanggal {date}</Heading>
          <Heading size="xs">{description}</Heading>
          <Text fontSize="xs">
            Pemohon : <Text bold>{pemohon}</Text>
          </Text>
          <Text fontSize="xs">
            Pengganti : <Text bold>{delegate}</Text>
          </Text>
          <Text fontSize="xs">Butuh Approval untuk Tukar shift Berikut </Text>
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
      ) : (
        <></>
      )}
    </>
  );
}

const TukarShift = ({navigation}) => {
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
  const [pemohon, setPemohon] = useState('');
  const [idShift, setIdShift] = useState('');
  const [uidSet, setUid] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      setIsLoading(true);
      const uid = await getAsyncData('uuid');
      setUid(uid);
      setApprovalData(uid);
      setTukarShiftData(uid);
      setIsLoading(false);
    };

    getUserData();
  }, [setIsLoading]);

  const setTukarShiftData = uidSet => {
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
        if (result.id > 0) {
          setDate(result.date);
          setFrom(result.from);
          setTo(result.to);
          setDelegate(result.delegate);
          setAction(result.action);
          setDescription(result.description);
          setDisabled(true);
          setNextApprover(result.next_approver);
        } else {
          setFrom('');
          setTo('');
          setDelegate('');
          setDescription('');
          setAction('Buat Tukar Shift Terlebih Dahulu');
          setDisabled(false);
          setNextApprover('');
        }
      })
      .catch(error => {
        setFrom('');
        setTo('');
        setDelegate('');
        setDescription('');
        setAction('Buat Tukar Shift Terlebih Dahulu');
        setDisabled(false);
        setNextApprover('');
      });
  };

  const setApprovalData = uidSet => {
    var uri =
      'https://sb.thecityresort.com/api/approve-shift-info?uid=' + uidSet;

    var request = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(uri, request)
      .then(response => response.text())
      .then(results => {
        let result = [];
        results = JSON.parse(results);
        if (results.id != null) {
          setApproval(true);
          setIdShift(results.id);
          setDate(results.date);
          setFrom(results.from);
          setTo(results.to);
          setDelegate(results.delegate);
          setAction(results.action);
          setDescription(results.description);
          setPemohon(results.pemohon);
          setNextApprover(results.next_approver);
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
      {console.log(isLoading)}
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
          <ShiftDetail
            date={date}
            from={from}
            to={to}
            delegate={delegate}
            action={action}
            description={description}
            nextApprover={nextApprover}
            approval={approval}
          />
          <ApprovalDetail
            date={date}
            from={from}
            to={to}
            delegate={delegate}
            action={action}
            description={description}
            nextApprover={nextApprover}
            approval={approval}
            pemohon={pemohon}
            idShift={idShift}
          />

          <TouchableOpacity style={styles.card} onPress={() => {}}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Approval</Text>
              <Text style={styles.cardDetails}>
                {/* {data} */}
                Permohonan tukar shift antara pemohon Anggota Danru 1 kepada Anggota 2, pada tanggal 20 November 2021, dengan keterangan
                Test
              </Text>
              <Text>
                Shift : Pagi 
              </Text>

              <Text style={styles.cardDetails}>Tanggal 20 November 2021</Text>
            </View>
          </TouchableOpacity>
          <View
            style={{backgroundColor: '#fff', flex: 1, alignItems: 'center'}}>
            <View style={styles.bottom}>
              <TouchableOpacity
                disabled={approval ? false : disabled}
                onPress={() => {
                  if (approval) {
                    navigation.navigate('ApprovalForm');
                  } else {
                    navigation.navigate('ShiftFrom', {idShift: idShift});
                  }
                }}>
                <Center
                  height={10}
                  width={300}
                  bg={approval ? 'warning.500' : 'success.500'}
                  rounded="sm"
                  _text={{
                    color: 'warmGray.50',
                    fontWeight: 'bold',
                    fontSize: 20,
                  }}
                  shadow={'3'}>
                  {approval
                    ? 'Approve'
                    : disabled
                    ? 'Tukar Shift di Proses'
                    : 'Proses Tukar Shift'}
                </Center>
              </TouchableOpacity>
            </View>
          </View>
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
