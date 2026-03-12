// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:            "AIzaSyC1Et7I9BFk2UoVONnKO_BaUqYhlNHDndw",
  authDomain:        "hireon-84a22.firebaseapp.com",
  projectId:         "hireon-84a22",
  storageBucket:     "hireon-84a22.firebasestorage.app",
  messagingSenderId: "78681236193",
  appId:             "1:78681236193:web:32e0f9c075b59d66368da0",
  measurementId:     "G-Z2EM87GFDP",
};

const app = initializeApp(firebaseConfig);

export const auth           = getAuth(app);
export const db             = getFirestore(app);
export const storage        = getStorage(app);
export const googleProvider = new GoogleAuthProvider();