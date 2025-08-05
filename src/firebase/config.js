// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCl9piBsgE3b3d36fF79fvneZY8Rp8TvWY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "contact-cardss.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "contact-cardss",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "contact-cardss.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "526185955538",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:526185955538:web:212a2828c84d698991ed0b"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

export default app;