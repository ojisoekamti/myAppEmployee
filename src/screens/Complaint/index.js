import React from 'react';
import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {Heading, Stack, Center, VStack, ImageButton} from 'native-base';
const Complaint = ({navigation}) => {
  return (
    <View style={{backgroundColor: '#fff', flex: 1, alignItems: 'center'}}>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ComplaintDetail')}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>Barang Mencurigakan</Text>
          <Text style={styles.cardDetails}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
          <Text style={styles.cardDetails}>2021-08-20 12:34:00</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>Lorem Ipsum</Text>
          <Text style={styles.cardDetails}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
          <Text style={styles.cardDetails}>2021-08-20 12:34:00</Text>
        </View>
      </TouchableOpacity>
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
