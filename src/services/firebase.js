import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";  // Use compatibility version
import "firebase/compat/auth";  // Import compatibility auth

const firebaseConfig = {
  apiKey: "AIzaSyDNZSsjz_roRnSgYk9A7oNRGpjCfgWDsB4",
  authDomain: "interviewgenius-2c71e.firebaseapp.com",
  projectId: "interviewgenius-2c71e",
  storageBucket: "interviewgenius-2c71e.appspot.com",
  messagingSenderId: "523760513068",
  appId: "1:523760513068:android:0924b69802e1a8a37a2189",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);  // Use compatibility initialize

// Initialize Firebase Auth
const auth = firebase.auth();  // Use compatibility auth

export { auth };
export default app;