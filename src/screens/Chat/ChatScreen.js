import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import Fire from '../../utils/config/firebase';

export default class ChatScreen extends Component {
  state = {
    message: [],
  };

  get user() {
    return {
      _id: Fire.uid,
      name: 'Abdul Ghoji',
    };
  }

  componentDidMount() {
    Fire.get(message =>
      this.setState(previous => ({
        message: GiftedChat.append(previous.message, message),
      })),
    );
  }
  componentWillUnmount() {
    Fire.off();
  }
  render() {
    const chat = (
      <GiftedChat
        messages={this.state.message}
        onSend={Fire.send}
        user={this.user}
      />
    );
    if (Platform.OS === 'android') {
      return (
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior="padding"
          keyboardVerticalOffset={3}>
          {chat}
        </KeyboardAvoidingView>
      );
    }
    return <SafeAreaView style={{flex: 1}}>{chat}</SafeAreaView>;
  }
}
