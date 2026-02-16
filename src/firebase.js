// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBuYK6PUwRgVmrzFz3Mi89xqKJ55hiOIII",
  authDomain: "pronearby-7f30c.firebaseapp.com",
  projectId: "pronearby-7f30c",
  storageBucket: "pronearby-7f30c.appspot.com",
  messagingSenderId: "972711960202",
  appId: "1:972711960202:web:80028511a45028c2ba1773",
  measurementId: "G-MEXT1DP0QP"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);