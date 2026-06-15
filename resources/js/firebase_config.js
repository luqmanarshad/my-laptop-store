// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // For Database
import { getAuth } from "firebase/auth"; // For Authentication

// TODO: Replace the following with your app's Firebase project configuration
// You can get this from your Firebase Console -> Project Settings
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9O3bd4TdI6nqcpnR9Iv4x8Jlat1w3JCo",
  authDomain: "my-laptop-store.firebaseapp.com",
  projectId: "my-laptop-store",
  storageBucket: "my-laptop-store.firebasestorage.app",
  messagingSenderId: "821279729548",
  appId: "1:821279729548:web:fe6189974ad431b615d8a9",
  measurementId: "G-W4XF71R8QW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
const db = getFirestore(app);
const auth = getAuth(app);

// Export them so you can use them in your Vue components
export { db, auth };
