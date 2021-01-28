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
  StatusBar,
  RefreshControl,
} from 'react-native';
import RenderNewsCard from './renderNewsCard';
import firebase from 'firebase';
import Icons from 'react-native-vector-icons/dist/Ionicons';
import HeaderCus from '../Header/Header';
import Advertisement from './Advertisement';
import {Button} from 'native-base';
import Carousel from 'react-native-snap-carousel';

const {width: WIDTH} = Dimensions.get('window');
const storage = firebase.storage();
const storageRef = storage.ref();

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post_detail: [],
      refesh: false,
      postdetailtemp: '',
      refeshing: false,
      search: '',
      isLogin: this.props.route.params.userindex,
      userinfo: '',
    };
  }
  async componentDidMount() {
    LogBox.ignoreAllLogs();
    await this.readNewsData();
    const {currentUser} = firebase.auth();
    firebase
      .database()
      .ref(`users/${currentUser.uid}/profile`)
      .once('value')
      .then((snapshot) => {
        if (snapshot.val() !== undefined && snapshot.val() !== null) {
          this.setState({
            userinfo: snapshot.val(),
          });
        }
      });
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
  onRefesh = async () => {
    this.setState({
      refeshing: true,
    });
    await this.readNewsData();
    setTimeout(() => {
      this.setState({refeshing: false});
    }, 1000);
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
      });
  }
  goDetail = (item) => {
    this.props.navigation.navigate('Detail', {postinfo: item.fooddetail});
    //console.log(item)
  };
  renderAdvCard = (item, index) => {
    return (
      //   <View>
      //     <Image
      //       source={{uri: `${item.item.fooddetail.image}`}}
      //       style={{width: 500, height: 500}}></Image>
      //     <Text>{item.item.fooddetail.name}</Text>
      //   </View>

      <Advertisement
        image={item.item.fooddetail.image}
        onPress={() => this.goDetail(item.item)}
      />
    );
  };
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
        onPress={() => this.goDetail(item.item)}
      />
    );
  };
  onChangeSearch = (val) => {
    this.setState({
      search: val,
    });
    const newData = this.state.post_detail.filter((item) => {
      const itemdata = item.fooddetail.name.toUpperCase();
      const textData = val.toUpperCase();
      return itemdata.indexOf(textData) > -1;
    });
    this.setState({
      postdetailtemp: newData,
    });
  };
  onCancelSearch = () => {
    this.setState({
      search: '',
    });
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#0984e3'}}>
        <HeaderCus
          title={'home'}
          allowSearch={true}
          addnew={this.state.isLogin}
          search={this.state.search}
          onAddNew={() => {
            this.props.navigation.navigate('addnew', {
              user: this.state.userinfo,
            });
            console.log(this.state.userinfo);
          }}
          cancelSearch={() => this.setState({search: ''})}
          onChangeSearch={this.onChangeSearch}
          onSubmitSearch={this.onSubmitSearch}
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refeshing}
              onRefresh={this.onRefesh}
            />
          }>
          <View style={{width: '100%', paddingLeft: 10}}>
            <Text style={{fontSize: 20, color: 'white'}}>Gợi ý cho bạn</Text>
          </View>

          {this.state.search === '' ? (
            <View>
              <View style={{width: '100%', height: 250}}>
                <Carousel
                  // ref="flatlist"
                  layout={'tinder'}
                  data={this.state.post_detail}
                  renderItem={(item, index) => this.renderAdvCard(item, index)}
                  sliderWidth={WIDTH}
                  itemWidth={WIDTH}
                  sliderHeight="100%"
                  itemHeight="100%"
                  autoplay={true}
                  autoplayDelay={1000}
                  loop={true}
                  activeAnimationType="spring"
                  hasParallaxImages={true}
                />
              </View>
              {this.state.post_detail != [] ? (
                <View style={{width: WIDTH}}>
                  <FlatList
                    ref="flatlist"
                    data={this.state.post_detail}
                    renderItem={(item, index) =>
                      this.renderFoodCard(item, index)
                    }
                  />
                </View>
              ) : (
                <View>
                  <Text>null</Text>
                </View>
              )}
            </View>
          ) : this.state.postdetailtemp !== '' ? (
            <FlatList
              ref="flatlist"
              data={this.state.postdetailtemp}
              renderItem={(item, index) => this.renderFoodCard(item, index)}
            />
          ) : null}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default News;
