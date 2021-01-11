import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, Image, ToastAndroid, Platform } from 'react-native'
import { TextInput, Button, DefaultTheme, Modal, Portal} from 'react-native-paper';
import firebase from './firebaseconfig'
import Spinner from 'react-native-spinkit'

const { width: WIDTH } = Dimensions.get('window')
const { height: HEIGHT } = Dimensions.get('window')
import { Provider as PaperProvider } from 'react-native-paper'

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#20ACF9',
        background: '#ffffff'
    },
};

export default class Registry extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            password: '',
            repassword: '',
            isLoading: false,
        }
    }
    handleChangeInput = (key) => (e) => {
        this.setState({
            [key]: e
        })
    }
    onSubmit = () => {
        this.setState({
            isLoading: true
        })
        console.log(this.state.email + "-" + this.state.password)
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((res) => {
                console.log(res)
                this.props.navigation.navigate('login');
                if (Platform.OS == 'android') { ToastAndroid.show('Register success', ToastAndroid.SHORT) }
                // console.log(`${this.state.email} logged-in successfully!`)
            })
            .catch(error => (
                Platform.OS == 'android' ? ToastAndroid.show(error.message) : null
            ))
    }
    onCacel = () => {
        console.log('Clicked')
        this.props.navigation.goBack()
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 30 }}>Join our world</Text>
                </View>
                <View style={styles.InputContainer}>
                    <PaperProvider theme={theme}>
                        <TextInput
                            mode='outlined'
                            label="Email"
                            value={this.state.email}
                            style={styles.Input}
                            onChangeText={this.handleChangeInput('email')}
                        />
                        <TextInput
                            mode='outlined'
                            label="Password"
                            style={styles.Input}
                            value={this.state.password}
                            onChangeText={this.handleChangeInput('password')}
                        />
                        <TextInput
                            mode='outlined'
                            label="Confirm Password"
                            style={styles.Input}
                            value={this.state.repassword}
                            onChangeText={this.handleChangeInput('repassword')}
                        />
                        <View style={styles.BtnContainer}>
                            <Button style={styles.btncancel} mode='contained' onPress={this.onCacel}>Cancel</Button>
                            <Button style={styles.btnsubmit} mode='contained' onPress={this.onSubmit}>Sign In</Button>
                        </View>
                      
                    </PaperProvider>
                    <Portal>
                        <Modal
                            visible={this.state.isLoading}
                            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', }}
                        >
                            <Spinner
                                size={50}
                                type="ChasingDots"
                                color="#1ABC9C"
                            />
                        </Modal>
                    </Portal>
                </View>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
        // width: WIDTH-55,
    },
    header: {
        flex: 2 / 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    InputContainer: {
        flex: 5 / 10,
        width: WIDTH - 55,
        justifyContent: 'flex-end',
        backgroundColor: '#ffffff',
        marginBottom: 50,
    },
    BtnContainer: {
        flex: 3 / 10,
        justifyContent: 'flex-start',
        marginTop: 20,
    },
    Input: {

    },
    btnsubmit: {
        backgroundColor: '#20ACF9',
        height: 50,
        justifyContent: "center",
        position: 'absolute',
        width: WIDTH / 2 - 30,
        right: 0
    },
    btncancel: {
        backgroundColor: '#20ACF9',
        height: 50,
        justifyContent: "center",
        position: 'absolute',
        width: WIDTH / 2 - 30,
        left: 0
    }

})