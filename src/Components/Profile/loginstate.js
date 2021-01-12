import React,  { Component } from 'react'
import {View} from 'react-native'
import firebase from 'firebase'

 class State extends Component{
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
export default State