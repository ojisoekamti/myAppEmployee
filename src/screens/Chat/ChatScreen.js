import React, {useState, useEffect, BackHandler, useFocusEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import initialMessages from './messages';
import {
  renderInputToolbar,
  renderActions,
  renderComposer,
  renderSend,
} from './InputToolbar';
import {
  renderAvatar,
  renderBubble,
  renderSystemMessage,
  renderMessage,
  renderMessageText,
  renderCustomView,
} from './MessageContainer';
import {
  firebaseInit,
  pushData,
  setListener,
  updateData,
} from '../../services/firebase';
import * as firebaseData from 'firebase';
import {getAsyncData} from '../../asyncStorage';
import {Button} from 'react-native';

const Chats = ({route, navigation}) => {
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');

  useEffect(() => {
    firebaseInit;
    // console.log(route.params.title);
    navigation.setOptions({
      title: route.params.title,
    });

    const getUserData = async () => {
      const uid = await getAsyncData('uuid');
      const uname = await getAsyncData('uname');
      const uavatar = await getAsyncData('uavatar');
      console.log(uid);
      setUserId(uid);
      setUserName(uname);
      setUserAvatar(uavatar);
    };
    getUserData();
    firebaseData
      .database()
      .ref(route.params.prefix)
      .orderByChild('original')
      .on('value', function (snap) {
        let dataArray = [];
        var i = 0;
        if (snap.val() == null) {
          return;
        }
        const fbId = Object.keys(snap.val());
        snap.forEach(childSnapshot => {
          dataArray.push(childSnapshot.val());
          i++;
        });
        var results = [];
        for (var i = dataArray.length - 1; -1 < i; i--) {
          //console.log(dataArray[i]._id);
          //console.log(dataArray[i]);
          //console.log(snap[i]);
          if (route.params.private) {
            if (dataArray[i].user._id != route.params.uid) {
              console.log('test');
              updateData(route.params.prefix + '/' + fbId[i], {
                received: true,
              });
            }
          }
          results.push(dataArray[i]);
        }
        setMessages(results);
      });
  }, []);

  const onSend = (newMessages = []) => {
    setMessages(prevMessages => GiftedChat.append(prevMessages, newMessages));
    newMessages[0].createdAt = new Date().getTime();
    newMessages[0].sent = true;
    // newMessages[0].image = "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg";
    // newMessages[0].received = true;
    console.log(newMessages);
    pushData(route.params.prefix, newMessages[0]);
    if (route.params.private) {
      var myHeaders = new Headers();
      myHeaders.append(
        'Authorization',
        'key=AAAAeAHYOt0:APA91bGiQT-tMtYxf8u1echTUOrVRNrkYovvIVLWj7dffvzdomxWXVYPfyiSgcHuLr9GLS6KPF7AQr07pexJ6elDZjAwOWWTrfst4Ru2MUT3azB04m6laDueAxAO2Jf_lUlPsqD570nQ',
      );
      myHeaders.append('Content-Type', 'application/json');
      console.log(route.params.mobile_token);
      var raw = JSON.stringify({
        to: route.params.mobile_token,
        notification: {
          title: userName.replace(/"/g, ''),
          body: newMessages[0].text,
        },
        data: {
          screen: 'Chat',
        },
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }
  };

  return (
    <GiftedChat
      messages={messages}
      // text={text}
      // onInputTextChanged={setText}
      onSend={onSend}
      prefix={route.params.prefix}
      user={{
        _id: userId,
        avatar:
          'https://thecityresort.com/storage/' +
          (userAvatar ? JSON.parse(userAvatar) : null),
        name: userName ? JSON.parse(userName) : null,
      }}
      alignTop
      alwaysShowSend
      scrollToBottom
      // showUserAvatar
      renderAvatarOnTop
      renderUsernameOnMessage
      // bottomOffset={30}
      // onPressAvatar={console.log}
      renderInputToolbar={renderInputToolbar}
      renderActions={renderActions}
      renderComposer={renderComposer}
      renderSend={renderSend}
      renderAvatar={renderAvatar}
      // renderBubble={renderBubble}
      renderSystemMessage={renderSystemMessage}
      renderMessage={renderMessage}
      renderMessageText={renderMessageText}
      // renderMessageImage
      renderCustomView={renderCustomView}
      isCustomViewBottom
      messagesContainerStyle={{backgroundColor: '#fff'}}
      parsePatterns={linkStyle => [
        {
          pattern: /#(\w+)/,
          style: linkStyle,
          onPress: tag => console.log(`Pressed on hashtag: ${tag}`),
        },
      ]}
    />
  );
};

export default Chats;
