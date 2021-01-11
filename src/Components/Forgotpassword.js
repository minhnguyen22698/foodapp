import React, { Component } from 'react';
import { ImageBackground, View, StyleSheet, Dimensions, Text, TextInput } from 'react-native';
import { Button } from 'react-native-paper'
import bg from '../Images/background/bg.png'
import firebase from './firebaseconfig'

const { width: WIDTH } = Dimensions.get('window')
class Forgot extends Component {
    constructor(props) {
        super(props)
        this.onSubmit=this.onSubmit.bind(this)
        this.state = {
            email: ''
        }
    }
    handleChangeInput = (key) => (e) => {
        this.setState({
            [key]: e
        })
        console.log(e)
    }
    async onSubmit() {
        if (this.state.email !== '') {
            try {
                await firebase.auth().sendPasswordResetEmail(this.state.email)
                console.log('Send email successfully')
            }
            catch(error){console.log(error)}
        }
        else {
            console.log("Input email")
        }
        console.log('Clicked')

    }

    render() {
        return (
            <View style={s.container}>
                <Text style={s.text}>Don`t be worry</Text>
                <TextInput
                    style={s.inputText}
                    underlineColorAndroid={"#Ff0000"}
                    value={this.state.email}
                    onChangeText={this.handleChangeInput('email')}
                    placeholder={'Input your email here'}></TextInput>
                <Button
                    style={s.buttonSubmit}
                    onPress={this.onSubmit}>Submit</Button>
            </View>
        )
    }
}
const s = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center'
    },
    imagecontanier: {
        flex: 4 / 10,
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: 'center'
    },
    text: {
        flex: 2 / 10,
        fontSize: 30,
    },
    inputText: {
        width: WIDTH - 55,
        fontSize: 30,
    },
    buttonSubmit: {
        flex: 3 / 10,
        marginTop: 20

    }
})
export default Forgot