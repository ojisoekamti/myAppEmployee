/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {View, Text} from 'react-native';
import {
  Avatar,
  Bubble,
  SystemMessage,
  Message,
  MessageText,
} from 'react-native-gifted-chat';

export const renderAvatar = props => (
  <Avatar
    {...props}
    containerStyle={{left: {}, right: {}}}
    imageStyle={{left: {}, right: {}}}
  />
);

export const renderBubble = props => (
  <Bubble
    {...props}
    // renderTime={() => <Text>Time</Text>}
    // renderTicks={() => <Text>Ticks</Text>}
    containerStyle={{
      //   left: {borderColor: 'teal', borderWidth: 8},
      right: {},
    }}
    wrapperStyle={{
      //   left: {borderColor: 'tomato', borderWidth: 4},
      right: {},
    }}
    bottomContainerStyle={{
      //   left: {borderColor: 'purple', borderWidth: 4},
      right: {},
    }}
    tickStyle={{}}
    usernameStyle={{color: 'blue', fontWeight: '100'}}
    containerToNextStyle={{
      left: {},
      right: {},
    }}
    containerToPreviousStyle={{
      left: {},
      right: {},
    }}
  />
);

export const renderSystemMessage = props => (
  <SystemMessage
    {...props}
    containerStyle={{backgroundColor: 'pink'}}
    wrapperStyle={{borderWidth: 10, borderColor: 'white'}}
    textStyle={{color: '#fff', fontWeight: '900'}}
  />
);

export const renderMessage = props => (
  <Message
    {...props}
    // renderDay={() => <Text>Date</Text>}
    containerStyle={{
      // paddingbottom: 20,
      //   left: {backgroundColor: 'lime'},
      //   right: {backgroundColor: 'gold'},
    }}
  />
);

export const renderMessageText = props => (
  <MessageText
    {...props}
    containerStyle={
      {
        //   left: {backgroundColor: 'yellow'},
        //   right: {backgroundColor: 'purple'},
      }
    }
    textStyle={
      {
        //   left: {color: 'red'},
        //   right: {color: 'green'},
      }
    }
    linkStyle={
      {
        //   left: {color: 'orange'},
        //   right: {color: 'orange'},
      }
    }
    customTextStyle={{fontSize: 12, lineHeight: 15}}
  />
);

export const renderCustomView = ({user}) => (
  <></>
  //   <View style={{minHeight: 20, alignItems: 'center'}}>
  //     <Text>{user.name}</Text>
  //   </View>
);
