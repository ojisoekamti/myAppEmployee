import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, Keyboard, Alert} from 'react-native';
import {Text, View, Stack, TextArea, Center, ScrollView} from 'native-base';
import {getAsyncData} from '../../asyncStorage';
import moment from 'moment';
// import Picker from 'react-native-simple-modal-picker';

const ApprovalForm = ({navigation}) => {
  const [description, setDescription] = useState('');
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const uid = await getAsyncData('uuid');
    const urole = await getAsyncData('urole');
  };

  const onSubmit = () => {
    navigation.navigate('MainApp');
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
          <Text style={{padding: 5, fontWeight: 'bold'}}>Description</Text>
          <TextArea
            onChangeText={value => {
              setDescription(value);
            }}
          />
        </ScrollView>
      </Stack>

      <View style={styles.container}>
        <TouchableOpacity style={styles.buttonContainer} onPress={onSubmit}>
          <Center
            title="Test"
            style={styles.button}
            backgroundColor={'success.600'}>
            Approve
          </Center>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={onSubmit}>
          <Center
            title="Test"
            style={styles.button}
            backgroundColor={'pink.600'}>
            Reject
          </Center>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ApprovalForm;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    height: 40,
    color: '#fff',
  },
});
