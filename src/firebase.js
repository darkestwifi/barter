
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 🆕 Firestore

const firebaseConfig = {
  apiKey: "AIzaSyBcQgGLLua70sXJy79rJLj7wH18-aq-8cc",
  authDomain: "barter-connect-e1876.firebaseapp.com",
  projectId: "barter-connect-e1876",
  storageBucket: "barter-connect-e1876.appspot.com",
  messagingSenderId: "424937333267",
  appId: "1:424937333267:web:1d78c2b47ec6718c2455e6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // 🆕 Firestore instance



