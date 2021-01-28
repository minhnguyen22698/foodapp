import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  FlatList,
} from 'react-native';
import Icons from 'react-native-vector-icons/dist/Ionicons';
import {Header, Left, Body, Right, Button, Title} from 'native-base';
import firebase from 'firebase';
import {Avatar} from 'react-native-paper';

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userid: this.props.route.params.userid,
      contacid: this.props.route.params.contacid,
      userinfo: '',
      contactinfo: '',
      chatdata: [],
      message: '',
    };
  }
  async componentDidMount() {
    StatusBar.setBackgroundColor('rgba(0,0,0,0)');
    StatusBar.setTranslucent(true);
    this.getProfile('userinfo', this.state.userid);
    this.getProfile('contactinfo', this.state.contacid);
    this.getChatData();
  }
  getChatData = () => {};
  sendMessage = () => {
    // firebase.database().ref(`chatroom/${this.state.userid}/${this.state.contacid}`)
    // .push({
    //   message:this.state.message,
    //   type:'send'
    // })
    // .then(()=>{
    //   firebase.database().ref(`chatroom/${this.state.contacid}/${this.state.userid}`)
    //   .push({
    //     message:this.state.message,
    //     type:'receive'
    //   })
    // })
    firebase
      .database()
      .ref(`/messages/${this.state.userid}/${this.state.contacid}`)
      .push({
        contacid: this.state.contacid,
        message: this.state.message,
        type: 'send',
      })
      .then(() => {
        firebase
          .database()
          .ref(`/messages/${this.state.contacid}/${this.state.userid}`)
          .push({
            message: this.state.message,
            type: 'receive',
            contactid: this.state.userid,
          });
      })
      .then(() => {
        // Store header user conversations
        firebase
          .database()
          .ref(`user_conversations/${this.state.userid}/${this.state.contacid}`)
          .set({
            name: this.state.contactinfo.username,
            lastMessage: this.state.message,
            contactid:this.state.contacid
          })
      })
      .then(() => {
        // Store header user conversations
        firebase
          .database()
          .ref(`user_conversations/${this.state.contacid}/${this.state.userid}`)
          .set({
            name: this.state.userinfo.username,
            lastMessage: this.state.message,
            contacid:this.state.userid
          })
      })
  };
  getProfile(key, uid) {
    firebase
      .database()
      .ref('users/' + uid)
      .on('value', (snapshoot) => {
        if (snapshoot.val() != null && snapshoot.val() != undefined) {
          this.setState({
            [key]: snapshoot.val().profile,
          });
        }
      });
  }
  getChatData = () => {
    firebase
      .database()
      .ref(`messages/${this.state.userid}/${this.state.contacid}`)
      .on('value', (snapshoot) => {
        if (
          snapshoot.val() !== null &&
          snapshoot.val() !== undefined &&
          snapshoot.val() !== null
        ) {
          this.setState({
            chatdata: Object.values(snapshoot.val()),
          });
        }
      });
  };
  renderRow = ({item}) => {
    if (item.type === 'send') {
      return (
        <View
          style={{
            margin:10,
            alignItems: 'flex-end',
            marginTop: 5,
            marginLeft: 40,
            marginBottom: 5,
          }}>
          <View style={{backgroundColor: '#dbf5b4', borderRadius: 10}}>
            <Text style={{fontSize: 20, color: '#0d0d0d', padding: 8}}>
              {item.message}
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View
        style={{
          margin:10,
          alignItems: 'flex-start',
          marginTop: 5,
          marginRight: 40,
          marginBottom: 5,
        }}>
        <View style={{backgroundColor: '#bfbfbf', borderRadius: 10}}>
          <Text
            style={{fontSize: 20, color: '#0d0d0d', padding: 8, elevation: 1}}>
            {item.message}
          </Text>
        </View>
      </View>
    );
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header transparent style={{backgroundColor: '#8e44ad'}}>
          <View style={{justifyContent: 'center', padding: 10}}>
            <Icons
              onPress={() => {
                this.props.navigation.goBack();
              }}
              name={'chevron-back-outline'}
              size={30}
            />
          </View>
          <Body>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Avatar.Image
                source={{uri: this.state.contactinfo.image}}
                size={55}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  marginLeft: 5,
                  color: '#2c3e50',
                }}>
                {this.state.contactinfo.username}
              </Text>
            </View>
          </Body>
        </Header>
        <View
          style={{
            flex: 9 / 10,
            backgroundColor: '#A5A5A5',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}>
          <FlatList
            data={this.state.chatdata}
            renderItem={this.renderRow}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={{flex: 1 / 10}}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#FFF',
              width: '100%',
              height: '100%',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginLeft: 2,
            }}>
            <View style={{flex: 8 / 10}}>
              <TextInput
                placeholder="Nhập nội dung chat"
                onChangeText={(val) => {
                  this.setState({
                    message: val,
                  });
                }}
                style={{height: 100, fontSize: 18}}
              />
            </View>
            <View style={{flex: 2 / 10}}>
              <TouchableOpacity onPress={this.sendMessage}>
                <Text style={{fontSize:20}}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
const s = StyleSheet.create({});
export default ChatRoom;
