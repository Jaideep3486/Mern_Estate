// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mernestate-7e521.firebaseapp.com',
  projectId: 'mernestate-7e521',
  storageBucket: 'mernestate-7e521.firebasestorage.app',
  messagingSenderId: '111214876330',
  appId: '1:111214876330:web:8b92aa5f62805088b162d3',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
