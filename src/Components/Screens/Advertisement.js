import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width: WIDTH } = Dimensions.get('window');

function renderAdvCard(props) {
    const { image } = props;
    return (
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={props.onPress}>
            <View style={{ flex: 1, elevation: 3, height: 250 }}>
                <Image style={styles.img} source={{ uri: `${image}` }}></Image>
            </View>
        </TouchableOpacity>
    );
}
export default renderAdvCard;
const styles = StyleSheet.create({
    container: {
        width: WIDTH,
        backgroundColor: 'transparent',
        height: '100%',
        padding: 10
    },
    img: {
        width: '100%',
        height: '100%',
        borderRadius: 10
    },
});
