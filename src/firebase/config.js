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
        apiKey: 'AIzaSyCUTVZo9oXgKP9q2bdyPxhoLwiqPfIi_qY',
        authDomain: 'thecityresort-app.firebaseapp.com',
        databaseURL: 'https://thecityresort-app-default-rtdb.firebaseio.com',
        projectId: 'thecityresort-app',
        storageBucket: 'thecityresort-app.appspot.com',
        messagingSenderId: '873602037019',
        appId: '1:873602037019:web:4e43f0a9e9bb3ced708fbe',
        measurementId: 'G-BDZ65PYFZ7',
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
