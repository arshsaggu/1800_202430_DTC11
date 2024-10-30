//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyC_-_WfwKI2q_Xjm1ZnnVC0rqK292ZU2m0",
    authDomain: "homebites-579e6.firebaseapp.com",
    projectId: "homebites-579e6",
    storageBucket: "homebites-579e6.appspot.com",
    messagingSenderId: "455791707920",
    appId: "1:455791707920:web:efa27b046ebc8fd3ac0795",
    measurementId: "G-EE0KYLQ42F"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
