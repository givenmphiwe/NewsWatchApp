import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,

  // @ts-ignore
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyARsLqZcbdWFqpvTKNr5o2T9ReEBasmO14",
  authDomain: "soundbar-test.firebaseapp.com",
  databaseURL: "https://soundbar-test-default-rtdb.firebaseio.com",
  projectId: "soundbar-test",
  storageBucket: "soundbar-test.firebasestorage.app",
  messagingSenderId: "647061227259",
  appId: "1:647061227259:web:c4ac7aab77f316fc38125e",
  measurementId: "G-2K1CKCW8Y8",
};

const app = initializeApp(firebaseConfig);

// Use initializeAuth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
