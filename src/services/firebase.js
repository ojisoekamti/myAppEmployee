import firebase from 'firebase/app';
import * as firebaseData from 'firebase';
export const firebaseInit = !firebase.apps.length
  ? firebase.initializeApp({
      apiKey: 'AIzaSyAbLw6oeygZegw5OFzh_q1UAvItuQTpiGk',
      authDomain: 'employeeapps-e9492.firebaseapp.com',
      databaseURL: 'https://employeeapps-e9492-default-rtdb.firebaseio.com',
      projectId: 'employeeapps-e9492',
      storageBucket: 'employeeapps-e9492.appspot.com',
      messagingSenderId: '515427023581',
      appId: '1:515427023581:web:6870b07faf77aacfc3b934',
      measurementId: 'G-WD5YPTDD51',
    })
  : firebase.app();

export const updateData = (endpoint, updateJson) => {
  return firebaseData.database().ref(endpoint).update(updateJson);
};

export const setListener = (endpoint, updaterFn) => {
  firebaseData.database().ref(endpoint).on('value', updaterFn);
  return () => firebaseData.database().ref(endpoint).off();
};

export const pushData = (endpoint, data) => {
  return firebaseData.database().ref(endpoint).push(data);
};
