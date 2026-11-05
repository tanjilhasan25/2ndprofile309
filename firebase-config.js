import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

const cfg = {
  apiKey: "AIzaSyAgnEqFdTrhx7ubUVn5vDYwKdlF5glBof8",
  authDomain: "ndprofile309.firebaseapp.com",
  projectId: "ndprofile309",
  storageBucket: "ndprofile309.firebasestorage.app",
  messagingSenderId: "1090822575759",
  appId: "1:1090822575759:web:4ad59d187e863930bb82fa"
};

export const db = getFirestore(initializeApp(cfg));
