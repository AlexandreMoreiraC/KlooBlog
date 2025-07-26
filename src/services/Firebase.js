import { initializeApp } from "firebase/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "firebase/auth"
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  deleteDoc,
  updateDoc 
} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB-BhfyxSFnvNiz3YEiHcRKrytlOScbNks",
  authDomain: "kloowebsite-d0915.firebaseapp.com",
  projectId: "kloowebsite-d0915",
  storageBucket: "kloowebsite-d0915.appspot.com",
  messagingSenderId: "630654288298",
  appId: "1:630654288298:web:2c65b7b3e6002fba89abd3"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export {
  auth,
  db,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  deleteDoc,
  updateDoc,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
}