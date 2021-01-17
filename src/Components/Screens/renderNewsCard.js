import React, { Component } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Right } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

class renderNewsCard extends Component {
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
            detail: this.props.detail,
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Content>
                    <Card>
                        <CardItem>
                            <Left>
                                <Thumbnail source={this.props.profile.user_picture} />
                                <Body>
                                    <Text>{this.props.profile.user_name}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem cardBody>
                            <View style={styles.container}>
                                <TouchableOpacity onPress={this.props.click}>
                                    <Image source={this.props.profile.post_picture} style={{ height: 200, width: null, flex: 1 }} />
                                </TouchableOpacity>
                            </View>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Button transparent>
                                    <Icon active name="thumbs-up" />
                                    <Text>{this.props.profile.likes_count} likes</Text>
                                </Button>
                            </Left>
                            <Body>
                                <Button transparent>
                                    <Icon active name="chatbubbles" />
                                    <Text>{this.props.profile.comments_count} comments</Text>
                                </Button>
                            </Body>
                            <Right>
                                <Text>{this.props.profile.post_time} ago</Text>
                            </Right>
                        </CardItem>
                    </Card>
                </Content>
            </View>
        )
    }
}
export default renderNewsCard
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})