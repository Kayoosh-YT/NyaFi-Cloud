import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDMu6u7yFPgzN2RktCRP6hPy3nJen5OdJM",
  authDomain: "nyafi-cloud.firebaseapp.com",
  databaseURL: "https://nyafi-cloud-default-rtdb.firebaseio.com",
  projectId: "nyafi-cloud",
  storageBucket: "nyafi-cloud.firebasestorage.app",
  messagingSenderId: "323199817977",
  appId: "1:323199817977:web:1917ee3663cf5dd457aa28",
  measurementId: "G-EQYPQ2QHMB"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, get, child };