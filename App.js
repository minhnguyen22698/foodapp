/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper'
import Nav from './src/Components/navigationstack'
import firebase from './src/Components/firebaseconfig'
class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      isloading: true
    }
  }
  render() {
    return (
      <PaperProvider>
          <Nav />
      </PaperProvider>
    )

  }
}


export default App;
