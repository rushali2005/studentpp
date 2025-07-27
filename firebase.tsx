// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBnWKOJ3rFcyWiBPaYof_-oErXNSiwP4Q",
  authDomain: "studentpp-9b297.firebaseapp.com",
  projectId: "studentpp-9b297",
  storageBucket: "studentpp-9b297.appspot.com", // Fix typo here
  messagingSenderId: "756689543380",
  appId: "1:756689543380:web:46765c096f621c3ef31b41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Export them to use in your app
export { auth, db };
