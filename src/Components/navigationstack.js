import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {View, StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './Profile/LoginHome';
import HomeScreen from './HomeScreen';
import Registry from './Registry';
import {NavigationContainer} from '@react-navigation/native';
import Forgot from './Forgotpassword';
import Addnew from './NewsSceen/addnew';
import Profile from './Profile/Profile';
import SplashScreen from './splashscreen';
import Detail from './Screens/Detail';
import Setting from './Profile/setting';
import Edit from './Profile/editprofile';
import InitProfile from './Profile/initProfile';
import ProfileGuest from './Screens/ProfileGuest'
import ChatRoom from './ChatRoom/chatroom'
import './i18n';

const Stack = createStackNavigator();

class Nav extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <NavigationContainer
        // onStateChange={() => {
        //   StatusBar.setBarStyle('dark-content')
        //   StatusBar.setBackgroundColor('rgba(0,0,0,0)')
        //   StatusBar.setTranslucent(true)
        // }}
        >
        <Stack.Navigator
          initialRouteName={'splash'}
          mode="modal"
          headerMode="none">
          <Stack.Screen
            name="splash"
            options={{
              headerShown: false,
            }}
            component={SplashScreen}
          />
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
            }}
            component={Login}
          />
          <Stack.Screen
            name="registry"
            options={{
              headerStyle: {
                backgroundColor: '#20ACF9',
              },
            }}
            component={Registry}
          />
          <Stack.Screen
            name="Home Screen"
            options={{}}
            component={HomeScreen}
          />
          <Stack.Screen
            name="forgotpassword"
            options={{
              headerStyle: {
                backgroundColor: '#20ACF9',
              },
            }}
            component={Forgot}
          />
          <Stack.Screen
            name="addnew"
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: '#20ACF9',
              },
            }}
            component={Addnew}
          />
          <Stack.Screen
            name="profile"
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: '#20ACF9',
              },
            }}
            component={Profile}
          />
          <Stack.Screen
            name="Detail"
            options={{
              headerShown: false,
            }}
            component={Detail}
          />
          <Stack.Screen
            name="Setting"
            options={{
              headerShown: false,
            }}
            component={Setting}
          />
          <Stack.Screen
            name="Editprofile"
            options={{
              headerShown: false,
            }}
            component={Edit}
          />
          <Stack.Screen
            name="Initprofile"
            options={{
              headerShown: false,
            }}
            component={InitProfile}
          />
          <Stack.Screen
          name="Guest"
          component={ProfileGuest}
          />
          <Stack.Screen
          name="ChatRoom"
          component={ChatRoom}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
export default Nav;
