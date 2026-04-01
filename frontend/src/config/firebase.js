// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:            "AIzaSyAWdsVcLPgX2P8gbvySI-b9Z7AR0AiyBfg",
  authDomain:        "hireon-e5a31.firebaseapp.com",
  projectId:         "hireon-e5a31",
  storageBucket:     "hireon-e5a31.firebasestorage.app",
  messagingSenderId: "782324524814",
  appId:             "1:782324524814:web:b9b7ecbb7f55f66521d95f",
  measurementId:     "G-FDENZ0D5S1"
};

const app = initializeApp(firebaseConfig);

export const auth           = getAuth(app);
export const db             = getFirestore(app);
export const storage        = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();