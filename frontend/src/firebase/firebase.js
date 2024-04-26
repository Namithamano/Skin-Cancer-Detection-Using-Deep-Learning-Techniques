import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { setDoc, doc, getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA3Cx9RXQt8xLmCgQM_RpRGKCARvWbqkzY",
    authDomain: "skin-cancer-new.firebaseapp.com",
    projectId: "skin-cancer-new",
    storageBucket: "skin-cancer-new.appspot.com",
    messagingSenderId: "456773973072",
    appId: "1:456773973072:web:bcb91259f5c3142a798d55"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
const storage = getStorage(app);



export { app, auth, db, storage };
