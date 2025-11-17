// src/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // <-- 1. Import auth tools

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-vVLMC6cRwFc8HGLqcKI6mznVGE89lvw",
  authDomain: "noticeboard-4f684.firebaseapp.com",
  projectId: "noticeboard-4f684",
  storageBucket: "noticeboard-4f684.firebasestorage.app",
  messagingSenderId: "944675466216",
  appId: "1:944675466216:web:3e3da3535d3ee25e62d25d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// --- 2. Create and Export the "Tools" ---
// This is our main "Authentication" tool
export const auth = getAuth(app);

// This is the "Google" button's pop-up tool
export const googleProvider = new GoogleAuthProvider();