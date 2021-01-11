import React, { Component } from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet, View, AsyncStorage } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import NewsScreen from './Screens/News'
import Icons from 'react-native-vector-icons/dist/Ionicons.js'
import ProfileScreen from './Profile/Profile'
import LoginState from './loginstate'
import firebase from 'firebase'
const Tab = createMaterialBottomTabNavigator()

class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0,
            data:{
                username: 'Minh Nguyễn',
                gender: 'Male',
                dob:'22/06/1998',
                address:'Quận 7'
            }
        }
    }
    async componentDidMount() {
        firebase.auth().onAuthStateChanged(user=>{
            console.log(user)
        })
        try {
            await AsyncStorage.setItem('username', JSON.stringify(this.state.data))
        }
        catch (err) {
            console.log(err)
        }
    }
    render() {
        return (
            <Tab.Navigator initialRouteName="News"
                shifting={true}
                sceneAnimationEnabled={true}>
                <Tab.Screen
                    data={this.state.data.username}
                    name="News" component={NewsScreen}
                    options={{
                        tabBarColor: '#0034FA',
                        tabBarLabel: 'news',
                        tabBarIcon: ({ color, size }) => (
                            <Icons name="newspaper-outline" color={'#ffffff'} size={26} />
                        )
                    }}
                />
                <Tab.Screen name="Profile" component={LoginState}
                    options={{
                        tabBarColor: '#1ABC9C',
                        tabBarLabel: 'profile ',
                        tabBarIcon: ({ color, size }) => (
                            <Icons name="body-outline" color={'#ffffff'} size={26} />
                        )
                    }}
                />
            </Tab.Navigator>
        )
    }
}

export default HomeScreen

const S = StyleSheet.create({

})
