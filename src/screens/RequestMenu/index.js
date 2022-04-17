import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Stack, Center, View} from 'native-base';
import {getAsyncData} from '../../asyncStorage';

const RequestMenu = ({navigation}) => {
  let data = [];
  const [ga, setGa] = React.useState(false);
  const [lf, setLf] = React.useState(false);
  const [td, setTd] = React.useState(false);
  const [sp, setSp] = React.useState(false);
  const [lmf, setLmf] = React.useState(false);
  //good_applications
  //leave_forms
  //time_deviations
  //switch_permissions
  //lembur_forms
  React.useEffect(() => {
    const getUserMenus = async () => {
      const uid = await getAsyncData('uuid');
      var url = 'https://thecityresort.com/api/get-menus?uid=' + uid;
      var formdata = new FormData();

      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
          result = JSON.parse(result);
          console.log(result.length);
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              const element = result[i];
              console.log(element.table_name);

              if (element.table_name === 'good_applications') {
                setGa(true);
              } else if (element.table_name === 'leave_forms') {
                setLf(true);
              } else if (element.table_name === 'time_deviations') {
                setTd(true);
              } else if (element.table_name === 'switch_permissions') {
                setSp(true);
              } else if (element.table_name === 'lembur_forms') {
                setLmf(true);
              }
            }
          }
        })
        .catch(error => console.log('error', error));
    };
    getUserMenus();
  });
  return (
    <View>
      <Stack direction="row" m="3" justifyContent="space-between">
        <TouchableOpacity>
          <Center
            size="120"
            bg="primary.500"
            rounded="sm"
            _text={{
              color: 'warmGray.50',
              fontWeight: 'bold',
              fontSize: 'md',
            }}
            shadow={'3'}>
            Form Cuti
          </Center>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('ShiftFrom', {new: true})}>
          <Center
            size="120"
            bg="success.500"
            rounded="sm"
            _text={{
              color: 'warmGray.50',
              fontWeight: 'bold',
              fontSize: 'md',
            }}
            shadow={'3'}>
            Tukar Shift
          </Center>
        </TouchableOpacity>
        <TouchableOpacity>
          <Center
            size="120"
            bg="secondary.500"
            rounded="sm"
            _text={{
              color: 'warmGray.50',
              fontWeight: 'bold',
              fontSize: 'sm',
              textAlign: 'center',
            }}
            shadow={'3'}>
            Penyimpangan Waktu Kerja
          </Center>
        </TouchableOpacity>
      </Stack>
      <Stack direction="row" m="3" justifyContent="space-between">
        <TouchableOpacity>
          <Center
            size="120"
            bg="error.500"
            rounded="sm"
            _text={{
              color: 'warmGray.50',
              fontWeight: 'bold',
              fontSize: 'sm',
              textAlign: 'center',
            }}
            shadow={'3'}>
            Form Lembur
          </Center>
        </TouchableOpacity>
        <TouchableOpacity>
          <Center
            size="120"
            bg="info.500"
            rounded="sm"
            _text={{
              color: 'warmGray.50',
              fontWeight: 'bold',
              fontSize: 'sm',
              textAlign: 'center',
            }}
            shadow={'3'}>
            Form Keluar Masuk Barang
          </Center>
        </TouchableOpacity>
        <TouchableOpacity>
          <Center
            size="120"
            bg="warning.500"
            rounded="sm"
            _text={{
              color: 'warmGray.50',
              fontWeight: 'bold',
              fontSize: 'sm',
              textAlign: 'center',
            }}
            shadow={'3'}>
            Purchase Request
          </Center>
        </TouchableOpacity>
      </Stack>
    </View>
  );
};

export default RequestMenu;

const styles = StyleSheet.create({});
