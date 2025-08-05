// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCl9piBsgE3b3d36fF79fvneZY8Rp8TvWY",
  authDomain: "contact-cardss.firebaseapp.com",
  projectId: "contact-cardss",
  storageBucket: "contact-cardss.firebasestorage.app",
  messagingSenderId: "526185955538",
  appId: "1:526185955538:web:212a2828c84d698991ed0b"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

export default app;