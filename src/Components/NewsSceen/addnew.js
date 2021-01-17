import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
} from 'react-native';
import fire from 'firebase';
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
  Textarea,
  Accordion,
} from 'native-base';
import {ScrollView} from 'react-native-gesture-handler';
import Icons from 'react-native-vector-icons/dist/Ionicons.js';
import ImagePicker from 'react-native-image-crop-picker';
import uploadimg from '../uploadImage';
import uploadImage from './../uploadImage';
import firebase from 'firebase';

const storage = firebase.storage();
const storageRef = storage.ref();

function makeid(length) {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

const {width: WIDTH} = Dimensions.get('window');
const {height: HEIGHT} = Dimensions.get('window');

const discriptiontemp = [];

class AddNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fooddetail: {
        name: '',
        material: '',
        discription: [],
        image: '',
      },
      image: {
        uri: '',
        width: '',
        height: '',
      },
      isEdit: false,
    };
  }
  componentDidMount() {}
  onChangeText = (key) => (e) => {
    this.setState((prevState) => ({
      fooddetail: {
        ...prevState.fooddetail,
        [key]: e,
      },
      isEdit: true,
    }));
  };
  addmoreStep = () => {
    // this.state.fooddetail.discription.push({
    //     key: this.state.fooddetail.discription.length + 1,
    //     stepname: '',
    //     stepvalue: '',
    // })
    // this.setState({
    //     fooddetail: this.state.fooddetail
    // })
    discriptiontemp.push({
      key: discriptiontemp.length + 1,
      stepname: '',
      stepvalue: '',
    });
    this.setState((prevState) => ({
      fooddetail: {
        ...prevState.fooddetail,
        discription: discriptiontemp,
      },
    }));
  };
  delLastesStep = () => {
    // this.state.fooddetail.discription.push({
    //     key: this.state.fooddetail.discription.length + 1,
    //     stepname: '',
    //     stepvalue: '',
    // })
    // this.setState({
    //     fooddetail: this.state.fooddetail
    // })
    discriptiontemp.pop();
    this.setState((prevState) => ({
      fooddetail: {
        ...prevState.fooddetail,
        discription: discriptiontemp,
      },
    }));
  };
  changeStepName = (key, index) => (val) => {
    discriptiontemp[index - 1].stepname = val;
    this.setState((prevState) => ({
      fooddetail: {
        ...prevState.fooddetail,
        discription: discriptiontemp,
      },
    }));
  };
  changeStepValue = (key, index) => (val) => {
    discriptiontemp[index - 1].stepvalue = val;
    this.setState((prevState) => ({
      fooddetail: {
        ...prevState.fooddetail,
        discription: discriptiontemp,
      },
    }));
  };
  _onPost = async () => {
    const {currentUser} = firebase.auth();
    let date = new Date();
    let today = (
      date.getDate() +
      '-' +
      date.getMonth() +
      '-' +
      date.getFullYear() +
      '/' +
      makeid(5)
    ).toString();
    const name = currentUser.uid + today;
    const uri = await uploadImage(this.state.image.uri, name);
    this.setState((prevState) => ({
      fooddetail: {
        ...prevState.fooddetail,
        image: name,
      },
    }));
    if(uri==true){
      this.props.navigation.goBack()
    }
    // fire
    //   .database()
    //   .ref('/data')
    //   .push({
    //     fooddetail: this.state.fooddetail,
    //   })
    //   .catch({});
  };
  permision = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log(granted);
  };
  async _onUploadImage(cropping, mediaType = 'photo') {
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
  onCancle = async () => {
    // let imageRef = await storageRef.child(`${this.state.fooddetail.image}`).getDownloadURL()
    // this.setState({
    //   imagetemp: imageRef
    // });
    this.props.navigation.goBack()
  };
  render() {
    let renderStep = this.state.fooddetail.discription.map((item) => {
      return (
        <View>
          <Form>
            <Item floatingLabel>
              <Label>Step name</Label>
              <Input onChangeText={this.changeStepName('stepname', item.key)} />
            </Item>
            <Textarea
              onChangeText={this.changeStepValue('stepvalue', item.key)}
              style={{width: WIDTH - 10, marginLeft: 5}}
              rowSpan={5}
              bordered
              placeholder={'làm cái vẹo gì trong đây'}
            />
          </Form>
        </View>
      );
    });
    return (
      <SafeAreaView>
        <ScrollView style={s.background}>
          <View style={s.title}>
            <Text style={s.texttitle}>CREATE YOUR OWN FORMULA</Text>
          </View>
          <View style={s.inputform}>
            <Form>
              <Item floatingLabel>
                <Label>Food name</Label>
                <Input onChangeText={this.onChangeText('name')} />
              </Item>
              <Item floatingLabel>
                <Label>Material</Label>
                <Input onChangeText={this.onChangeText('material')} />
              </Item>
            </Form>
            {renderStep}
            <View style={s.btncontainer}>
              <TouchableOpacity style={s.btnadd} onPress={this.addmoreStep}>
                <Text>More step more drama</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.btnadd} onPress={this.delLastesStep}>
                <Text>Less step less drama</Text>
              </TouchableOpacity>
              <View
                style={{
                  width: WIDTH,
                  alignItems: 'center',
                }}>
                <Text>Upload Image</Text>
                {this.state.image.uri !== '' ? (
                  <View>
                    <Image
                      style={{width: 500, height: 500}}
                      source={{uri: this.state.image.uri}}
                    />
                  </View>
                ) : (
                  <View>
                    <TouchableOpacity
                      onPress={async () => this._onUploadImage(false)}>
                      <Icons
                        name={'image-outline'}
                        size={26}
                        color={'#000'}></Icons>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={s.post} onPress={this.onCancle}>
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.post} onPress={this._onPost}>
                  <Text>Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const s = StyleSheet.create({
  background: {
    height: HEIGHT,
    backgroundColor: '#6531F5',
  },
  title: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  post: {
    margin: 10,
    backgroundColor: '#E6E6E6',
    borderWidth: 0,
    borderColor: '#000000',
    borderRadius: 25,
    shadowColor: 'rgba(178,178,178,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 0.44,
    shadowRadius: 0,
    width: WIDTH - 200,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texttitle: {
    color: '#13C223',
  },
  inputform: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  btncontainer: {
    margin: 20,
    alignItems: 'center',
  },
  btnadd: {
    margin: 10,
    backgroundColor: '#E6E6E6',
    borderWidth: 0,
    borderColor: '#000000',
    borderRadius: 25,
    shadowColor: 'rgba(178,178,178,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 0.44,
    shadowRadius: 0,
    width: 191,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddNew;
