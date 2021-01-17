import React, { Component } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RenderDetailCard from './renderDetailCard';
// import avatarMinh from '../../Assets/Pictures/avatarMinh.jpg';
// import picture from '../../Assets/Pictures/HookTheHead.jpg';
// import RenderNewsCard from './renderNewsCard';
// import firebase from 'firebase';

class Detail extends Component {
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
            discription: this.props.route.params.detail_data,
        }
    }
    async componentDidMount() {
        this.setState({
            post_profile: await this.props.route.params.post_data,
        })
    }
    render() {
        return (
            <SafeAreaView>
                <ScrollView>
                    {/* <TouchableOpacity onPress={this.testClick}>
                        <Text>{this.state.discription[1].fooddetail.name}
                        </Text>
                    </TouchableOpacity> */}
                    <RenderDetailCard
                        profile={this.state.post_profile}
                        discription={this.state.discription}
                    />
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default Detail