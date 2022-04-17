/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import {AddIcon, Icon, Text} from 'native-base';
import React from 'react';
import {Image} from 'react-native';
import {InputToolbar, Actions, Composer, Send} from 'react-native-gifted-chat';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import {GiftedChat} from 'react-native-gifted-chat';
import uuid from 'react-native-uuid';
import {pushData} from '../../services/firebase';

export const renderInputToolbar = props => (
  <InputToolbar
    {...props}
    containerStyle={{
      backgroundColor: '#222B45',
      paddingTop: 2,
      marginTop: 20,
    }}
    primaryStyle={{alignItems: 'center'}}
  />
);

// const handlePickImage = props => console.log('test');

const chooseFile = (...props) => {
  console.log(props[0].user);
  console.log(props[0].prefix);
  console.log(uuid.v4());
  // return;
  let options = {
    //maxWidth: 500,
    //maxHeight: 500,
    mediaType: 'mediaType',
    quality: 0.6,
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
          console.log(results.file);
          // console.log(newMessages);

          let messages = {
            _id: uuid.v4(),
            image: 'https://thecityresort.com/storage/files/' + results.file,
            createdAt: new Date().getTime(),
            user: props[0].user,
          };
          console.log(messages);
          pushData(props[0].prefix, messages);
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
  console.log(uuid.v4());
  // return;
  let options = {
    //maxWidth: 500,
    //maxHeight: 500,
    mediaType: 'mediaType',
    quality: 0.1,
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

      fetch('https://thecityresort.com/api/upload', requestOptions)
        .then(response => response.text())
        .then(result => {
          let results = JSON.parse(result);
          console.log(results.file);
          // console.log(newMessages);

          let messages = {
            _id: uuid.v4(),
            image: 'https://thecityresort.com/storage/files/' + results.file,
            createdAt: new Date().getTime(),
            user: props[0].user,
          };
          console.log(messages);
          pushData(props[0].prefix, messages);
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

export const renderActions = props => (
  <Actions
    {...props}
    containerStyle={{
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 0,
    }}
    icon={() => <AddIcon style={{color: '#fff'}} size="sm" />}
    options={{
      'Choose From Library': ({...props}) => {
        // console.log(props.messages);
        chooseFile(props);
        console.log('Choose From Library');
      },
      'Take a Photo': ({...props}) => {
        // console.log(props.messages);
        choosePhoto(props);
        console.log('Choose From Library');
      },
      Cancel: () => {
        console.log('Cancel');
      },
    }}
    optionTintColor="#222B45"
  />
);

export const renderComposer = props => (
  <Composer
    {...props}
    textInputStyle={{
      color: '#222B45',
      backgroundColor: '#EDF1F7',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#E4E9F2',
      paddingTop: 8.5,
      paddingHorizontal: 12,
      marginLeft: 0,
    }}
  />
);

export const renderSend = props => (
  <Send
    {...props}
    disabled={!props.text}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 10,
    }}>
    <Text style={{color: '#fff'}}>Send</Text>
    {/* <Image
      style={{width: 32, height: 32}}
      source={{
        uri: 'https://placeimg.com/32/32/any',
      }}
    /> */}
  </Send>
);
