import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  // ScrollView,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import {getAsyncData} from '../../asyncStorage';
import uuid from 'react-native-uuid';
//const navigation = useNavigation();
/**
const contacts = [
  {
    index: 2,
    name: 'Abdul Ghoji Hanggoro',
  },
  {
    index: 5,
    name: 'Raymond LA',
  },
  {
    index: 6,
    name: 'Dansek edit profile',
  },
  {
    index: 7,
    name: 'Danru 1',
  },
  {
    index: 8,
    name: 'Danru 2',
  },
  {
    index: 9,
    name: 'Anggota 1 Test',
  },
  {
    index: 10,
    name: 'Anggota 2',
  },
  {
    index: 11,
    name: 'Anggota danru 1',
  },
  {
    index: 12,
    name: 'Anggota Danru 2',
  },
  {
    index: 13,
    name: 'Admin Security',
  },
  {
    index: 14,
    name: 'CS user',
  },
  {
    index: 15,
    name: 'Anggota 3',
  },
  {
    index: 18,
    name: 'Hardi Salim',
  },
  {
    index: 19,
    name: 'User ME',
  },
];  */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignSelf: 'stretch',
    paddingVertical: 20,
  },
  row: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionHeader: {
    backgroundColor: '#efefef',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default class ContactsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      isLoaded: false,
    };
    this.onPress = this.onPress.bind(this);
  }

  getData = () => {
    let contactsArr = [];
    let aCode = 'A'.charCodeAt(0);
    for (let i = 0; i < 26; i++) {
      let currChar = String.fromCharCode(aCode + i);
      let obj = {
        title: currChar,
      };

      let currContacts = this.state.contacts.filter(item => {
        return item.name[0].toUpperCase() === currChar;
      });
      if (currContacts.length > 0) {
        currContacts.sort((a, b) => a.name.localeCompare(b.name));
        obj.data = currContacts;
        contactsArr.push(obj);
      }
    }
    return contactsArr;
  };
  // This is typescript code
  componentDidMount() {
    /* do something */
  }

  async componentDidMount() {
    const uid = await getAsyncData('uuid');
    const contact = this.setState({
      uid: uid,
    });

    fetch('https://sb.thecityresort.com/api/get-contact?uid=' + uid)
      .then(res => res.json())
      .then(result => {
        this.setState({
          isLoaded: true,
          contacts: result,
        });
      });
  }

  onPress(uid, uid2, title) {
    let prefix = '';
    const idPrefix = uuid.v4();
    fetch('https://sb.thecityresort.com/api/insert-chat-list', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: uid,
        uid2: uid2,
        id: idPrefix,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.length > 0) {
          prefix = responseJson[0].id;
        } else {
          prefix = idPrefix;
        }
        this.props.navigation.push('ChatScreen', {
          prefix: prefix,
          title: title,
        });
      });
    //navigation.navigate('Otp');
  }

  render() {
    return (
      <View style={styles.container}>
        <SectionList
          sections={this.getData()}
          // ListHeaderComponent={() => <Button title="Add Contact" />}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                this.onPress(this.state.uid, item.index, item.name)
              }>
              <View style={styles.row}>
                <Text>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
          renderSectionHeader={({section}) => (
            <View style={styles.sectionHeader}>
              <Text>{section.title}</Text>
            </View>
          )}
          keyExtractor={item => item.index}
        />
      </View>
    );
  }
}
