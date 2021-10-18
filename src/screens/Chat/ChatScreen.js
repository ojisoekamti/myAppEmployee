import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {firebaseInit, pushData} from '../../services/firebase';
import * as firebaseData from 'firebase';

export default function Example() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    firebaseInit;
    firebaseData
      .database()
      .ref('messages')
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
    pushData('messages', messages[0]);
    console.log(messages[0]);
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      createdAt={new Date()}
      renderUsernameOnMessage={true}
      user={{
        _id: 3,
        avatar: 'https://placeimg.com/140/140/any',
        name: 'Raymnod',
      }}
    />
  );
}
