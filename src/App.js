import React, {Component} from 'react';
import {NativeBaseProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './routes';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import Firebase from '@react-native-firebase/app';
import NotifService from './services/NotifService';
import {Alert} from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {tokenId: null};

    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this),
    );
  }

  componentDidMount() {
    const firebaseConfig = {
      apiKey: 'AIzaSyAbLw6oeygZegw5OFzh_q1UAvItuQTpiGk',
      authDomain: 'employeeapps-e9492.firebaseapp.com',
      databaseURL: 'https://employeeapps-e9492-default-rtdb.firebaseio.com',
      projectId: 'employeeapps-e9492',
      storageBucket: 'employeeapps-e9492.appspot.com',
      messagingSenderId: '515427023581',
      appId: '1:515427023581:web:6870b07faf77aacfc3b934',
      measurementId: 'G-WD5YPTDD51',
    };
    if (!Firebase.apps.length) {
      Firebase.initializeApp(firebaseConfig);
    } else {
      Firebase.app();
    }
    const apps = Firebase.apps;

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      // onRegister: function (token) {
      //   console.log('TOKEN:', token);
      // },

      onRegister: token => this.setState({tokenId: token.token}),

      // (required) Called when a remote is received or opened, or local notification is opened

      onNotification: notification => {
        const clicked = notification.userInteraction;
        if (clicked) {
          this.setState({notifData: notification});
        }
      },

      // onNotification: function (notification) {
      //   console.log('NOTIFICATION home:', notification);
      //   // process the notification

      //   // (required) Called when a remote is received or opened, or local notification is opened
      //   notification.finish(PushNotificationIOS.FetchResult.NoData);
      // },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION Action:', notification.action);
        console.log('NOTIFICATION Action:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  }

  render() {
    return (
      <>
        <NativeBaseProvider>
          <NavigationContainer>
            <Routes
              token={this.state.tokenId}
              notifData={this.state.notifData}
            />
          </NavigationContainer>
        </NativeBaseProvider>
      </>
    );
  }

  onRegister(token) {
    this.setState({registerToken: token.token, fcmRegistered: true});
  }

  onNotif(notif) {
    Alert.alert(notif.title, notif.message);
  }

  handlePerm(perms) {
    Alert.alert('Permissions', JSON.stringify(perms));
  }
}
