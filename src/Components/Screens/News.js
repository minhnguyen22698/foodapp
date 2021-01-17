import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  LogBox,
  Text,
  View,
  FlatList,
  Image,
  Dimensions
} from 'react-native';
import {
  Content,
  Card,
  CardItem,
  Thumbnail,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';
import avatarMinh from '../../Assets/Pictures/avatarMinh.jpg';
import picture from '../../Assets/Pictures/HookTheHead.jpg';
import RenderNewsCard from './renderNewsCard';
import firebase from 'firebase';
import {ThemeProvider} from '@react-navigation/native';

const {width: WIDTH} = Dimensions.get('window');
const storage = firebase.storage();
const storageRef = storage.ref();

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post_detail: [],
      refesh: false,
      postdetailtemp: [],
    };
  }
  async componentDidMount() {
    LogBox.ignoreAllLogs();
    let temp = await this.readNewsData();
    console.log(temp);
    // this.setState({
    //   post_detail: temp,
    // });
  }
  showDetail = () => {
    this.props.navigation.navigate('Detail', {
      post_data: this.state.post_profile,
      detail_data: this.state.post_detail[1].fooddetail,
    });
    console.log(this.state.post_detail[1].fooddetail);
  };
  getPostPicture = async (name) => {
    const imageRef = await storageRef.child(`${name}`).getDownloadURL();
    return imageRef;
  };
  readNewsData() {
    firebase
      .database()
      .ref('data/')
      .once('value', (snapshot) => {
        const dataNews = Object.values(snapshot.val());
        if (snapshot.val() !== null && snapshot.val() !== undefined) {
          this.setState({
            post_detail: dataNews,
          });
        }
      })
      .then(() => {
        return true;
      });
  }
  renderFoodCard = (item, index) => {
    return (
      //   <View>
      //     <Image
      //       source={{uri: `${item.item.fooddetail.image}`}}
      //       style={{width: 500, height: 500}}></Image>
      //     <Text>{item.item.fooddetail.name}</Text>
      //   </View>
      <RenderNewsCard image={item.item.fooddetail.image} name={item.item.fooddetail.name}/>
    );
  };
  render() {
    let datatemp = [];
    this.state.post_detail.map(async (item) => {
      datatemp.push({
        name: item.fooddetail.name,
        image: await this.getPostPicture(item.fooddetail.image),
      });
    });
    return (
      <SafeAreaView>
        <ScrollView>
          {this.state.post_detail != [] ? (
            <View style={{width:WIDTH}}>
              <FlatList
                ref="flatlist"
                data={this.state.post_detail}
                renderItem={(item, index) => this.renderFoodCard(item, index)}
              />
            </View>
          ) : (
            <View>
              <Text>null</Text>
            </View>
          )}
          {/* <RenderNewsCard
            profile={this.state.post_profile}
            detail={this.state.detail_data}
            click={this.showDetail}
          /> */}

          <TouchableOpacity
            onPress={() => {
              console.log(datatemp);
              this.setState({refesh: true});
            }}>
            <Text>Testing</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default News;
