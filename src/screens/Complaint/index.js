import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {Heading, Stack, Center, VStack, ImageButton} from 'native-base';
import {getAsyncData} from '../../asyncStorage';
import moment from 'moment';
import {notification} from '../../components/Notification';
const Complaint = ({navigation}) => {
  const [data, setData] = useState([]);
  // let data = [];
  useEffect(() => {
    const getUserData = async () => {
      const uid = await getAsyncData('uuid');
      console.log(uid);
      var url = 'https://sb.thecityresort.com/api/user-tickets?uid=' + uid;
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
          setData(result);
          // for (let i = 0; i < result.length; i++) {
          //   let row = result[i];
          //   console.log(row);
          // }
        })
        .catch(error => {
          console.log(error);
        });

      return () => {};
    };
    onPress();
    getUserData();
  }, []);

  const onPress = () => {
    // notification.configure();
    // notification.createChannel('1');
    // notification.sendNotification('1', 'Title', 'Description');
  };
  return (
    <View style={{backgroundColor: '#fff', flex: 1, alignItems: 'center'}}>
      {/* <Text>No Data Available</Text> */}
      {data.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              navigation.navigate('ComplaintDetail', {
                id: item.id,
                title: item.title,
                date: moment(item.created_at).format('DD-MM-YYYY hh:mm:ss'),
                description: item.description,
                realisasi: item.realization,
                singleFile: item.realization_image,
                singleFileResult: item.result_image,
                tranNumber: item.tranNumber,
                unit_name: item.unit_name,
                user_id: item.user_id,
              })
            }>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDetails}>
                {/* {data} */}
                {item.description}
              </Text>
              <Text style={styles.cardDetails}>
                {moment(item.created_at).format('DD-MM-YYYY hh:mm:ss')}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
      {/* <TouchableOpacity style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>Lorem Ipsum</Text>
          <Text style={styles.cardDetails}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
          <Text style={styles.cardDetails}>2021-08-20 12:34:00</Text>
        </View>
      </TouchableOpacity> */}
    </View>
  );
};

export default Complaint;

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
    height: 100,
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
