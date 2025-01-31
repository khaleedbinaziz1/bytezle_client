import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Add collection and getDocs
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA-pEY384lM5P4Q5_wVoEwGxaQwIQLRWC0",
  authDomain: "bytezle-4f2b0.firebaseapp.com",
  projectId: "bytezle-4f2b0",
  storageBucket: "bytezle-4f2b0.appspot.com",
  messagingSenderId: "627420341833",
  appId: "1:627420341833:web:358a649802273ac7d88198",
  measurementId: "G-4PSTESRPM3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Test Firestore connection
async function testFirestoreConnection() {
  try {
    const querySnapshot = await getDocs(collection(db, 'testCollection'));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
    console.log('Firestore is connected and working!');
  } catch (error) {
    console.error('Error connecting to Firestore:', error);
  }
}

testFirestoreConnection(); // Call the function to test the connection

export { app, auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };