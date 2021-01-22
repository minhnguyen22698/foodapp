import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  Image,
  Text,
  Animated,
  Easing,
} from 'react-native';
import splash from '../Assets/splash.png';
import bg from '../Assets/bgsplash.jpg';
import {ActivityIndicator, Colors} from 'react-native-paper';
import firebase from 'firebase'

class Spalshcreen extends Component {
  constructor(props) {
    super(props);
    this.state={
      islogin:false
    }
    this.animated = new Animated.Value(0);
  }
  async componentDidMount() {
    //using timing
    const data = await this.performTimeConsumingTask();
    if (data !== null) {
      firebase.auth().onAuthStateChanged((user)=>{
        if(user){
          this.props.navigation.replace('Home Screen',{userindex:true});
        }
        else{
          this.props.navigation.replace('Home Screen',{userindex:false});
        }
      })
         
    }
  }
  performTimeConsumingTask = async () => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve('result');
      }, 2000),
    );
  };
  render() {
    return (
      <ImageBackground
        source={bg}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View>
          <Image
            style={{width: 200, height: 200, resizeMode: 'center'}}
            source={splash}></Image>
          <ActivityIndicator animating={true} color={Colors.red800} />
        </View>
      </ImageBackground>
    );
  }
}

export default Spalshcreen;
