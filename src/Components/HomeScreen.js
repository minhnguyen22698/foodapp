import React, { Component } from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet, View, AsyncStorage } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import NewsScreen from './Screens/News'
import Icons from 'react-native-vector-icons/dist/Ionicons.js'
import ProfileScreen from './Screens/Profile'
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
        console.log(this.props.route.params.testing)
        try {
            await AsyncStorage.setItem('username', JSON.stringify(this.state.data))
        }
        catch (e) {
            console.log(e)
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
                <Tab.Screen name="Profile" component={ProfileScreen}
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
