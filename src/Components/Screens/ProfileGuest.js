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
  RefreshControl,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';

import {Avatar, Text} from 'react-native-paper';
import Icons from 'react-native-vector-icons/dist/Ionicons'
import firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import HeaderCus from '../Header/HeadergoBack';
import i18n from './../i18n';
import {FlatList} from 'react-native-gesture-handler';
import {Transition, Transitioning} from 'react-native-reanimated';

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={200} />
    <Transition.Change />
    <Transition.Out type="fade" durationMs={200} />
  </Transition.Together>
);

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
    this.state = {
      selected: 'key1',
      userid: this.props.route.params.userpostid,
      test: '',
      image: {
        uri: '',
        width: '',
        height: '',
      },
      images: null,
      name: 'Minh Nguyen',
      gmail: 'minhnguyen22698@gmail.com',
      isEdit: false,
      dobEdit: false,
      posts: '',
      userinfo: '',
      havepost: false,
      refeshing: false,
      isSeemore: false,
    };
  }
  _onRefesh = () => {
    this.setState({
      refeshing: true,
    });
    this.getProfile();
    this.getUserPost();

    setTimeout(() => {
      this.setState({
        refeshing: false,
      });
    }, 1000);
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
    const checkflag = await this.getProfile();
    await this.getUserPost();
    console.log(this.state.userid);
    StatusBar.setBackgroundColor('rgba(0,0,0,0)');
    StatusBar.setTranslucent(true);
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
  }
  getProfile = () => {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref('users/' + this.state.userid)
        .on('value', (snapshoot) => {
          if (snapshoot.val() != null && snapshoot.val() != undefined) {
            this.setState({
              userinfo: snapshoot.val().profile,
            });
            resolve(true);
          } else {
            reject(false);
          }
        });
    });
  };
  getUserPost = async () => {
    const post = [];
    const posts = Object.values(this.state.userinfo.posts);
    if (posts != null || posts !== undefined) {
      posts.map((item) => {
        firebase
          .database()
          .ref('data/' + item.posts + '/fooddetail')
          .on('value', (snapshoot) => {
            if (snapshoot.val() != null && snapshoot.val() != undefined) {
              post.push(snapshoot.val());
              this.setState({
                posts: post,
              });
            }
          });
      });
    }
  };
  renderPost = ({item}) => (
    <View>
      <Text style={{color: 'black'}}>{item.name}</Text>
    </View>
  );
  goDetail = (item) => {
    this.props.navigation.navigate('Detail', {postinfo: item});
  };
  onGoBack = () => {
    this.props.navigation.pop();
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderCus title={'profile'} color={'black'} onGoBack={this.onGoBack} />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refeshing}
              onRefresh={this._onRefesh}
            />
          }>
          <View style={styles.userinfocontainer}>
            <View style={styles.userinfo}>
              {this.state.userinfo !== '' &&
              this.state.userinfo.image === '' ? (
                <Avatar.Text
                  size={100}
                  color={'white'}
                  backgroundColor={'#1abc9c'}
                  label={'M'}
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
              <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>
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
              </View>
            </View>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {this.state.isSeemore ? (
              <View >
                <View style={{margin: 10, backgroundColor: '#ecf0f1',}}>
                  <View style={{flexDirection:'row',padding:10 }}>
                    <Icons name="person" size={26} color="silver"/>
                    <Text style={{color: 'black', fontSize: 20,marginLeft:20}}>
                      {this.state.userinfo.fullname}
                    </Text>
                  </View>
                  <View style={{flexDirection:'row',padding:10}}>
                    <Icons name="calendar" size={26} color="silver"/>
                    <Text style={{color: 'black', fontSize: 20,marginLeft:20}}>
                      {this.state.userinfo.dob}
                    </Text>
                  </View>
                  <View style={{flexDirection:'row',padding:10}}>
                    <Icons name="home" size={26} color="silver"/>
                    <Text style={{color: 'black', fontSize: 20,marginLeft:20}}>
                      {this.state.userinfo.address}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.btnedit}
                  activeOpacity={1}
                  onPress={() => {
                    this.setState({isSeemore: false});
                  }}>
                  <Text style={{color: 'black'}}>{i18n.t('seemore')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.btnedit}
                activeOpacity={1}
                onPress={() => {
                  this.setState({isSeemore: true});
                }}>
                <Text style={{color: 'black'}}>{i18n.t('seemore')}</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {this.state.posts.length !== 0 ? (
              this.state.posts.map((item) => (
                <TouchableOpacity
                  delayPressIn={200}
                  onPress={
                    () => this.goDetail(item)
                    //console.log(item)
                  }>
                  <ImageBackground
                    imageStyle={{opacity: 0.7}}
                    source={{uri: item.image}}
                    style={styles.postitem}>
                    {/* <Image source={{uri: item.image}}/> */}
                    <Text style={styles.postname}>{item.name}</Text>
                  </ImageBackground>
                </TouchableOpacity>
              ))
            ) : (
              <View
                style={{
                  flexGrow: 1,
                  backgroundColor: 'red',
                  height: null,
                  width: null,
                }}></View>
            )}
          </View>
        </ScrollView>
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
    backgroundColor: '#95a5a6',
    margin: 20,
    borderRadius: 5,
    flexDirection: 'row',
    height: 200,
    shadowColor: '#1abc9c',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,

    elevation: 20,
  },
  userinfo: {
    flexDirection: 'column',
    width: WIDTH - 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userdetail: {
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  itemdetail: {
    padding: 5,
    color: 'black',
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center',
  },
  btnedit: {
    backgroundColor: '#1abc9c',
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
    flex: 1,
  },
  postitem: {
    width: WIDTH / 2,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postname: {
    color: 'black',
    fontSize: 15,
    flexWrap: 'wrap',
    fontWeight: 'bold',
  },
});
export default Profile;
