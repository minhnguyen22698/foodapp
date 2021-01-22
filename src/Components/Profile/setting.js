import React,{Component} from 'react';
import {View,Text,TouchableOpacity, SafeAreaView} from 'react-native'
import firebase from 'firebase'
class Setting extends Component{
    constructor(props){
        super(props)

    }
    onLogOut=()=>{
        firebase
        .auth()
        .signOut()
        .then(() => {
            this.props.navigation.pop()
        });
    }
    render(){
        return(
            <SafeAreaView style={{flex:1,height:null}}>
                <Text>
                    Setting
                </Text>
                <TouchableOpacity onPress={this.onLogOut}><Text>Log out</Text></TouchableOpacity>
            </SafeAreaView>
        )
    }
}
export default Setting

