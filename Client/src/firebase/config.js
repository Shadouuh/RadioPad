import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCvy30b_hCocxH9T4a0Ov-gDawTEIjryjQ",
    authDomain: "botonera-de929.firebaseapp.com",
    databaseURL: "https://botonera-de929-default-rtdb.firebaseio.com",
    projectId: "botonera-de929",
    storageBucket: "botonera-de929.firebasestorage.app",
    messagingSenderId: "1053614021013",
    appId: "1:1053614021013:web:42b912aeb1f08079b03e9c",
    measurementId: "G-8Y9W6GPVD3"
  };
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };