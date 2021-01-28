import React, {Component} from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Text,
  StyleSheet,
  View,
  AsyncStorage,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import NewsScreen from './Screens/News';
import Icons from 'react-native-vector-icons/dist/Ionicons.js';
import ProfileScreen from './Profile/Profile';
import firebase from 'firebase';
import LoginScreen from './Profile/LoginHome';
import ChatList from './ChatRoom/chatlist';
const Tab = createMaterialBottomTabNavigator();

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userindex: props.route.params.userindex || false,
      index: 0,
      data: {
        username: 'Minh Nguyễn',
        gender: 'Male',
        dob: '22/06/1998',
        address: 'Quận 7',
      },
    };
  }
  // async componentDidMount() {
  //   firebase.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       this.setState({
  //         userindex: true,
  //       });
  //     } else {
  //       this.setState({
  //         userindex: false,
  //       });
  //     }
  //   });
  // }
  componentDidMount() {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('rgba(0,0,0,0)');
    StatusBar.setTranslucent(true);
    if (this.state.userindex == true) {
      const {currentUser} = firebase.auth();
      firebase
        .database()
        .ref('users/' + currentUser.uid)
        .once('value')
        .then(async (snapshoot) => {
          console.log(snapshoot.val());
          if (snapshoot.val() == null || snapshoot.val() == undefined) {
            this.props.navigation.navigate('Initprofile');
          }
        });
    }
  }
  render() {
    return (
      <Tab.Navigator
        initialRouteName="News"
        shifting={true}
        sceneAnimationEnabled={true}>
        <Tab.Screen
          data={this.state.data.username}
          name="News"
          //component={NewsScreen}
          options={{
            tabBarColor: '#0034FA',
            tabBarLabel: 'News',
            tabBarIcon: ({color, size}) => (
              <Icons name="newspaper-outline" color={'#ffffff'} size={26} />
            ),
          }}>
          {() => (
            <NewsScreen {...this.props} userindex={this.state.userindex} />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Profile"
          //children={}
          //component={this.state.userindex ? ProfileScreen : LoginScreen}
          options={{
            tabBarColor: '#1ABC9C',
            tabBarLabel: 'Profile ',
            tabBarIcon: ({color, size}) => (
              <Icons name="body-outline" color={'#ffffff'} size={26} />
            ),
          }}>
          {() => (
            <Checklogin {...this.props} userindex={this.state.userindex} />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="ChatList"
          options={{
            tabBarColor: '#8e44ad',
            tabBarLabel: 'Message ',
            tabBarIcon: ({color, size}) => (
              <Icons name="chatbubbles-outline" color={'#ffffff'} size={26} />
            ),
          }}>
          {() => <ChatList {...this.props} />}
        </Tab.Screen>
      </Tab.Navigator>
    );
  }
}
function Checklogin(props) {
  return props.userindex ? (
    <ProfileScreen {...props} />
  ) : (
    <LoginScreen {...props} />
  );
}

export default HomeScreen;
