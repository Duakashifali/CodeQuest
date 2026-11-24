import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// CodeQuest Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCagtU0oONxgDfNND6JeTSg1P76wjMNZ2c",
  authDomain: "codequest-435cf.firebaseapp.com",
  projectId: "codequest-435cf",
  storageBucket: "codequest-435cf.firebasestorage.app",
  messagingSenderId: "461087673335",
  appId: "1:461087673335:web:c0ae00433f5e6edd513cf2"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  // Auth may already have been initialized during Fast Refresh.
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
