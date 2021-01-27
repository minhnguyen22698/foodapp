import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  ImageBackground,
  ToastAndroid,
  Platform,
  LogBox,
  StatusBar
} from 'react-native';
import {Modal, Portal} from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/Ionicons';
// import SplashScreen from 'react-native-splash-screen'
import firebase from 'firebase'
import fire from '../firebaseconfig'
import background_image from '../../Assets/bg.png';
import Spinner from 'react-native-spinkit';
import i18n from '../i18n';

const {width: WIDTH} = Dimensions.get('window');

class App extends Component {
  constructor() {
    super();
    // this.translateX = new Animated.Value(0)
    // this.translateY = new Animated.Value(0)
    // this.onGestureEvent = Animated.event([
    //     {
    //         nativeEvent: {
    //             translationX: this.translateX,
    //             translationY: this.translateY,
    //         }
    //     }
    // ]);
    this.state = {
      email: '',
      password: '',
      showPass: true,
      press: false,
      isLoading: false,
      // fade: new Animated.Value(0)
    };
  }
  updateInputVal = (key) => (e) => {
    this.setState({
      [key]: e,
    });
  };
  showPass = () => {
    if (this.state.press == false) {
      this.setState({showPass: false, press: true});
    } else {
      this.setState({showPass: true, press: false});
    }
  };

  onRegistry = () => {
    this.props.navigation.navigate('registry');
  };

  componentDidMount() {
    LogBox.ignoreAllLogs()
    StatusBar.setBackgroundColor('rgba(0,0,0,0)');
    StatusBar.setTranslucent(true);
  }
  onForgotPassword = () => {
    this.props.navigation.navigate('forgotpassword');
  };

  btnlogin_click = () => {
    this.setState({
      isLoading: true,
    });
    fire
      .auth()
      .signInWithEmailAndPassword(
        this.state.email.trim(),
        this.state.password.trim(),
      )
      .then(  (res) => {
        firebase
          .database()
          .ref('users/' + res.user.uid)
          .once('value')
          .then(async (snapshoot) => {
            if (snapshoot.val() == null || snapshoot.val() == undefined) {
              this.props.navigation.navigate('Initprofile')
            }
            else{
               //console.log(Object.values(snapshoot.val()))
            }
          });
        // this.props.navigation.navigate('profile')
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        ToastAndroid.show(`${error}`, ToastAndroid.SHORT);
      });
    // this.props.navigation.navigate('Home Screen')
  };
  // onClick = () => {
  //     this.translateX.setValue(25)
  //     console.log(this.translateX)
  //     this.fadein()
  // }
  // fadein = () => {
  //     Animated.timing(this.state.fade, {
  //         toValue: 5,
  //         duration: 1000,
  //     }).start()
  // }
  render() {
    return (
      // <ImageBackground source={background_image} style={styles.backgroundcontainer}>
      //     <View style={styles.titlecontainer}>
      //         <Text style={styles.title}>S{"\n"}I{"\n"}G{"\n"}N</Text>
      //         <Text style={styles.title}>I{"\n"}N</Text>
      //     </View>
      //     <PanGestureHandler onGestureEvent={this.onGestureEvent}>
      //         <Animated.View style={[styles.box, {
      //             opacity: this.state.fade
      //         },
      //             // {
      //             //     transform: [{
      //             //         translateY: this.translateY,
      //             //      },{
      //             //          translateX: this.translateX
      //             //      }],
      //             // },
      //         ]}
      //         />

      //     </PanGestureHandler>
      //     <View style={styles.buttoncontainer}>
      //         <TouchableOpacity style={styles.button} onPress={this.onClick} >
      //             <Text style={styles.buttontilte}>LOGIN WITH EMAIL</Text>
      //         </TouchableOpacity>
      //         <TouchableOpacity style={styles.button}>
      //             <Text style={styles.buttontilte}>CREATE ACCOUNT</Text>
      //         </TouchableOpacity>
      //     </View>
      // </ImageBackground>
      <ImageBackground
        source={background_image}
        style={styles.backgroundcontainer}>
        <View style={styles.inputcontainer}>
          <TextInput
            style={styles.input}
            value={this.state.email}
            onChangeText={this.updateInputVal('email')}
            placeholder={'Email'}
          />
          <TextInput
            value={this.state.password}
            onChangeText={this.updateInputVal('password')}
            placeholder={'Password'}
            style={styles.input}
          />
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
        <View style={styles.buttoncontainer}>
          <TouchableOpacity style={styles.button} onPress={this.btnlogin_click}>
            <Text>{i18n.t('login')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.onRegistry}>
            <Text>Registry</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundcontainer: {
    flex: 2,
    width: null,
    height: null,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  titlecontainer: {
    flex: 2,
    marginRight: '30%',
    flexDirection: 'row',
  },
  title: {
    fontSize: 70,
    color: '#ffffff',
    marginTop: 20,
    marginRight: 20,
  },
  buttoncontainer: {
    flex: 3,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#1ABC9C',
    width: WIDTH - 100,
    height: 60,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttontilte: {
    fontSize: 25,
    color: '#ffffff',
  },
  box: {
    height: 100,
    width: 100,
    backgroundColor: 'red',
  },
  inputcontainer: {
    flex: 4,
    justifyContent: 'flex-end',
    marginBottom: 50,
  },
  input: {
    backgroundColor: '#ffffff',
    width: WIDTH - 55,
    borderRadius: 25,
    fontSize: 20,
    color: 'black',
    marginTop: 25,
  },
});
export default App;
