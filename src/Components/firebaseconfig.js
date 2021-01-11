import 'react-native-gesture-handler';
import * as firebase from 'firebase'
import 'firebase/auth'
import 'firebase/app'
var firebaseConfig = {
    apiKey: "AIzaSyALX6_6BYN67W-503D_oi6hqMq5Pmto12k",
    authDomain: "easyfood-4719d.firebaseapp.com",
    databaseURL: "https://easyfood-4719d.firebaseio.com",
    projectId: "easyfood-4719d",
    storageBucket: "easyfood-4719d.appspot.com",
    messagingSenderId: "852892121751",
    appId: "1:852892121751:web:b9f84bdd991a02b05647d2",
    measurementId: "G-4VB06M8S15"
  };
    const fire = firebase.initializeApp(firebaseConfig);
  export default fire