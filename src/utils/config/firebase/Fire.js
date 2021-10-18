import firebase from 'firebase';
import 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase

class Fire {
  constructor() {
    this.init();
    this.checkAuth();
  }
  init = () => {
    console.log(firebase.app.length);
    if (firebase.app.length) { 
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
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
    });
  };

  send = message => {
    message.forEach(item => {
      const message = {
        _id:item._id,
        text: item.text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: item.user,
      };
      this.db.push(message);
    });
  };

  parse = message => {
    const {user, text, timestamp} = message.val();
    const {key: _id} = message;
    const createdAt = new Date(timestamp);
    return {
      _id,
      user,
      text,
      createdAt,
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

export default new Fire();
