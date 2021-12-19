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
import {firebaseInit, pushData} from '../../services/firebase';
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

  const onSend = (newMessages = []) => {
    setMessages(prevMessages => GiftedChat.append(prevMessages, newMessages));
    newMessages[0].createdAt = new Date().getTime();
    newMessages[0].sent = true;
    // newMessages[0].image = "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg";
    // newMessages[0].received = true;
    console.log(newMessages);
    pushData(route.params.prefix, newMessages[0]);
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
          'https://sb.thecityresort.com/storage/' +
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
