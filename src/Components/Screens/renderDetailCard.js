import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, FlatList, SafeAreaView } from 'react-native';
import { Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Right } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

const DISCRIPTION = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'Nguyên liệu:',
        content: [
            {
                content: 'Hành, gừng, tỏi',
            },
        ],
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Các bước thực hiện:',
        content: [
            {
                key: 1,
                title: 'Bước 1:',
                content: 'cắt hành, gừng, tỏi nhuyễn',
            },
            {
                key: 2,
                title: 'Bước 2:',
                content: 'xào tỏi dến khi vàng đều có mùi thơm',
            },
            {
                key: 3,
                title: 'Bước 3:',
                content: 'gừng đăm nhuyễn cùng với hành',
            },
        ]
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Note:',
        content: [
            {
                content: 'cẩn thận đứt tay',
            },
        ],
    },
];
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
            discriptions: this.props.discription,
        }
    }
    testClick = () => {
        console.log(this.state.discriptions)
    }
    render() {
        const Item = ({ title, content }) => (
            <View style={styles.container}>
                <Text>{title}</Text>
                <View>
                    <Text>{content}</Text>
                </View>
            </View>
        );
        const renderItem = ({ item }) => (
            <View style={styles.container}>
                <View style={{ padding: 5 }}>
                    <Text style={{ fontSize: 15 }}>{item.title}</Text>
                </View>
                <View style={{ paddingLeft: 15 }}>
                    {item.content.map((index) =>
                        <View>
                            <Text style={{ fontSize: 15 }}>{index.title} {index.content}</Text>
                        </View>
                    )}
                </View>
            </View>
        );
        return (
            <View style={styles.container}>
                <Content>
                    <Card>
                        <Text style={{color:'#000000',backgroundColor:'red'}}>{this.props.name}</Text>
                        {/* <CardItem>
                            <Left>
                                <Thumbnail source={this.props.profile.user_picture} />
                                <Body>
                                    <Text>{this.props.profile.user_name}</Text>
                                    <Text note>{this.props.profile.post_date}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Image source={this.props.profile.post_picture} style={{ height: 200, width: "100%", flex: 1 }} />
                                <Text>{this.state.discriptions.name}</Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Button transparent textStyle={{ color: '#87838B' }}>
                                    <Icon active name="chatbubbles" />
                                    <Text>{this.props.profile.comments_count} comments</Text>
                                </Button>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <FlatList
                                data={DISCRIPTION}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                            />
                        </CardItem> */}
                    </Card>
                </Content>
            </View>
        )
    }
}
export default Detail
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})