import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDliF51KkY6qG4HdG7AKBUg-En_fINQRdw",
  authDomain: "waterlevel-cedfe.firebaseapp.com",
  projectId: "waterlevel-cedfe",
  storageBucket: "waterlevel-cedfe.firebasestorage.app",
  messagingSenderId: "428605931056",
  appId: "1:428605931056:web:4f9a4cbccd7353211ef7f5",
  measurementId: "G-39X9YB7464"
};

import { getAuth } from "firebase/auth";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
