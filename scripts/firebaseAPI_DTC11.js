//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyBJUSJG0kYRSpkkRXNz4EEuxq8hx65NNDA",
    authDomain: "comp1800-202430-demo-eb71e.firebaseapp.com",
    projectId: "comp1800-202430-demo-eb71e",
    storageBucket: "comp1800-202430-demo-eb71e.appspot.com",
    messagingSenderId: "100814248341",
    appId: "1:100814248341:web:8e28a7c5904490030dfe9c"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
