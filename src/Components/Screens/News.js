import React, { Component } from 'react';
import { View, StyleSheet, Text, StatusBar, Image, ScrollView } from 'react-native';
import { Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Right } from 'native-base';
import avatar from '../../Assets/Pictures/Avatar.jpg';
import avatarMinh from '../../Assets/Pictures/avatarMinh.jpg';
import picture from '../../Assets/Pictures/HookTheHead.jpg';
import { State, TouchableOpacity } from 'react-native-gesture-handler';
import i18n from '../i18n';

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
                post_detail: '',
                stars_count: '',
                post_date: '',
            },
        }
    }
    componentDidMount() {
        this.setState({
            post_profile: {
                user_picture: avatarMinh,
                user_name: 'Minh Nguyễn',
                post_picture: picture,
                post_time: '5m',
                likes_count: '15',
                post_detail: 'Món ngon mỗi ngày',
                stars_count: '25',
                post_date: '01/12/2020',
            },
        })
    }
    showDetail = () => {
        // this.props.navigation.navigate("Detail", {
        //     post_data: this.state.post_profile
        // });
    }
    render() {
        return (
            // <ScrollView>
            //     <View style={styles.container}>
            //         <Content>
            //             <Card>
            //                 <CardItem>
            //                     <Left>
            //                         <Thumbnail source={this.state.post_profile.user_picture} />
            //                         <Body>
            //                             <Text>{i18n.t('login')}</Text>
            //                         </Body>
            //                     </Left>
            //                 </CardItem>
            //                 <CardItem cardBody>
            //                     <View style={styles.container}>
            //                         <TouchableOpacity onPress={this.showDetail}>
            //                             <Image source={this.state.post_profile.post_picture} style={{ height: 200, width: null, flex: 1 }} />
            //                         </TouchableOpacity>
            //                     </View>
            //                 </CardItem>
            //                 <CardItem>
            //                     <Left>
            //                         <Button transparent>
            //                             <Icon active name="thumbs-up" />
            //                             <Text>{this.state.post_profile.likes_count} likes</Text>
            //                         </Button>
            //                     </Left>
            //                     {/* <Body>
            //                         <Button transparent>
            //                             <Icon active name="chatbubbles" />
            //                             <Text>{this.state.post_profile.comments_count} comments</Text>
            //                         </Button>
            //                     </Body> */}
            //                     <Right>
            //                         <Text>{this.state.post_profile.post_time}ago</Text>
            //                     </Right>
            //                 </CardItem>
            //             </Card>
            //         </Content>
            //     </View>
            // </ScrollView>
            <View>
                <Text>{i18n.t('login')}</Text>
            </View>
        )
    }
}

export default News

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
    tinyLogo: {
        width: 50,
        height: 50,
    },
})