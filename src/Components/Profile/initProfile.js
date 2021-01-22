import React, {Component, useState} from 'react';
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
import {Avatar} from 'react-native-paper';
import firebase from 'firebase';
import Icons from 'react-native-vector-icons/dist/Ionicons';
import {Right, Toast, Root, Input, Item, Label, Icon} from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Divider} from 'react-native-paper';
import i18n from './../i18n';
import bg from '../../Assets/bgprofile.png';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import uploadImage from './../uploadImage';
const {width: WIDTH} = Dimensions.get('window');

class profile extends Component {
  constructor(props) {
    super(props);
    const emailtemp = 'Minhnguyen22698@gmail.com';
    this.state = {
      email: emailtemp.substring(0, 1).toUpperCase(),
      profile: {
        username: 'Tobi Nguyễn',
        fullname: 'Nguyễn Hoàng Minh',
        image: '',
        dob: '1998-06-22',
        address: 'Texas',
        phone: '0979780528',
        posts:[],
        saved:[],
      },
      image: {
        uri: '',
        width: '',
        height: '',
      },
      editdob: false,
      modaluploadimg: false,
      step: 0,
    };
  }
  onConfirm = async () => {
    let date = new Date();
    let today = (
      date.getDate() +
      '-' +
      date.getMonth() +
      '-' +
      date.getFullYear() +
      '/' +
      makeid(20)
    ).toString();
    const {currentUser} = firebase.auth()
    const name= currentUser.uid+today;
    if(this.state.image.uri!=''){
      const uri= await uploadImage(this.state.image.uri,name)
      this.setState(prevState=>({
        profile:{
          ...prevState.profile,
          image:uri
        }
      }))
      this.props.navigation.navigate('Home Screen')
    }
    firebase.database() 
    .ref("users/"+ currentUser.uid)
    .set({
      profile: this.state.profile
    })
  };
  onClickNext = () => {
    let i = this.state.step;
    this.setState({
      step: i + 1,
    });
  };
  onClickBack = () => {
    let i = this.state.step;
    this.setState({
      step: i - 1,
    });
  };
  onUploadImg = () => {
     this.RBSheet.open();
  };
  componentDidMount() {
    LogBox.ignoreAllLogs();
  }
  pickSingleWithCamera(cropping, mediaType = 'photo') {
    ImagePicker.openCamera({
      cropping: cropping,
      width: 500,
      height: 500,
      includeExif: true,
      mediaType,
    })
      .then((image) => {
        this.setState({
          image: {
            uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime,
          },
        });
      })
      .catch((e) =>
        Toast.show({
          text: e.message ? e.message : e,
          buttonText: i18n.t('btnhidetoast'),
          duration: 3000,
          type: 'danger',
        }),
      );
    this.RBSheet.close();
  }
  pickSingle(cropit, circular = false, mediaType) {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: cropit,
      cropperCircleOverlay: circular,
      sortOrder: 'none',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
      cropperStatusBarColor: 'white',
      cropperToolbarColor: 'white',
      cropperActiveWidgetColor: 'white',
      cropperToolbarWidgetColor: '#3498DB',
    })
      .then((image) => {
        console.log('received image', image);
        this.setState({
          image: {
            uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime,
          },
        });
      })
      .catch((e) => {
        Toast.show({
          text: e.message ? e.message : e,
          buttonText: i18n.t('btnhidetoast'),
          duration: 3000,
          type: 'danger',
        });
      });
    this.RBSheet.close();
  }
  onSaveDob = (val) => {
    let temp = moment(val).format('YYYY-MM-DD');
    this.setState((prevState) => ({
      profile: {
        ...prevState.profile,
        dob: temp,
      },
      editdob: false,
    }));
  };
  onCancelDob = () => {
    this.setState({
      editdob: false,
    });
  };
  onChangeText = (key) => (e) => {
    this.setState((prevState) => ({
      profile: {
        ...prevState.profile,
        [key]: e,
      },
    }));
  };

  render() {
    return (
      <Root>
        {this.state.step == 0 ? (
          <ImageBackground source={bg} style={s.container}>
            <View style={{alignItems: 'center'}}>
              <Text style={s.title}>{i18n.t('signinimg')}</Text>
            </View>
            <View style={s.avatarcontainer}>
              {this.state.image.uri == '' ? (
                <View>
                  <Avatar.Text
                    size={300}
                    color={'white'}
                    backgroundColor={'#1abc9c'}
                    label={this.state.email}
                    style={s.avatar}
                  />
                </View>
              ) : (
                <View>
                  <Avatar.Image
                    color={'white'}
                    backgroundColor={'#1abc9c'}
                    style={s.avatar}
                    source={{uri: `${this.state.image.uri}`}}
                    size={300}
                  />
                </View>
              )}
            </View>

            <RBSheet
              ref={(ref) => {
                this.RBSheet = ref;
              }}
              animationType="fade"
              height={200}
              openDuration={200}
              closeDuration={100}
              closeOnDragDown={true}
              closeOnPressMask={true}>
              <View>
                <TouchableOpacity
                  style={s.modalitem}
                  onPress={() => this.pickSingleWithCamera(false)}>
                  <Icons style={s.iconitem} name={'camera-outline'} size={26} />
                  <Text style={s.textitem}>{i18n.t('imgpickercam')}</Text>
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity
                  style={s.modalitem}
                  onPress={() => this.pickSingle(false)}>
                  <Icons style={s.iconitem} name={'images-outline'} size={26} />
                  <Text style={s.textitem}>{i18n.t('uploadimgfile')}</Text>
                </TouchableOpacity>
              </View>
            </RBSheet>
            <View style={s.btncontainer}>
              <TouchableOpacity style={s.btnimg} onPress={this.onUploadImg}>
                <Text>{i18n.t('uploadimg')}</Text>
              </TouchableOpacity>
            </View>
            <View style={s.direction}>
              <TouchableOpacity
                onPress={this.onClickNext}
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 50,
                  backgroundColor: '#1abc9c',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icons name={'chevron-forward-outline'} size={26} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        ) : this.state.step === 1 ? (
          <ImageBackground source={bg} style={s.container}>
            <View style={{alignItems: 'center'}}>
              {this.state.image.uri == '' ? (
                <View>
                  <Avatar.Text
                    size={100}
                    color={'white'}
                    backgroundColor={'#1abc9c'}
                    label={this.state.email}
                    style={s.avatar}
                  />
                </View>
              ) : (
                <View>
                  <Avatar.Image
                    color={'white'}
                    backgroundColor={'#1abc9c'}
                    style={s.avatar}
                    source={{uri: `${this.state.image.uri}`}}
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
                      onChangeText={this.onChangeText('username')}
                      value={this.state.profile.username}
                    />
                  </Item>
                </View>

                <View style={{padding: 5}}>
                  <Item stackedLabel>
                    <Label>Full name</Label>
                    <Input
                      onChangeText={this.onChangeText('fullname')}
                      value={this.state.profile.fullname}
                    />
                  </Item>
                </View>
                <View style={{padding: 5}}>
                  <Item stackedLabel>
                    <Label>Address</Label>
                    <Input
                      value={this.state.profile.address}
                      onChangeText={this.onChangeText('address')}
                    />
                  </Item>
                </View>
                <View style={{padding: 5}}>
                  <Item stackedLabel>
                    <Label>Date of birth</Label>
                    <View style={{flexDirection: 'row'}}>
                      <Input
                        value={confirmDate(this.state.profile.dob)}
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
                  <DateTimePickerModal
                    isVisible={this.state.editdob}
                    mode="date"
                    date={new Date(this.state.profile.dob)}
                    onConfirm={this.onSaveDob}
                    onCancel={this.onCancelDob}
                  />
                </View>
                <View style={{padding: 5}}>
                  <Item stackedLabel>
                    <Label>Phone</Label>
                    <Input
                      value={this.state.profile.phone}
                      onChangeText={this.onChangeText('phone')}
                    />
                  </Item>
                </View>
              </View>
            </View>
            <View style={s.direction}>
              <TouchableOpacity
                onPress={this.onClickBack}
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 50,
                  margin: 10,
                  backgroundColor: '#1abc9c',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icons name={'chevron-back-outline'} size={26} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.onClickNext}
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 50,
                  backgroundColor: '#1abc9c',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 10,
                }}>
                <Icons name={'chevron-forward-outline'} size={26} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        ) : (
          <ImageBackground source={bg} style={s.container}>
            <View style={{alignItems: 'center'}}>
              {this.state.image.uri == '' ? (
                <View>
                  <Avatar.Text
                    size={100}
                    color={'white'}
                    backgroundColor={'#1abc9c'}
                    label={this.state.email}
                    style={s.avatar}
                  />
                </View>
              ) : (
                <View>
                  <Avatar.Image
                    color={'white'}
                    backgroundColor={'#1abc9c'}
                    style={s.avatar}
                    source={{uri: `${this.state.image.uri}`}}
                    size={100}
                  />
                </View>
              )}
            </View>
            <View style={{alignItems: 'center', padding: 50}}>
              <View style={s.inputcontainer}>
                <View style={{alignItems: 'center'}}>
                  <Text style={s.title}>{i18n.t('profiledetail')}</Text>
                </View>
                <View style={s.itemtext}>
                  <Icons name="person-outline" size={26} />
                  <Text>{this.state.profile.username}</Text>
                </View>
                <View style={s.itemtext}>
                  <Icons name="body-outline" size={26} />
                  <Text>{this.state.profile.fullname}</Text>
                </View>
                <View style={s.itemtext}>
                  <Icons name="location-outline" size={26} />
                  <Text>{this.state.profile.address}</Text>
                </View>
                <View style={s.itemtext}>
                  <Icons name="calendar-outline" size={26} />
                  <Text>{confirmDate(this.state.profile.dob)}</Text>
                </View>
                <View style={s.itemtext}>
                  <Icons name="call-outline" size={26} />
                  <Text>{this.state.profile.phone}</Text>
                </View>
              </View>
            </View>
            <View style={s.direction}>
              <TouchableOpacity
                onPress={this.onClickBack}
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 50,
                  margin: 10,
                  backgroundColor: '#1abc9c',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icons name={'chevron-back-outline'} size={26} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.onConfirm}
                style={{
                  height: 50,
                  width: 100,
                  borderRadius: 25,
                  backgroundColor: '#1abc9c',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 10,
                }}>
                <Text>{i18n.t('submitprofile')}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        )}
      </Root>
    );
  }
}
function makeid(length) {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
function confirmDate(date) {
  console.log(date);
  let temp = date.split('-');
  return temp[2] + '-' + temp[1] + '-' + temp[0];
}

const s = StyleSheet.create({
  container: {
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
    width: WIDTH - 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  itemtext: {
    flexDirection: 'row',
    padding: 10,
  },
});
export default profile;
