import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
  Image,
  ToastAndroid,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import {
  TextInput,
  Button,
  DefaultTheme,
  Modal,
  Portal,
} from 'react-native-paper';
import firebase from './firebaseconfig';
import Spinner from 'react-native-spinkit';

const {width: WIDTH} = Dimensions.get('window');
const {height: HEIGHT} = Dimensions.get('window');
import {Provider as PaperProvider} from 'react-native-paper';
import {Row, Root, Toast, Item, Label, Input} from 'native-base';
import Icons from 'react-native-vector-icons/dist/Ionicons';
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#20ACF9',
    background: '#ffffff',
  },
};

export default class Registry extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      repassword: '',
      showpass:false,
      isLoading: false,
    };
  }
  handleChangeInput = (key) => (e) => {
    this.setState({
      [key]: e,
    });
  };
  onShowPass=()=>{
      this.setState({
          showpass:!this.state.showpass
      })
  }
  onSubmit = () => {
    if (this.state.email !== '' && this.state.password !== '') {
      if (this.state.password === this.state.repassword) {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(this.state.email) === true) {
          this.setState({
            isLoading: true,
          });
          console.log(this.state.email + '-' + this.state.password);
          firebase
            .auth()
            .createUserWithEmailAndPassword(
              this.state.email,
              this.state.password,
            )
            .then((res) => {
              console.log(res);
              this.setState({
                isLoading: false,
              });
              // console.log(`${this.state.email} logged-in successfully!`)
            })
            .catch((error) =>
              Platform.OS == 'android'
                ? ToastAndroid.show(error.message)
                : null,
            );
        } else {
          Toast.show({
            text: 'Invalid email ',
            buttonText: 'Got it !',
            style: 'danger',
            position: 'top',
          });
        }
      } else {
        Toast.show({
          text: 'Password does not match',
          buttonText: 'Got it !',
          style: 'danger',
          position: 'top',
        });
      }
    } else {
      Toast.show({
        text: 'Email & Password is invalid',
        buttonText: 'Got it !',
        type: 'danger',
        position: 'top',
      });
    }
  };
  onCacel = () => {
    this.props.navigation.goBack();
  };
  render() {
    return (
      <Root>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={{fontSize: 30}}>Join our world</Text>
          </View>
          <View style={styles.InputContainer}>
          <View style={{flexDirection: 'row'}}>
              <Item stackedLabel style={{flex:1}}>
                <Label>Email</Label>
                <Input value={this.state.email} onChangeText={this.handleChangeInput('email')}/>
              </Item>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Item stackedLabel style={{flex:1}}>
                <Label>Password</Label>
                <Input secureTextEntry={!this.state.showpass} value={this.state.password} onChangeText={this.handleChangeInput('password')} />
              </Item>
              <View style={{justifyContent:'flex-end'}}>
                <Icons onPress={this.onShowPass} name={this.state.showpass?"eye-outline":'eye-off-outline'} size={26} />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Item stackedLabel style={{flex:1}}>
                <Label>Confirm password</Label>
                <Input secureTextEntry={!this.state.showpass} value={this.state.repassword} onChangeText={this.handleChangeInput('repassword')} />
              </Item>
              <View style={{justifyContent:'flex-end'}}>
              <Icons onPress={this.onShowPass} name={this.state.showpass?"eye-outline":'eye-off-outline'} size={26} />
              </View>
            </View>
            <Portal>
              <Modal
                visible={this.state.isLoading}
                contentContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Spinner size={50} type="ChasingDots" color="#1ABC9C" />
              </Modal>
            </Portal>
          </View>
          <View style={styles.BtnContainer}>
            <TouchableOpacity
              style={styles.btncancel}
              activeOpacity={1}
              onPress={this.onCacel}>
              <Text>Cancle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnsubmit}
              activeOpacity={1}
              onPress={this.onSubmit}>
              <Text>Confirm</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Root>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: null,
    width: null,
  },
  header: {
    flex: 4 / 10,
    height: null,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  InputContainer: {
    flex: 4 / 10,
    width: WIDTH - 55,
    justifyContent: 'flex-end',
    backgroundColor: '#ffffff',
  },
  BtnContainer: {
    flex: 3 / 10,
    justifyContent: 'flex-start',
    marginTop: 20,
    position: 'relative',
    flexDirection: 'row',
  },
  Input: {},
  btnsubmit: {
    margin: 5,
    backgroundColor: '#20ACF9',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH / 2 - 30,
    right: 0,
  },
  btncancel: {
    margin: 5,
    backgroundColor: '#20ACF9',
    height: 50,
    justifyContent: 'center',
    width: WIDTH / 2 - 30,
    alignItems: 'center',
    left: 0,
  },
});
