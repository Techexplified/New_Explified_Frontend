

// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";



// 🔥 Initialize the Firebase app once



const firebaseConfig = {
  apiKey: "AIzaSyDJopkM89UXIUtWbRJ_rPlVT-ANhTWDLCQ",
  authDomain: "explified-app.firebaseapp.com",
  databaseURL: "https://explified-app.firebaseio.com",
  projectId: "explified-app",
  storageBucket: "explified-app.appspot.com",
  messagingSenderId: "901696391731",
  appId: "1:901696391731:web:08642b26336d598388b146",
  measurementId: "G-SWCZB3SNZV"
};

const app = initializeApp(firebaseConfig);

// ✅ Export initialized auth instance
const auth = getAuth(app);

export { auth };