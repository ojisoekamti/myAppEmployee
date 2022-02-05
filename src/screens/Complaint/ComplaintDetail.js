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
  Menu,
} from 'native-base';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const ComplaintDetail = ({route, navigation}) => {
  const [realisasi, setRealisasi] = useState('');
  const [penyelesaian, setPenyelesaian] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [singleFile, setSingleFile] = useState(null);
  const [singleFileResult, setSingleFileResult] = useState(null);

  useEffect(() => {
    if (route.params.realisasi != '') {
      setRealisasi(route.params.realisasi);
      setDisabled(true);
    }
    if (route.params.singleFile != '') {
      console.log(route.params.singleFile);
      setSingleFile(route.params.singleFile);
    }
    if (route.params.singleFileResult != '') {
      setSingleFileResult(route.params.singleFileResult);
    }
    return () => {};
  }, []);

  const chooseFile = (...props) => {
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

        fetch('https://thecityresort.com/api/upload', requestOptions)
          .then(response => response.text())
          .then(result => {
            let results = JSON.parse(result);
            console.log(results);
            setSingleFile(results.file);
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

  const chooseFileResult = (...props) => {
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

        fetch('https://thecityresort.com/api/upload', requestOptions)
          .then(response => response.text())
          .then(result => {
            let results = JSON.parse(result);
            console.log(results);
            setSingleFileResult(results.file);
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
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        let source = response;
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

        fetch('https://thecityresort.com/api/upload', requestOptions)
          .then(response => response.text())
          .then(result => {
            let results = JSON.parse(result);
            console.log(results);
            setSingleFile(results.file);
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

  const choosePhotoResult = (...props) => {
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
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        let source = response;
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

        fetch('https://thecityresort.com/api/upload', requestOptions)
          .then(response => response.text())
          .then(result => {
            let results = JSON.parse(result);
            console.log(results);
            setSingleFileResult(results.file);
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

  const RenderImage = (...props) => {
    var image = props[0].singleFile || null;

    if (image == null) {
      var imgSource = route.params.singleFile ? route.params.singleFile : null;
    } else {
      var imgSource = image;
    }

    return (
      <Image
        source={
          imgSource != null && imgSource != 'null'
            ? {
                uri: 'https://thecityresort.com/storage/files/' + imgSource,
              }
            : require('../../assets/images/dummy-image-square.jpg')
        }
        style={{width: 100, height: 100, padding: 20}}
        alt="Not Available"
      />
    );
  };

  const RenderImageResult = (...props) => {
    var image = props[0].singleFileResult || null;
    if (image == null) {
      var imgSource = route.params.singleFileResult
        ? route.params.singleFileResult
        : null;
    } else {
      var imgSource = image;
    }

    console.log('imgSource', imgSource);
    return (
      <Image
        source={
          imgSource != null && imgSource != 'null'
            ? {
                uri: 'https://thecityresort.com/storage/files/' + imgSource,
              }
            : require('../../assets/images/dummy-image-square.jpg')
        }
        style={{width: 100, height: 100, padding: 20}}
        alt="Not Available"
      />
    );
  };

  const onSubmit = () => {
    let dataTest = {
      id: route.params.id,
      realisasi: realisasi,
      penyelesaian: penyelesaian,
    };
    var formdata = new FormData();
    formdata.append('id', route.params.id);
    formdata.append('realisasi', realisasi);
    formdata.append('penyelesaian', penyelesaian);
    formdata.append('realization_image', singleFile);
    formdata.append('result_image', singleFileResult);

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    fetch('https://thecityresort.com/api/update-tickets', requestOptions)
      .then(response => response.text())
      .then(result => {
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
          <View>
            <Heading>{route.params.title.toUpperCase()}</Heading>
            <Heading color="emerald.400" size="md">
              {route.params.tranNumber}
            </Heading>
            <Heading color="emerald.400" size="sm">
              {route.params.date}
            </Heading>
            <Text pt="3" fontWeight="md">
              {route.params.description}
            </Text>
            <Text pt="3" fontWeight="md">
              {route.params.unit_name}
            </Text>
          </View>
          <Divider my="2" />
          <Text style={{padding: 5, fontWeight: 'bold'}}>Realisasi</Text>
          <TextArea
            placeholder="Input Realisasi"
            value={realisasi}
            onChangeText={value => {
              setRealisasi(value);
            }}
            editable={
              route.params.realisasi != null
                ? false
                : route.params.user_id != null
                ? false
                : true
            }
          />

          <Divider my="2" />

          <Menu
            w="190"
            trigger={triggerProps => {
              return (
                <TouchableOpacity
                  disabled={
                    route.params.realisasi != null
                      ? true
                      : route.params.user_id != null
                      ? true
                      : false
                  }
                  {...triggerProps}>
                  <View>
                    {console.log(singleFile)}
                    <RenderImage singleFile={singleFile} />
                  </View>
                </TouchableOpacity>
              );
            }}>
            <Menu.Item onPress={chooseFile}>Choose File</Menu.Item>
            <Menu.Item onPress={choosePhoto}>Take a Photo</Menu.Item>
          </Menu>

          <Divider my="2" />
          <Text style={{padding: 5, fontWeight: 'bold'}}>Penyelesaian</Text>
          <TextArea
            placeholder="Input Penyelesaian"
            value={penyelesaian}
            onChangeText={value => {
              setPenyelesaian(value);
            }}
            editable={
              route.params.realisasi != null
                ? route.params.user_id != null
                  ? false
                  : true
                : false
            }
            // disabled={disabled}
          />
          <Divider my="2" />

          <Menu
            w="190"
            trigger={triggerProps => {
              return (
                <TouchableOpacity
                  disabled={
                    route.params.result != null && route.params.result != 'null'
                      ? true
                      : route.params.user_id != null
                      ? true
                      : false
                  }
                  {...triggerProps}>
                  <View>
                    <RenderImageResult singleFileResult={singleFileResult} />
                  </View>
                </TouchableOpacity>
              );
            }}>
            <Menu.Item onPress={chooseFileResult}>Choose File</Menu.Item>
            <Menu.Item onPress={choosePhotoResult}>Take a Photo</Menu.Item>
          </Menu>
          {/* <TouchableOpacity
            onPress={chooseFileResult}
            disabled={
              route.params.result != null
                ? true
                : route.params.user_id != null
                ? true
                : false
            }>
            <View></View>
          </TouchableOpacity> */}
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
