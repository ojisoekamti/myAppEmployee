import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat,ActionsProps} from 'react-native-gifted-chat';
import {firebaseInit, pushData} from '../../services/firebase';
import * as firebaseData from 'firebase';
import {getAsyncData} from '../../asyncStorage';



export default function Example({route}) {
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  useEffect(() => {
    firebaseInit;

    const getUserData = async () => {
      const uid = await getAsyncData('uuid');
      const uname = await getAsyncData('uname');
      setUserId(uid);
      setUserName(uname);
    };
    getUserData();
    firebaseData
      .database()
      .ref(route.params.prefix)
      .orderByChild('original')
      .on('value', function (snap) {
        let dataArray = [];
        var i = 0;
        snap.forEach(childSnapshot => {
          dataArray.push(childSnapshot.val());
          i++;
        });
        var results = [];
        for (var i = dataArray.length - 1; -1 < i; i--) {
          results.push(dataArray[i]);
        }
        setMessages(results);
      });
  }, []);
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    messages[0].createdAt = new Date().getTime();
    pushData(route.params.prefix, messages[0]);
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      createdAt={new Date()}
      renderUsernameOnMessage={true}
      // renderActions={renderActions}
      user={{
        _id: userId,
        avatar: 'https://placeimg.com/140/140/any',
        name: userName ? JSON.parse(userName) : null,
      }}
    />
  );
}
