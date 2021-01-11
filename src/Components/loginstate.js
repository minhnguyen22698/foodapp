import React,  { Component } from 'react'
import {View} from 'react-native'
import firebase from 'firebase'

export default class loading extends Component{
    componentDidMount(){
        firebase.auth().onAuthStateChanged(user=>{
            this.props.navigation.navigate(user? 'profile':'login')
        })
    }
    render(){
        return(
            <View></View>
        )
    }
}