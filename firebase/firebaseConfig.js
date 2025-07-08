// firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBa_hXNWC95qsfRTv3_AoLQIECOa3BYzd8",
    authDomain: "mediaheaven-910b7.firebaseapp.com",
    projectId: "mediaheaven-910b7",
    storageBucket: "mediaheaven-910b7.appspot.com",
    messagingSenderId: "40485976924",
    appId: "1:40485976924:web:92594cdd77479f14c8df99",
    measurementId: "G-NZYEZ1CHPC",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
