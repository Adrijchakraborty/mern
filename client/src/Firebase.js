// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-12fb6.firebaseapp.com",
  projectId: "mern-estate-12fb6",
  storageBucket: "mern-estate-12fb6.appspot.com",
  messagingSenderId: "156503909860",
  appId: "1:156503909860:web:076de6988c5ea8e30313f1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);