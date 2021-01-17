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
  ScrollView,
  TouchableOpacity,
  Platform,
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
const storage = firebase.storage();
const storageRef = storage.ref();

function uploadImage(uri, mime = 'image/jpeg', name) {
  return new Promise((resolve, reject) => {
    let imgUri = uri;
    let uploadBlob = null;
    const uploadUri =
      Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
    const {currentUser} = firebase.auth();
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
        return true
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
      userinfotemp: {
        fullname: '',
        age: '',
        gender: '',
        phone: '',
        dob: '',
        address: '',
      },
      userinfo: {
        fullname: 'Nguyễn Hoàng Minh',
        age: '22',
        gender: 'Female',
        phone: '0979780528',
        dob: '1998-06-22',
        address: 'Quận 7',
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
        uploadImage(image.path,'image/jpeg')
      })
      .catch((e) => {
        console.log(e);
        Alert.alert(e.message ? e.message : e);
      });
  }

  pickMultiple() {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      sortOrder: 'desc',
      includeExif: true,
      forceJpg: true,
    })
      .then((images) => {
        this.setState({
          image: null,
          images: images.map((i) => {
            console.log('received image', i);
            return {
              uri: i.path,
              width: i.width,
              height: i.height,
              mime: i.mime,
            };
          }),
        });
      })
      .catch((e) => alert(e));
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
  onLogOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {});
  };
  onEditClick = () => {
    if (this.state.isEdit) {
      this.setState({
        isEdit: false,
      });
    } else {
      this.setState((prevState) => ({
        userinfotemp: {
          ...prevState.userinfo,
        },
        isEdit: true,
      }));
    }
  };
  // handleConfirmDate = (val) => {
  //     this.setDate(prevState=>({
  //         userinfotemp:{
  //             ...prevState.userinfotemp,
  //             dob:val
  //         },
  //     }))
  // }
  hanleChangeGender = (e) => {
    this.setState((prevState) => ({
      userinfotemp: {
        ...prevState.userinfotemp,
        gender: e,
      },
    }));
  };
  handleChangeUsername = (e) => {
    this.setState((prevState) => ({
      userinfotemp: {
        ...prevState.userinfotemp,
        fullname: e,
      },
    }));
  };
  // handleDobChange = (e) => {
  //     // var datetemp = new Date(e)
  //     // var date = datetemp.getDate() + "/" + (datetemp.getMonth() + 1) + "/" + datetemp.getFullYear()
  //     this.setState(prevState => ({
  //         userinfotemp: {
  //             ...prevState.userinfotemp,
  //             dob: e
  //         },
  //     }))
  // }
  hanldeAddressChange = (e) => {
    this.setState((prevState) => ({
      userinfotemp: {
        ...prevState.userinfotemp,
        address: e,
      },
    }));
  };

  EditDob = () => {
    this.setState({
      dobEdit: true,
    });
  };
  onCancelDob = () => {
    this.setState({
      dobEdit: false,
    });
  };
  onSaveDob = (val) => {
    let temp = moment(val).format('YYYY-MM-DD');
    this.setState((prevState) => ({
      userinfotemp: {
        ...prevState.userinfotemp,
        dob: temp,
      },
      dobEdit: false,
    }));
  };
  OnSaveEdit = () => {
    this.setState({
      isEdit: false,
      userinfo: this.state.userinfotemp,
    });
  };
  OnCancelEdit = () => {
    this.setState({
      isEdit: false,
    });
  };
  TestingClick = () => {
    console.log(this.props);
  };
  Addnew = () => {
    this.props.navigation.navigate('addnew');
  };
  // onDateChange = (val) => {
  //     // this.setState(prevState => ({
  //     //     userinfotemp: {
  //     //         ...prevState.userinfotemp,
  //     //         dob: val
  //     //     }
  //     // }))
  //     console.log(val)
  // }
  onChangeGender = (val) => {
    this.setState((prevState) => ({
      userinfotemp: {
        ...prevState.userinfotemp,
        gender: val,
      },
    }));
  };
   uploadImage =async () => {
      var forestRef=await storageRef.child('jobs/DBhq9qKqTGZaPmwDFO7UbKebtll1').getDownloadURL()
      console.log(forestRef)
  };
  render() {
    return (
      //User header
      <SafeAreaView style={styles.container}>
        <View style={styles.userInfosection}>
          <Title style={styles.name}>{this.state.name}</Title>
        </View>
        <View style={styles.avatar}>
          <TouchableOpacity onPress={() => this.pickSingleWithCamera(false)}>
            <Avatar.Image
              source={
                this.state.image.uri == ''
                  ? bgtemp
                  : {uri: this.state.image.uri}
              }
              size={80}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.capcontainer}>
          <Caption style={styles.caption}>{this.state.gmail}</Caption>
        </View>
        <View style={styles.iconprop}>
          <TouchableOpacity style={styles.editicon} onPress={this.onEditClick}>
            <Text style={{color: 'black'}}>
              {!this.state.isEdit ? 'Edit profile' : 'Cancel'}
            </Text>
          </TouchableOpacity>
        </View>
        {/* User info */}
        <ScrollView style={{marginTop: 10}}>
          <View style={styles.userinfo}>
            <View style={styles.iconprop}>
              <Image source={name} size={30} style={styles.icontitle} />
            </View>
            {this.state.isEdit ? (
              <TextInput
                style={styles.textEdit}
                value={this.state.userinfotemp.fullname}
                onChangeText={this.handleChangeUsername}
              />
            ) : (
              <Text style={styles.text}>{this.state.userinfo.fullname}</Text>
            )}
          </View>
          <View style={styles.userinfo}>
            <View style={styles.iconprop}>
              <Image source={gender} style={styles.icontitle} />
            </View>
            {this.state.isEdit ? (
              <Picker
                note
                mode="dropdown"
                style={{width: 120}}
                selectedValue={this.state.userinfotemp.gender}
                onValueChange={this.onChangeGender}>
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Others" value="Others" />
              </Picker>
            ) : (
              <Text style={styles.text}>{this.state.userinfo.gender}</Text>
            )}
          </View>
          <View style={styles.userinfo}>
            <View style={styles.iconprop}>
              <Image source={dob} style={styles.icontitle} />
            </View>
            {this.state.isEdit ? (
              <View>
                <DateTimePickerModal
                  isVisible={this.state.dobEdit}
                  mode="date"
                  date={new Date(this.state.userinfotemp.dob)}
                  onConfirm={this.onSaveDob}
                  onCancel={this.onCancelDob}
                />
                <TouchableOpacity
                  onPress={this.EditDob}
                  style={styles.datepicker}>
                  <Text style={styles.text}>
                    {confirmDate(this.state.userinfotemp.dob)}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.text}>
                {confirmDate(this.state.userinfo.dob)}
              </Text>
            )}
          </View>
          <View style={styles.userinfo}>
            <View style={styles.iconprop}>
              <Image source={address} style={styles.icontitle} />
            </View>
            {this.state.isEdit ? (
              <TextInput
                style={styles.textEdit}
                onChangeText={this.hanldeAddressChange}
                placeholder={this.state.userinfo.address}
              />
            ) : (
              <Text style={styles.text}>{this.state.userinfo.address}</Text>
            )}
          </View>
          <View style={styles.btncontainer}>
            {!this.state.isEdit ? (
              <View>
                <TouchableOpacity style={styles.btn} onPress={this.onLogOut}>
                  <Text>Log out</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={this.uploadImage}>
                  <Text>Log out</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={styles.btnEdit}
                  onPress={this.OnCancelEdit}>
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnEdit}
                  onPress={this.OnSaveEdit}>
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
        <FAB style={styles.fab} medium icon={plus} onPress={this.Addnew} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  editicon: {
    width: WIDTH - 55,
    height: 30,
    borderWidth: 1,
    margin: 20,
    alignItems: 'center',
    borderRadius: 25,
  },
  userInfosection: {
    height: 150,
    justifyContent: 'flex-end',
    backgroundColor: '#1ABC9C',
  },
  avatar: {
    position: 'absolute',
    marginTop: 100,
    marginLeft: 10,
    borderWidth: 3,
    borderColor: '#ffff',
    borderRadius: 60,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFDB73',
    textAlign: 'center',
  },
  capcontainer: {},
  caption: {
    fontSize: 14,
    lineHeight: 14,
    color: 'black',
    marginLeft: 100,
  },
  userinfo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  title: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  text: {
    flex: 1,
    color: 'gray',
    textAlign: 'center',
  },
  textEdit: {
    flex: 1,
  },
  icontitle: {
    width: 30,
    height: 30,
    marginLeft: 50,
    alignItems: 'center',
  },
  btncontainer: {
    flex: 3,
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#1ABC9C',
    width: WIDTH - 100,
    height: 60,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  btnmodal: {
    backgroundColor: '#1ABC9C',
    width: WIDTH - 200,
    height: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  iconprop: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    width: '80%',
    height: 50,
  },
  datepicker: {
    flex: 1,
  },
  btnEdit: {
    backgroundColor: '#1ABC9C',
    width: WIDTH - 250,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 10,
    bottom: 0,
  },
});
export default Profile;
