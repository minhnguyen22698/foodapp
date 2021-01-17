import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {View} from 'react-native';
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
import './i18n';

const Stack = createStackNavigator();

class Nav extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <NavigationContainer>
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
            options={{
              headerShown: false,
            }}
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
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
export default Nav;
