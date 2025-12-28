import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC-RyeNVI6aNmWSJIYhQCG_4J_RQDAovds",
  authDomain: "student-archive-f8689.firebaseapp.com",
  databaseURL: "https://student-archive-f8689-default-rtdb.firebaseio.com",
  projectId: "student-archive-f8689",
  storageBucket: "student-archive-f8689.firebasestorage.app",
  messagingSenderId: "815104091476",
  appId: "1:815104091476:web:8e725238d8ebabaf26d4c1",
  measurementId: "G-X9CCBWXFF0"
};

// تهيئة Firebase والاتصال بقاعدة البيانات
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
