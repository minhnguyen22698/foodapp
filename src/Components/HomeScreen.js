import React, { Component } from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet, View, AsyncStorage } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import NewsScreen from './Screens/News'
import Icons from 'react-native-vector-icons/dist/Ionicons.js'
import ProfileScreen from './Profile/Profile'
import firebase from 'firebase'
import LoginScreen from './Profile/LoginHome'
const Tab = createMaterialBottomTabNavigator()

class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userindex:false,
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
        await AsyncStorage.setItem('username', JSON.stringify(this.state.data))
        firebase.auth().onAuthStateChanged(user=>{
            if(user)
            {
                this.setState({
                    userindex: true
                })
            }else{
                this.setState({
                    userindex:false
                })
            }
        })
    }
    // componentDidUpdate(){
    //     firebase.auth().onAuthStateChanged(user=>{
    //         if(user)
    //         {
    //             this.setState({
    //                 userindex: true
    //             })
    //         }else{
    //             this.setState({
    //                 userindex:false
    //             })
    //         }
    //     })
    // }
    render() {
        return (
            <Tab.Navigator initialRouteName="Profile"
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
                <Tab.Screen name="Profile" component={(this.state.userindex? ProfileScreen: LoginScreen)}
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

const S = StyleSheet.create({

})

export default HomeScreen
