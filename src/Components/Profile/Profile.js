import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  AsyncStorage,
  Alert,
  LogBox,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  TouchableWithoutFeedbackComponent,
} from 'react-native';
import temppic from '../../Assets/temp.jpeg';
import bgtemp from '../../Assets/bgtemp.jpg';
import anhbia from '../../Assets/bgcity.jpg';
import Icons from 'react-native-vector-icons/dist/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import gender from '../../Assets/gender.png';
import name from '../../Assets/name.png';
import dob from '../../Assets/dob.png';
import address from '../../Assets/address.png';
import edit from '../../Assets/edit.png';
import plus from '../../Assets/plus.png';
import {
  Avatar,
  Title,
  Caption,
  Text,
  Divider,
  Modal,
  Portal,
  FAB,
} from 'react-native-paper';
import {Content, Picker} from 'native-base';
import {TextInput} from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import HeaderCus from '../Header/Header';
import i18n from './../i18n';
import profile from './initProfile';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;
const Fetch = RNFetchBlob.polyfill.Fetch;
window.fetch = new Fetch({
  // enable this option so that the response data conversion handled automatically
  auto: true,
  // when receiving response data, the module will match its Content-Type header
  // with strings in this array. If it contains any one of string in this array,
  // the response body will be considered as binary data and the data will be stored
  // in file system instead of in memory.
  // By default, it only store response data to file system when Content-Type
  // contains string `application/octet`.
  binaryContentTypes: ['image/', 'video/', 'audio/', 'foo/'],
}).build();

const {width: WIDTH} = Dimensions.get('window');
const {height: HEIGHT} = Dimensions.get('window');
const storage = firebase.storage();
const storageRef = storage.ref();

function uploadImage(uri, mime = 'image/jpeg', name) {
  return new Promise((resolve, reject) => {
    let imgUri = uri;
    const {currentUser} = firebase.auth();
    let uploadBlob = null;
    const uploadUri =
      Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
    const imageRef = firebase.storage().ref(`/jobs/${currentUser.uid}`);

    fs.readFile(uploadUri, 'base64')
      .then((data) => {
        return Blob.build(data, {type: `${mime};BASE64`});
      })
      .then((blob) => {
        uploadBlob = blob;
        return imageRef.put(blob, {contentType: mime, name: name});
      })
      .then(() => {
        uploadBlob.close();
        return true;
      })
      .then((url) => {
        resolve(url);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function confirmDate(date) {
  console.log(date);
  let temp = date.split('-');
  return temp[2] + '-' + temp[1] + '-' + temp[0];
}

class Profile extends Component {
  constructor(props) {
    super(props);
    StatusBar.setBackgroundColor('rgba(0,0,0,0)');
    StatusBar.setTranslucent(true);
    this.state = {
      selected: 'key1',
      test: '',
      image: {
        uri: '',
        width: '',
        height: '',
      },
      user: firebase.auth(),
      images: null,
      name: 'Minh Nguyen',
      gmail: 'minhnguyen22698@gmail.com',
      isEdit: false,
      dobEdit: false,
      userinfotemp: {
        uid: '',
        username: '',
        fullname: '',
        gender: '',
        phone: '',
        dob: '',
        address: '',
        image: '',
      },
      userinfo: {
        username: 'Tobi Nguyễn',
        fullname: 'Nguyễn Hoàng Minh',
        gender: 'Female',
        phone: '0979780528',
        dob: '1998-06-22',
        address: 'Quận 7',
        image: '',
      },
    };
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
        console.log('received image', image);
        this.setState({
          image: {
            uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime,
          },
          images: null,
        });
      })
      .catch((e) => alert(e));
  }

  pickSingleBase64(cropit) {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: cropit,
      includeBase64: true,
      includeExif: true,
    })
      .then((image) => {
        console.log('received base64 image');
        this.setState({
          image: {
            uri: `data:${image.mime};base64,` + image.data,
            width: image.width,
            height: image.height,
          },
          images: null,
        });
      })
      .catch((e) => alert(e));
  }
  cleanupImages() {
    ImagePicker.clean()
      .then(() => {
        console.log('removed tmp images from tmp directory');
      })
      .catch((e) => {
        alert(e);
      });
  }
  cleanupSingleImage() {
    let image =
      this.state.image ||
      (this.state.images && this.state.images.length
        ? this.state.images[0]
        : null);
    console.log('will cleanup image', image);

    ImagePicker.cleanSingle(image ? image.uri : null)
      .then(() => {
        console.log(`removed tmp image ${image.uri} from tmp directory`);
      })
      .catch((e) => {
        alert(e);
      });
  }

  cropLast() {
    if (!this.state.image) {
      return Alert.alert(
        'No image',
        'Before open cropping only, please select image',
      );
    }

    ImagePicker.openCropper({
      path: this.state.image.uri,
      width: 200,
      height: 200,
    })
      .then((image) => {
        console.log('received cropped image', image);
        this.setState({
          image: {
            uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime,
          },
          images: null,
        });
      })
      .catch((e) => {
        console.log(e);
        Alert.alert(e.message ? e.message : e);
      });
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
          images: null,
        });
        uploadImage(image.path, 'image/jpeg');
      })
      .catch((e) => {
        console.log(e);
        Alert.alert(e.message ? e.message : e);
      });
  }

  scaledHeight(oldW, oldH, newW) {
    return (oldH / oldW) * newW;
  }

  renderVideo(video) {
    console.log('rendering video');
    return <View style={{height: 300, width: 300}}></View>;
  }
  renderImage(image) {
    return (
      <Image
        style={{width: 300, height: 300, resizeMode: 'contain'}}
        source={image}
      />
    );
  }
  renderAsset(image) {
    if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image);
    }

    return this.renderImage(image);
  }
  async componentDidMount() {
    LogBox.ignoreAllLogs();

    // await firebase
    //   .database()
    //   .ref('users/' + currentUser.uid)
    //   .once('value')
    //   .then((snapshoot) => {
    //     if (snapshoot.val() != null && snapshoot.val() != undefined) {
    //       this.setState({
    //         userinfo: snapshoot.val().profile,
    //       });
    //     }
    //   });
    this.getProfile()
  }
  getProfile = () => {
    const {currentUser} = firebase.auth();
    firebase
      .database()
      .ref('users/' + currentUser.uid)
      .on('value', (snapshoot) => {
        if (snapshoot.val() != null && snapshoot.val() != undefined) {
          this.setState({
            userinfo: snapshoot.val().profile,
          });
        }
      });
  };
  onEditProfile = () => {
    this.props.navigation.navigate('Editprofile', {
      userinfo: this.state.userinfo,
    });
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderCus
          title={'profile'}
          color={'black'}
          setting={true}
          addnew={true}
          onAddNew={() => {
            this.props.navigation.navigate('addnew', {
              user: this.state.userinfo,
            });
          }}
          onSetting={() => {
            this.props.navigation.navigate('Setting');
          }}
        />
        <View style={styles.userinfocontainer}>
          <View style={styles.userinfo}>
            {this.state.userinfo.image === '' ? (
              <Avatar.Text
                size={100}
                color={'white'}
                backgroundColor={'#1abc9c'}
                label={this.state.user.currentUser.email
                  .substring(0, 1)
                  .toUpperCase()}
              />
            ) : (
              <View>
                <Avatar.Image
                  color={'white'}
                  backgroundColor={'#1abc9c'}
                  source={{uri: `${this.state.userinfo.image}`}}
                  size={100}
                />
              </View>
            )}
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              {this.state.userinfo.username}
            </Text>
          </View>
          <View style={styles.userdetail}>
            <View style={styles.item}>
              <View>
                <Text style={styles.itemdetail}>Posts</Text>
                <Text style={styles.itemdetail}>
                  {this.state.userinfo.posts
                    ? Object.values(this.state.userinfo.posts).length
                    : 0}
                </Text>
              </View>
              <View>
                <Text style={styles.itemdetail}>Saved</Text>
                <Text style={styles.itemdetail}>0</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity style={styles.btnedit} onPress={this.onEditProfile}>
            <Text style={{color: 'black'}}>{i18n.t('editprofile')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnedit}
            onPress={() => {
              console.log(this.state.userinfo.posts);
            }}>
            <Text style={{color: 'black'}}>{i18n.t('editprofile')}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.postcontainer}></ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: null,
  },
  userinfocontainer: {
    flexDirection: 'row',
    height: 200,
    backgroundColor: 'red',
  },
  userinfo: {
    flexDirection: 'column',
    backgroundColor: 'green',
    width: WIDTH - 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userdetail: {
    backgroundColor: 'blue',
    justifyContent: 'center',
  },
  item: {
    backgroundColor: 'purple',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  itemdetail: {
    backgroundColor: 'red',
    padding: 5,
    color: 'black',
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center',
  },
  btnedit: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH - 55,
    height: 30,
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    margin: 10,
    borderRadius: 5,
  },
  postcontainer: {
    backgroundColor: 'yellow',
    height: HEIGHT,
  },
});
export default Profile;
