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

class Spalshcreen extends Component {
  constructor(props) {
    super(props);
    this.animated = new Animated.Value(0);
  }
  async componentDidMount() {
    //using timing

    const data = await this.performTimeConsumingTask();
    if (data !== null) {
      this.props.navigation.navigate('Home Screen')
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
