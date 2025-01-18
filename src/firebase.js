// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWsHpcSuXp9UA44chLceJbDpOvbKDZrmk",
  authDomain: "pc-monitoring-dashboard.firebaseapp.com",
  projectId: "pc-monitoring-dashboard",
  storageBucket: "pc-monitoring-dashboard.firebasestorage.app",
  messagingSenderId: "187613277439",
  appId: "1:187613277439:web:6336579eed2ba55eb230ca",
  measurementId: "G-02PB6QJH7N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);