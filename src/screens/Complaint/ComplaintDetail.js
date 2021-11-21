import {
  Heading,
  TextArea,
  Divider,
  Box,
  Stack,
  Center,
  VStack,
  HStack,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from 'native-base';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const ComplaintDetail = ({route, navigation}) => {
  const [realisasi, setRealisasi] = useState('');
  const [penyelesaian, setPenyelesaian] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [singleFile, setSingleFile] = useState(null);

  useEffect(() => {
    if (route.params.realisasi != '') {
      setRealisasi(route.params.realisasi);
      setDisabled(true);
    }
    return () => {};
  }, []);

  const chooseFile = (...props) => {
    console.log(props[0].user);
    console.log(props[0].prefix);
    // return;
    let options = {
      maxWidth: 500,
      maxHeight: 500,
      mediaType: 'photo',
      // title: 'Select Image',
      // customButtons: [
      //     {
      //         name: 'customOptionKey',
      //         title: 'Choose Photo from Custom Option'
      //     },
      // ],
      // storageOptions: {
      //     skipBackup: true,
      //     path: 'images',
      // },
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        let source = response;
        console.log('source==>', source);
        console.log(source.assets[0].uri);
        var formdata = new FormData();
        formdata.append('file', {
          uri: source.assets[0].uri,
          name: source.assets[0].fileName,
          type: source.assets[0].type,
        });
        // console.log(formdata);
        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow',
        };

        fetch('https://sb.thecityresort.com/api/upload', requestOptions)
          .then(response => response.text())
          .then(result => {
            let results = JSON.parse(result);
            console.log(results.file);
            console.log(source.assets[0].uri);
            // console.log(newMessages);
            setSingleFile(source.assets[0].uri);
          })
          .catch(error => {
            console.log('error', error);
          });

        // You can also display the image using data:
        // let source = {
        //   uri: 'data:image/jpeg;base64,' + response.data
        // };
        // setState({
        //   ...state,
        //   imagePath: source,
        //   imagePickerVisible: true,
        // });
      }
    });
  };

  const choosePhoto = (...props) => {
    console.log(props[0].user);
    console.log(props[0].prefix);
    // return;
    let options = {
      maxWidth: 500,
      maxHeight: 500,
      mediaType: 'photo',
      // title: 'Select Image',
      // customButtons: [
      //     {
      //         name: 'customOptionKey',
      //         title: 'Choose Photo from Custom Option'
      //     },
      // ],
      // storageOptions: {
      //     skipBackup: true,
      //     path: 'images',
      // },
    };
    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        let source = response;
        console.log('source==>', source);
        console.log(source.assets[0].uri);
        var formdata = new FormData();
        formdata.append('file', {
          uri: source.assets[0].uri,
          name: source.assets[0].fileName,
          type: source.assets[0].type,
        });
        // console.log(formdata);
        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow',
        };

        fetch('https://sb.thecityresort.com/api/upload', requestOptions)
          .then(response => response.text())
          .then(result => {
            let results = JSON.parse(result);
            console.log(results.file);
            // console.log(newMessages);
            setSingleFile(source.assets[0].uri);
          })
          .catch(error => {
            console.log('error', error);
          });

        // You can also display the image using data:
        // let source = {
        //   uri: 'data:image/jpeg;base64,' + response.data
        // };
        // setState({
        //   ...state,
        //   imagePath: source,
        //   imagePickerVisible: true,
        // });
      }
    });
  };

  const onSubmit = () => {
    let dataTest = {
      id: route.params.id,
      realisasi: realisasi,
      penyelesaian: penyelesaian,
    };
    console.log(dataTest);
    var formdata = new FormData();
    formdata.append('id', route.params.id);
    formdata.append('realisasi', realisasi);
    formdata.append('penyelesaian', penyelesaian);

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    fetch('https://sb.thecityresort.com/api/update-tickets', requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        navigation.navigate('MainApp');
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
          <Box>
            <Heading size="lg" style={{}}>
              {route.params.title}
            </Heading>
            <Divider my="2" />
          </Box>
          <Text style={{padding: 5, fontWeight: 'bold'}}>Keterangan</Text>
          <Text>{route.params.description}</Text>
          <Divider my="2" />
          <Text style={{padding: 5, fontWeight: 'bold'}}>Realisasi</Text>
          <TextArea
            placeholder="Input Realisasi"
            value={realisasi}
            onChangeText={value => {
              setRealisasi(value);
            }}
            editable={route.params.realisasi != null ? false : true}
          />

          <Divider my="2" />
          {console.log(singleFile)}
          <Image
            source={{uri: singleFile}}
            style={{width: 200, height: 200}}
            alt="Not Available"
          />
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={chooseFile}>
            <Text style={styles.buttonTextStyle}>Pilih gambar atau ambil Photo</Text>
          </TouchableOpacity>
          <Divider my="2" />
          <Text style={{padding: 5, fontWeight: 'bold'}}>Penyelesaian</Text>
          <TextArea
            placeholder="Input Penyelesaian"
            value={penyelesaian}
            onChangeText={value => {
              setPenyelesaian(value);
            }}
            editable={route.params.realisasi != null ? true : false}
            // disabled={disabled}
          />
          <Image
            source={{uri: singleFile}}
            style={{width: 200, height: 200}}
            alt="Not Available"
          />
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={chooseFile}>
            <Text style={styles.buttonTextStyle}>Pilih gambar atau ambil Photo</Text>
          </TouchableOpacity>
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

export default ComplaintDetail;

const styles = StyleSheet.create({
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  textStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
    textAlign: 'center',
  },
});
