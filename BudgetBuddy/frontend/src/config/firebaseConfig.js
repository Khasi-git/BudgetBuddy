import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

/***************************Task 0: firebaseConfig object**************************/

const firebaseConfig = {
    apiKey: "AIzaSyBjPPCUTsu9vMxtI4zWDPw-ia5XfyFjKG0",
    authDomain: "web-app-firebase-88363.firebaseapp.com",
    projectId: "web-app-firebase-88363",
    storageBucket: "web-app-firebase-88363.appspot.com",
    messagingSenderId: "75381415275",
    appId: "1:75381415275:web:3cb7a34e4fcf527882402e",
    measurementId: "G-NHVXYRMGP2"
  };

/***************************Task 0: firebaseConfig object**************************/

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);

// Enable persistent authentication state
setPersistence(auth, browserLocalPersistence);

export {auth, database};
export default app;