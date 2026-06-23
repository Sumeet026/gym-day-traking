import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWkEdzEG2ASTC3LLsCAJkA2Gbb5F957xk",
  authDomain: "gym-traking-3149f.firebaseapp.com",
  projectId: "gym-traking-3149f",
  storageBucket: "gym-traking-3149f.firebasestorage.app",
  messagingSenderId: "980778677435",
  appId: "1:980778677435:web:786bdafd9608cd4009259e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
