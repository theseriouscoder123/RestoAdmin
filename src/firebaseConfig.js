// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuL9zeh_V6pnH3o9c_lttT99RWeZRq8_s",
  authDomain: "hi-resto.firebaseapp.com",
  projectId: "hi-resto",
  storageBucket: "hi-resto.appspot.com",
  messagingSenderId: "945139019481",
  appId: "1:945139019481:web:d16632100e8adab52c18c8",
  measurementId: "G-X1242LSMKL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export { db, storage, auth};
// Import the functions you need from the SDKs you need
