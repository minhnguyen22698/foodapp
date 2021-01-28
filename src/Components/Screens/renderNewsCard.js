import React, { Component } from 'react';
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
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width: WIDTH } = Dimensions.get('window');

function renderNewsCard(props) {
  const { image, setImage } = props;
  const { name, setName } = props;
  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={props.onPress}>
      <View style={{ width: '100%' }}>
        <View style={styles.imgcontainer}>
          <Image style={styles.img} source={{ uri: `${image}` }}></Image>
        </View>
        <View style={styles.textcontainer}>
          <View style={styles.text}>
            <Text style={styles.name}>{name}</Text>
          </View>
        </View>
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
    paddingTop: 5,
    padding: 5,
  },
  background: {
    flex: 1,
    height: 100,
    width: 100,
  },
  imgcontainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  img: {
    width: '100%',
    height: 200,
    resizeMode: 'stretch',
  },
  textcontainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    height: '100%',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: "white",
    overflow: "visible",
  },
});
