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
  StatusBar,
  Alert,
} from 'react-native';
import i18n from './../i18n';
import Icons from 'react-native-vector-icons/dist/Ionicons';
import {Avatar} from 'react-native-paper';
import Header from '../Header/HeadergoBack';
import bg from '../../Assets/bgprofile.png';
import uploadImage from './../uploadImage';
import {Divider} from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Right, Toast, Root, Input, Item, Label, Icon} from 'native-base';
import firebase from 'firebase';
import {ScrollView} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import {Modal, Portal} from 'react-native-paper';
import Spinner from 'react-native-spinkit';
const {width: WIDTH} = Dimensions.get('window');

function makeid(length) {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userinfo: props.route.params.userinfo,
      image: {
        uri: '',
        width: '',
        height: '',
      },
      editdob: false,
      userinfotemp: props.route.params.userinfo,
      isLoading:false
    };
  }
  componentDidMount() {
    StatusBar.setBackgroundColor('rgba(0,0,0,0)');
    StatusBar.setTranslucent(true);
  }
  goBack = () => {
    this.props.navigation.goBack();
    this.setState({
      userinfotemp: this.state.userinfo,
    });
  };
  onChangeText = (key) => (e) => {
    this.setState((prevState) => ({
      userinfo: {
        ...prevState.userinfo,
        [key]: e,
      },
    }));
  };
  onSaveDob = (val) => {
    let temp = moment(val).format('YYYY-MM-DD');
    this.setState((prevState) => ({
      userinfo: {
        ...prevState.userinfo,
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
  onConfirmEdit = async () => {
    this.setState({isLoading:true})
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
    const {currentUser} = firebase.auth();
    const name = currentUser.uid + today;
    let uri = '';
    if (this.state.image.uri != '') {
      uri = await uploadImage(this.state.image.uri, name);
      this.setState((prevState) => ({
        userinfo: {
          ...prevState.userinfo,
          image: uri,
        },
      }));
    }
    if (this.state.userinfo.username !== '') {
      if(this.state.userinfo.fullname!==''){
        
        if(this.state.userinfo.address!==''){
          firebase
          .database()
          .ref('users/' + currentUser.uid + '/')
          .update({
            profile: this.state.userinfo,
          })
          .then(() => {
            this.setState({isLoading:false})
          });
        }
        else{
          Alert.alert(
            'Warning',
            'Homeless ?',
            [
              {
                text:'Got cha!',
                style:'cancel'
              }
            ]
          )
        }
      }
      else{
        Alert.alert(
          'Warning',
          'Full name is empty ?',
          [
            {
              text:'Got cha!',
              style:'cancel'
            }
          ]
        )
      }
     
    }
    else{
      Alert.alert(
        'Warning',
        'Username invalid',
        [
          {
            text:'Got cha!',
            style:'cancel'
          }
        ]
      )
    }
  };
  render() {
    return (
      <SafeAreaView>
        <ImageBackground source={bg} style={s.bodycontainer}>
          <Header
            title={i18n.t('edit')}
            onGoBack={this.goBack}
            color={'#ffffff'}
          />
          <ScrollView>
            <View style={s.avatarcontainer}>
              {this.state.image.uri !== '' ? (
                <Avatar.Image
                  source={{uri: this.state.image.uri}}
                  size={100}
                  style={s.avatar}
                />
              ) : this.state.userinfo.image == '' ? (
                <Avatar.Text
                  size={100}
                  color={'white'}
                  backgroundColor={'#1abc9c'}
                  label={this.state.user.currentUser.email
                    .substring(0, 1)
                    .toUpperCase()}
                  style={s.avatar}
                />
              ) : (
                <Avatar.Image
                  color={'white'}
                  style={s.avatar}
                  source={{uri: `${this.state.userinfo.image}`}}
                  size={100}
                />
              )}

              <Icons
                style={s.addimg}
                name="ellipsis-horizontal-circle-outline"
                size={25}
                onPress={() => {
                  this.RBSheet.open();
                }}
                color={'#ffffff'}
              />
            </View>
            <View style={{padding: 20, alignItems: 'center'}}>
              <View style={s.inputcontainer}>
                <View style={{alignItems: 'center'}}>
                  <Text style={s.title}>{i18n.t('profiledetail')}</Text>
                </View>
                <View style={{padding: 5}}>
                  <Item stackedLabel>
                    <Label>Username</Label>
                    <Input
                      onChangeText={this.onChangeText('username')}
                      value={this.state.userinfo.username}
                    />
                  </Item>
                </View>

                <View style={{padding: 5}}>
                  <Item stackedLabel>
                    <Label>Full name</Label>
                    <Input
                      onChangeText={this.onChangeText('fullname')}
                      value={this.state.userinfo.fullname}
                    />
                  </Item>
                </View>
                <View style={{padding: 5}}>
                  <Item stackedLabel>
                    <Label>Address</Label>
                    <Input
                      value={this.state.userinfo.address}
                      onChangeText={this.onChangeText('address')}
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
                  <DateTimePickerModal
                    isVisible={this.state.editdob}
                    mode="date"
                    date={new Date(this.state.userinfo.dob)}
                    onConfirm={this.onSaveDob}
                    onCancel={this.onCancelDob}
                  />
                </View>
                <View style={{padding: 5}}>
                  <Item stackedLabel>
                    <Label>Phone</Label>
                    <Input
                      value={this.state.userinfo.phone}
                      onChangeText={this.onChangeText('phone')}
                    />
                  </Item>
                </View>
              </View>
              <TouchableOpacity
                style={s.btnsubmit}
                onPress={this.onConfirmEdit}>
                <Text>{i18n.t('confirm')}</Text>
              </TouchableOpacity>
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
            <Portal>
            <Modal
              visible={this.state.isLoading}
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Spinner size={50} type="ChasingDots" color="#1ABC9C" />
            </Modal>
          </Portal>
          </ScrollView>
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
    flexGrow: 1,
    height: null,
    width: null,
  },
  bodycontainer: {
    flexGrow: 1,
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
    marginTop: 30,
  },
  avatar: {
    position: 'relative',
  },
  addimg: {
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    color: 'black',
    borderRadius: 30,
    backgroundColor: 'white',
    bottom: 0,
    right: WIDTH / 2 - 45,
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
  btnsubmit: {
    margin: 20,
    width: WIDTH - 55,
    height: 40,
    backgroundColor: '#1abc9c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});

export default Edit;
