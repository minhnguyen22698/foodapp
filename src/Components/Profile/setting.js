import React, {Component} from 'react';
import {
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import firebase from 'firebase';
import i18n from '../i18n';
import Header from '../Header/HeadergoBack';
class Setting extends Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('rgba(0,0,0,0)');
    StatusBar.setTranslucent(true);
  }
  onLogOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.navigation.pop();
      });
  };
  onChangeLang = () => {
    i18n.changeLanguage(i18n.language == 'en' ? 'vi' : 'en').then(() => {
      this.setState({
        isChange: true,
      });
    });
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, height: null}}>
        <Header title={i18n.t('setting')} onGoBack={()=>{this.props.navigation.goBack()}} />
        <TouchableOpacity
          delayPressIn={200}
          style={s.item}
          onPress={this.onChangeLang}>
          <Text style={s.itemtext}>{i18n.t('changelang')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          delayPressIn={200}
          style={s.item}
          onPress={this.onLogOut}>
          <Text style={s.itemtext}>{i18n.t('logout')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
const s = StyleSheet.create({
  item: {
    margin: 1,
    padding: 20,
    backgroundColor: 'silver',
  },
  itemtext: {
    fontSize: 15,
  },
});
export default Setting;
