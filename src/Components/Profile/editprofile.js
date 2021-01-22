import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  LogBox,
} from 'react-native';
import i18n from './../i18n';
import Icons from 'react-native-vector-icons/dist/Ionicons';
import {Avatar} from 'react-native-paper';
import Header from '../Header/HeadergoBack';
import bg from '../../Assets/bgprofile.png';
import uploadImage from './../uploadImage';
import {Divider} from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Right, Toast, Root, Input, Item, Label, Icon} from 'native-base';
import firebase from 'firebase';

const {width: WIDTH} = Dimensions.get('window');

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userinfo: props.route.params.userinfo,
      user: firebase.auth(),
    };
  }
  componentDidMount() {}
  goBack=()=>{
    this.props.navigation.goBack()
  }
  render() {
    return (
      <SafeAreaView style={s.container}>
        <Header title={'Edit'} onGoBack={this.goBack} />
        <ImageBackground source={bg} style={s.bodycontainer}>
          <View style={{alignItems: 'center'}}>
            {this.state.userinfo.image == '' ? (
              <View>
                <Avatar.Text
                  size={100}
                  color={'white'}
                  backgroundColor={'#1abc9c'}
                  label={this.state.user.currentUser.email
                    .substring(0, 1)
                    .toUpperCase()}
                  style={s.avatar}
                />
              </View>
            ) : (
              <View>
                <Avatar.Image
                  color={'white'}
                  backgroundColor={'#1abc9c'}
                  style={s.avatar}
                  source={{uri: `${this.state.userinfo.image}`}}
                  size={100}
                />
              </View>
            )}
          </View>
          <View style={{alignItems: 'center', padding: 20}}>
            <View style={s.inputcontainer}>
              <View style={{alignItems: 'center'}}>
                <Text style={s.title}>{i18n.t('profiledetail')}</Text>
              </View>
              <View style={{padding: 5}}>
                <Item stackedLabel>
                  <Label>Username</Label>
                  <Input
                    //onChangeText={this.onChangeText('username')}
                    value={this.state.userinfo.username}
                  />
                </Item>
              </View>

              <View style={{padding: 5}}>
                <Item stackedLabel>
                  <Label>Full name</Label>
                  <Input
                    //onChangeText={this.onChangeText('fullname')}
                    value={this.state.userinfo.fullname}
                  />
                </Item>
              </View>
              <View style={{padding: 5}}>
                <Item stackedLabel>
                  <Label>Address</Label>
                  <Input
                    value={this.state.userinfo.address}
                    //onChangeText={this.onChangeText('address')}
                  />
                </Item>
              </View>
              <View style={{padding: 5}}>
                <Item stackedLabel>
                  <Label>Date of birth</Label>
                  <View style={{flexDirection: 'row'}}>
                    <Input
                      value={confirmDate(this.state.userinfo.dob)}
                      disabled={true}
                    />
                    <Icons
                      onPress={() =>
                        this.setState({
                          editdob: true,
                        })
                      }
                      name="calendar-outline"
                      size={26}
                    />
                  </View>
                </Item>
                {/* <DateTimePickerModal
                  isVisible={this.state.editdob}
                  mode="date"
                  date={new Date(this.state.profile.dob)}
                  onConfirm={this.onSaveDob}
                  onCancel={this.onCancelDob}
                /> */}
              </View>
              <View style={{padding: 5}}>
                <Item stackedLabel>
                  <Label>Phone</Label>
                  <Input
                    value={this.state.userinfo.phone}
                    //onChangeText={this.onChangeText('phone')}
                  />
                </Item>
              </View>
            </View>
            <TouchableOpacity style={s.btnsubmit}>
              <Text>Confirm</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

function confirmDate(date) {
  console.log(date);
  let temp = date.split('-');
  return temp[2] + '-' + temp[1] + '-' + temp[0];
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    height: null,
    width: null,
  },
  bodycontainer: {
    flex: 1,
    width: null,
    height: null,
    justifyContent: 'center',
    backgroundColor: '#bdc3c7',
  },
  title: {
    fontFamily: i18n.language == 'en' ? 'Bavro' : null,
    fontSize: 30,
    color: '#e67e22',
  },
  avatarcontainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  avatar: {
    position: 'relative',
  },
  iconavatar: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderRadius: 40,
  },
  btncontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  btnimg: {
    width: WIDTH / 2,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#e67e22',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalitem: {
    flexDirection: 'row',
    paddingTop: 25,
  },
  iconitem: {
    paddingLeft: 5,
  },
  textitem: {
    fontFamily: 'Rene Bieder',
    textAlign: 'center',
    fontSize: 26,
    justifyContent: 'center',
    marginLeft: 10,
  },
  direction: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inputcontainer: {
    backgroundColor: '#ecf0f1',
    height: null,
    width: WIDTH - 50,
    borderRadius: 10,
    justifyContent: 'center',
  },
  itemtext: {
    flexDirection: 'row',
    padding: 10,
  },
  btnsubmit:{
    margin:20,
    width:WIDTH-55,
    height:40,
    backgroundColor:'#1abc9c',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:20
  }
});

export default Edit;
