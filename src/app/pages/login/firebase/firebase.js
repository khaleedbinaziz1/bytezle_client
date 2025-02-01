import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, onSnapshot } from 'firebase/firestore'; // Import onSnapshot

const firebaseConfig = {
  apiKey: "AIzaSyA-pEY384lM5P4Q5_wVoEwGxaQwIQLRWC0",
  authDomain: "bytezle-4f2b0.firebaseapp.com",
  projectId: "bytezle-4f2b0",
  storageBucket: "bytezle-4f2b0.firebasestorage.app",
  messagingSenderId: "627420341833",
  appId: "1:627420341833:web:358a649802273ac7d88198",
  measurementId: "G-4PSTESRPM3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onSnapshot };
