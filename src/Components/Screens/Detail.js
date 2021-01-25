import React, {Component} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import RenderDetailCard from './renderDetailCard';
import Header from '../Header/HeadergoBack';
import i18n from '../i18n';
// import avatarMinh from '../../Assets/Pictures/avatarMinh.jpg';
import picture from '../../Assets/Pictures/HookTheHead.jpg';
import calo from '../../Assets/calories.png';
import prep from '../../Assets/prep.png';
// import RenderNewsCard from './renderNewsCard';
// import firebase from 'firebase';
import {Divider, Avatar} from 'react-native-paper';
import Icons from 'react-native-vector-icons/dist/Ionicons';
import {Transition,Transitioning} from 'react-native-reanimated'

const {width: WIDTH} = Dimensions.get('window');
const transition=(
    <Transition.Together>
        <Transition.In type='fade' durationMs={200}/>
        <Transition.Change/>
        <Transition.Out type='fade' durationMs={200}/>
    </Transition.Together>
)

class Detail extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef()
    this.state = {
      post: this.props.route.params.postinfo.fooddetail,
      currentIndex: null,
    };
  }
  goProfile = () => {};
  async componentDidMount() {}
  render() {
 
    return (
      <SafeAreaView style={s.container}>
        <Header
          title={i18n.t('detail')}
          onGoBack={() => {
            this.props.navigation.goBack();
          }}></Header>
        <ScrollView>
          <View style={s.info}>
            <Image style={s.img} source={{uri: this.state.post.image}}></Image>
          </View>
          <View style={s.detail}>
            <Text style={s.foodname}>{this.state.post.name}</Text>
            <View style={{flexDirection: 'row'}}>
              <View style={s.detailitem}>
                <Image source={calo} style={s.icon} />
                <Text style={s.textitem}>{this.state.post.calo}</Text>
                <Text style={s.textitem}>calories</Text>
              </View>
              <View style={s.detailitem}>
                <Image source={prep} style={s.icon} />
                <Text style={s.textitem}>Prep :</Text>
                <Text style={s.textitem}>{this.state.post.prep}</Text>
                <Text style={s.textitem}>mins</Text>
              </View>
            </View>
          </View>
          <Divider style={{height: 5, backgroundColor: '#bdc3c7'}} />
          <View style={s.userinfo}>
            <View style={s.useritem}>
              {this.state.post.userimg ? (
                <Avatar.Image
                  source={{uri: this.state.post.userimg}}
                  size={80}
                />
              ) : (
                <Avatar.Text size={80} label={'M'} />
              )}
            </View>
            <View style={s.useritem}>
              <Text style={{fontWeight: 'bold', fontSize: 20}}>
                {this.state.post.username}
              </Text>
              <Text>Full name</Text>
            </View>
            <View style={s.userbtn}>
              <Icons name="chatbubble-ellipses-outline" size={26} />
              <TouchableOpacity
                style={s.userbtnitem}
                delayPressIn={250}
                onPress={this.goProfile}>
                <Text>{i18n.t('goprofile')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Divider style={{height: 5, backgroundColor: '#bdc3c7'}} />
          <View style={s.ingre}>
            <Text style={s.ingretitle}>{i18n.t('ingre')}</Text>
            <View>
              <Text style={s.matertext}>{this.state.post.material}</Text>
            </View>
          </View>
          <Divider style={{height: 5, backgroundColor: '#bdc3c7'}} />
          <View style={s.stepcontainer}>
            <Text style={s.steptitle}>{i18n.t('steps')}</Text>
          </View>
          <View style={s.stepdetail}>
            {this.state.post.discription.map((item, index) => (
              <Transitioning.View 
              ref={this.ref}
              transition={transition}
              style={{flexGrow:1}}
              >
                <TouchableOpacity
                  style={s.stepitem}
                  delayPressIn={200}
                  onPress={() => {
                    this.ref.current.animateNextTransition()
                    this.setState({
                      currentIndex: index ===this.state.currentIndex? null:index,
                    });
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={s.stepname}>{item.stepname}</Text>
                    <Icons
                      style={{
                        position: 'absolute',
                        right: 0,
                      }}
                      name={'chevron-back-outline'}
                      size={26}
                    />
                  </View>
                  {this.state.currentIndex === index && (
                    <View style={s.stepvalue}>
                      <Text>{item.stepvalue}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Transitioning.View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const s = StyleSheet.create({
  container: {
    flex: 1,
    height: null,
    width: null,
  },
  img: {
    width: WIDTH,
    height: 200,
    resizeMode: 'stretch',
  },
  foodname: {
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold',
  },
  detail: {
    paddingLeft: 10,
  },
  icon: {
    height: 30,
    width: 30,
  },
  detailitem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textitem: {
    fontSize: 18,
    padding: 5,
  },
  userinfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  useritem: {
    padding: 5,
  },
  userbtn: {
    flexDirection: 'row',
    position: 'absolute',
    right: 10,
    alignItems: 'center',
  },
  userbtnitem: {
    backgroundColor: '#f39c12',
    width: 80,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    margin: 5,
  },
  ingre: {
    padding: 5,
  },
  ingretitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  matertext: {
    fontSize: 15,
    padding: 10,
  },
  stepcontainer: {
    padding: 5,
  },
  steptitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  stepdetail: {
    padding: 5,
  },
  stepitem: {
    flexGrow: 4 / 10,
    margin: 5,
  },
  stepname: {
    fontSize: 20,
  },
  stepvalue: {
    padding: 10,
    fontSize: 15,
  },
});

export default Detail;
