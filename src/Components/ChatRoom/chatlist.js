import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import firebase from 'firebase';
import Header from '../Header/Header';
import {FlatList} from 'react-native-gesture-handler';
import profile from './../Profile/initProfile';
import {Avatar} from 'react-native-paper';

class ChatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatlist: [],
      refesing: false,
    };
  }
  componentDidMount() {
    this.getChatList();
  }
  getChatList = () => {
    const {currentUser} = firebase.auth();
    firebase
      .database()
      .ref('user_conversations/' + currentUser.uid)
      .on('value', (snapshot) => {
        if (snapshot.val() !== null && snapshot.val !== undefined) {
          this.setState({
            chatlist: Object.values(snapshot.val()),
          });
        }
      });
  };
  onRefesh = () => {
    try {
      this.setState({refesing: true});
      this.getChatList();
      setTimeout(() => {
        this.setState({refesing: false});
      }, 1000);
    } catch (error) {}
  };
  renderChat = (item, index) => {
    let img = '';
    const {currentUser} = firebase.auth();
    firebase
      .database()
      .ref('users/' + item.item.contactid)
      .on('value', (snapshoot) => {
          console.log(snapshoot.val())
        if (snapshoot.val() !== null && snapshoot.val() !== undefined) {
          img = snapshoot.val().profile.image;
        }
      });
    return (
      <TouchableOpacity
        style={{
          height: 80,
          width: '100%',
          backgroundColor: '#95a5a6',
          margin: 5,
          justifyContent: 'center',
        }}
        onPress={() => {
            this.props.navigation.navigate('ChatRoom', {
              userid: currentUser.uid,
              contacid: item.item.contactid,
            });
        }}>
        <View style={{flexDirection: 'row', marginLeft: 5}}>
          {img !== '' ? (
            <Avatar.Image source={{uri: img}} size={60} />
          ) : (
            <Avatar.Text label={'M'} />
          )}
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              marginLeft: 10,
            }}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
              {item.item.name}
            </Text>
            <Text>{item.item.lastMessage}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header title={'Conversations'} color={'#000000'} />
        <ScrollView refreshControl={<RefreshControl refreshing={this.state.refesing} onRefresh={this.onRefesh}/>}>
          <FlatList
            data={this.state.chatlist}
            renderItem={(item, index) => this.renderChat(item, index)}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}
export default ChatList;
