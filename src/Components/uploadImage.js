import RNFetchBlob from 'react-native-fetch-blob';
import firebase from 'firebase';

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

function uploadImage(uri, name) {
  const mime = 'image/jpeg';
  return new Promise((resolve, reject) => {
    let imgUri = uri;
    let uploadBlob = null;
    const uploadUri =
      Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
    const {currentUser} = firebase.auth();
    const imageRef = firebase.storage().ref(`/${name}`);

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
export default uploadImage;
