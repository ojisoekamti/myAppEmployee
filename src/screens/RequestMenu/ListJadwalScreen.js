import {Text, StyleSheet, View} from 'react-native';
import React, {Component} from 'react';
import Timeline from 'react-native-timeline-flatlist';
import {getAsyncData} from '../../asyncStorage';

export default class ListJadwalScreen extends Component {
  constructor() {
    super();
    
    this.state = {
        data: [],
        isLoaded: false,
      };
    this.data = [{time: '09:00', title: '', description: ''}];
  }
  async componentDidMount() {
    const uid = await getAsyncData('uuid');
    const contact = this.setState({
      uid: uid,
    });

    console.log('uid', uid);
    fetch('https://thecityresort.com/api/get-jadwal?uid=' + uid)
      .then(res => res.json())
      .then(result => {
        console.log('data', result);
        var data = [];
        for (let i = 0; i < result.length; i++) {
          const element = result[i];
          data.push({time: element.time, title: element.tower_id, description: element.description});
        }
        this.setState({
          isLoaded: true,
          data: data,
        });
      });
  }

  render() {
    return <Timeline data={this.state.data} />;
  }
}

const styles = StyleSheet.create({});
