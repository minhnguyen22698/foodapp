import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icons from 'react-native-vector-icons/dist/Ionicons'
import {Header, Left,Body,Right,Button,Title} from 'native-base'
import firebase from 'firebase'

class ChatRoom extends React.Component {
constructor(props){
  super(props)
  this.state={
    userid:this.props.route.params.userid,
    contacid:this.props.route.params.contacid,
    userinfo:'',
    contactinfo:'',
  }
}
async componentDidMount(){

}
getProfile(uid){

}
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        
        <TouchableOpacity
          style={{backgroundColor: 'red', width: 100, height: 40}}
          onPress={() => {
            console.log(this.state);
          }}>
          <Text style={{color: 'black'}}>Test</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const s = StyleSheet.create({});
export default ChatRoom;
