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
  Dimensions,
  StatusBar
} from 'react-native';
import RenderNewsCard from './renderNewsCard';
import firebase from 'firebase';
import Icons from 'react-native-vector-icons/dist/Ionicons';
import HeaderCus from '../Header/Header';

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
    // this.setState({
    //   post_detail: temp,
    // });
    console.log(this.state.post_detail);
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
        if (snapshot.val() !== null && snapshot.val() !== undefined) {
          const dataNews = Object.values(snapshot.val());
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
      <RenderNewsCard
        image={item.item.fooddetail.image}
        name={item.item.fooddetail.name}
      />
    );
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#0984e3'}}>
        <HeaderCus title={'home'} allowSearch={true} />
        <ScrollView>
          {this.state.post_detail != [] ? (
            <View style={{width: WIDTH}}>
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
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default News;
