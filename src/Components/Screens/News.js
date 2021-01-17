import React, { Component } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import avatarMinh from '../../Assets/Pictures/avatarMinh.jpg';
import picture from '../../Assets/Pictures/HookTheHead.jpg';
import RenderNewsCard from './renderNewsCard';
import firebase from 'firebase';
import { ThemeProvider } from '@react-navigation/native';

class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post_profile: {
                user_picture: '',
                user_name: '',
                post_picture: '',
                post_time: '',
                likes_count: '',
                comments_count: '',
                post_date: '',
            },
            post_detail: [],
        }
    }
    componentDidMount() {
        this.setState({
            post_profile: {
                user_picture: avatarMinh,
                user_name: 'Minh Nguyễn',
                post_picture: picture,
                post_time: '5m',
                likes_count: 15,
                comments_count: 5,
                post_date: '01/12/2020',
            },
            post_detail: this.readNewsData(),
        });
    }
    showDetail = () => {
        this.props.navigation.navigate("Detail", {
            post_data: this.state.post_profile,
            detail_data: this.state.post_detail[1].fooddetail,
        });
        console.log(this.state.post_detail[1].fooddetail)
    }
    readNewsData() {
        firebase.database().ref('data/').once('value', (snapshot) => {
            const dataNews = Object.values(snapshot.val())
            if (snapshot.val() !== null && snapshot.val() !== undefined) {
                this.setState({
                    post_detail: dataNews
                })
            } else {
                console.log('err')
            }
        });
    }
    render() {
        return (
            <SafeAreaView>
                <ScrollView>
                    <RenderNewsCard
                        profile={this.state.post_profile}
                        detail={this.state.detail_data}
                        click={this.showDetail} />
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default News