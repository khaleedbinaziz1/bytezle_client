import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, onSnapshot } from 'firebase/firestore'; // Import onSnapshot

const firebaseConfig = {
  apiKey: "AIzaSyD5ACh9BgXc_E6upc4_3Z8Qa9VKkkRBII0",
  authDomain: "better-ecom.firebaseapp.com",
  projectId: "better-ecom",
  storageBucket: "better-ecom",
  messagingSenderId: "1217353368",
  appId: "1:1217353368:web:fd3760e646899ee35ea2ed",
  measurementId: "G-NXP5W1X8HS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onSnapshot };
