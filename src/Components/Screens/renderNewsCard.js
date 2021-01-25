import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {
  Content,
  Card,
  CardItem,
  Thumbnail,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler';

const {width: WIDTH} = Dimensions.get('window');

function renderNewsCard(props) {
  const {image, setImage} = props;
  const {name, setName} = props;
  return (
    <TouchableOpacity style={styles.container} delayPressIn={200} onPress={props.onPress}>
      <View style={styles.textcontainer}>
        <View style={styles.text}>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
      <View style={styles.imgcontainer}>
        <Image style={styles.img} source={{uri: `${image}`}}></Image>
      </View>
    </TouchableOpacity>
  );
}
export default renderNewsCard;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: WIDTH,
    backgroundColor:'transparent',
    margin:20
  },
  background: {
    flex: 1,
    height: 100,
    width: 100,
  },
  imgcontainer: {
    flex: 1 / 3,
    backgroundColor: 'black',
    alignItems: 'flex-end',
  },
  img: {
    width: '100%',
    height: 100,
    resizeMode:'stretch'
  },
  textcontainer: {
    flex: 2 / 3,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    height:'80%',
    justifyContent:'center',
    paddingLeft:25,
    backgroundColor: "white",
    shadowColor: "rgba(184,181,181,1)",
    shadowOffset: {
      height: 5,
      width: 5
    },
    elevation: 75,
    shadowOpacity: 1,
    shadowRadius: 25,
    overflow: "visible",
    borderTopLeftRadius: 33,
    borderBottomLeftRadius: 33,
  },
});
