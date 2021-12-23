//Firebase Configuration
import firebase from 'firebase/app';
import auth from '@react-native-firebase/auth';


class config {
  constructor() {
    this.init();
    this.checkAuth();
  }
  init = () => {
    if (!firebase.getApp.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyAbLw6oeygZegw5OFzh_q1UAvItuQTpiGk',
        authDomain: 'employeeapps-e9492.firebaseapp.com',
        databaseURL: 'https://employeeapps-e9492-default-rtdb.firebaseio.com',
        projectId: 'employeeapps-e9492',
        storageBucket: 'employeeapps-e9492.appspot.com',
        messagingSenderId: '515427023581',
        appId: '1:515427023581:web:6870b07faf77aacfc3b934',
        measurementId: 'G-WD5YPTDD51',
      });
    }
  };
  
  checkAuth = () => {
    auth().onAuthStateChanged(user => {
      if (!user) {
        auth().signInAnonymously();
      }
    });
  };

  send = (message = message.forEach(item => {
    const message = {
      text: item.text,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: item.user,
    };
  }));

  parse = message => {
    const {user, text, tmiestamp} = message.val();
    const {key: _id} = message;
    const createdAt = new Date(timestamp);
    return {
      _id,
      createdAt,
      text,
      user,
    };
  };

  get = callback => {
    this.db.on('child_added', snapshot => callback(this.parse(snapshot)));
  };
  off() {
    this.db.off();
  }
  get db() {
    return firebase.database().ref('message');
  }
  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }
}

export default new config();
