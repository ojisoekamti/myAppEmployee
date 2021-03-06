import {
  Stack,
  Heading,
  HStack,
  Center,
  NativeBaseProvider,
  Badge,
  Menu,
  Pressable,
  HamburgerIcon,
} from 'native-base';
import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AppBar from '../../components/AppBar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Swiper from 'react-native-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {notification} from '../../components/Notification';
import {getAsyncData, removeItemValue} from '../../asyncStorage';
export function Example({navigation}) {
  useEffect(() => {
    const getUserData = async () => {
      const getScreen = await getAsyncData('screenNotif');
      if (getScreen) {
        navigation.navigate(getScreen);
        removeItemValue('screenNotif');
      }
      //console.log('Route', route.params.token);
      // console.log('userData', userData);
    };
    getUserData();
  }, [navigation]);
  const onPress = () => {
    notification.configure();
    notification.createChannel('1');
    notification.sendNotification('1', 'Title', 'Description');
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.sliderContainer}>
        <Swiper
          autoplay
          horizontal={false}
          height={200}
          activeDotColor="#d97706">
          <View style={styles.slide}>
            <Image
              source={require('../../assets/images/city-resort.jpeg')}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={require('../../assets/images/city-resort-poll.jpeg')}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={require('../../assets/images/city-sky.jpeg')}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
        </Swiper>
      </View>

      <View style={styles.categoryContainer}>
        {/* <Menu
          w="190"
          trigger={triggerProps => {
            return (
              <TouchableOpacity style={styles.categoryBtn} {...triggerProps}>
                <View style={styles.categoryIcon}>
                  <MaterialCommunityIcons
                    name="account-switch-outline"
                    size={35}
                    color="#d97706"
                  />
                </View>
                <Text style={styles.categoryBtnTxt}>Request Form </Text>
              </TouchableOpacity>
            );
          }}>
          <Menu.Item
            onPress={() => navigation.navigate('ShiftFrom', {new: true})}>
            Tukar Shift Request
          </Menu.Item>
          <Menu.Item
            onPress={() => navigation.navigate('TukarShift', {lists: true})}>
            Tukar Shift Info
          </Menu.Item>
          <Menu.Item
            onPress={() => navigation.navigate('TukarShift', {lists: false})}>
            List Approval
          </Menu.Item>
        </Menu> */}

        <TouchableOpacity
          style={styles.categoryBtn}
          onPress={() => navigation.navigate('RequestMenu')}>
          <View style={styles.categoryIcon}>
            <MaterialCommunityIcons
              name="account-switch-outline"
              size={35}
              color="#d97706"
            />
          </View>
          <Text style={styles.categoryBtnTxt}>Request Form </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryBtn}
          onPress={() => navigation.navigate('Complaint')}>
          <View style={styles.categoryIcon}>
            {/* <Badge // bg="red.400"
              colorScheme="danger"
              rounded="999px"
              mb={-4}
              mr={-4}
              zIndex={1}
              variant="solid"
              alignSelf="flex-end"
              _text={{
                fontSize: 12,
              }}>
              2
            </Badge> */}
            <MaterialCommunityIcons
              name="account-alert"
              size={35}
              color="#d97706"
            />
          </View>
          <Text style={styles.categoryBtnTxt}>Complaints List </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryBtn}>
          <View style={styles.categoryIcon}>
            <MaterialCommunityIcons name="virus" size={35} color="#d97706" />
          </View>
          <Text style={styles.categoryBtnTxt}>Covid 19</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsWrapper}>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
          }}>
          Pemberitahuan
        </Text>
        {/* <View style={styles.card}>
          <View style={styles.cardImgWrapper}>
            <Image
              source={require('../../assets/images/food-banner2.jpg')}
              resizeMode="cover"
              style={styles.cardImg}
            />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Lorem Ipsum</Text>
            <Text style={styles.cardDetails}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardImgWrapper}>
            <Image
              source={require('../../assets/images/food-banner3.jpg')}
              resizeMode="cover"
              style={styles.cardImg}
            />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Lorem Ipsum</Text>
            <Text style={styles.cardDetails}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardImgWrapper}>
            <Image
              source={require('../../assets/images/food-banner4.jpg')}
              resizeMode="cover"
              style={styles.cardImg}
            />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Lorem Ipsum</Text>
            <Text style={styles.cardDetails}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Text>
          </View>
        </View> */}
      </View>
    </ScrollView>
  );
}

const Home = ({navigation}) => {
  return (
    <NativeBaseProvider>
      <AppBar />
      <Example navigation={navigation} />
    </NativeBaseProvider>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sliderContainer: {
    height: 200,
    width: '90%',
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 8,
  },

  wrapper: {},

  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  sliderImage: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 10,
  },
  categoryBtn: {
    flex: 1,
    width: '30%',
    marginHorizontal: 0,
    alignSelf: 'center',
  },
  categoryIcon: {
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 70,
    height: 70,
    backgroundColor: '#fdeae7' /* '#d97706' */,
    borderRadius: 50,
  },
  categoryBtnTxt: {
    alignSelf: 'center',
    marginTop: 5,
    color: '#f59e0b',
  },
  cardsWrapper: {
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
  },
  card: {
    height: 100,
    marginVertical: 10,
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
  },
  cardDetails: {
    fontSize: 12,
    color: '#444',
  },
});
