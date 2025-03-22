// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD26g6bGq37lUSey_JgvCXpTNkW8HxlSX4",
  authDomain: "buslink-62c41.firebaseapp.com",
  projectId: "buslink-62c41",
  storageBucket: "buslink-62c41.firebasestorage.app",
  messagingSenderId: "579154312115",
  appId: "1:579154312115:web:cdd940c3fec1a16a6929c6"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase