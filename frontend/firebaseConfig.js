import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAeM0wgOZFokaECSHkpmlZVawMSSCXSv7Q",
  authDomain: "mineria-de-datos-be8c1.firebaseapp.com",
  projectId: "mineria-de-datos-be8c1",
  storageBucket: "mineria-de-datos-be8c1.appspot.com",
  messagingSenderId: "725327040457",
  appId: "1:725327040457:web:e0f5273ed92f4853a7e218"
};

// Inicialización EXPLÍCITA
const app = initializeApp(firebaseConfig);

// Auth con persistencia
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Firestore
const db = getFirestore(app);

export { app, auth, db };