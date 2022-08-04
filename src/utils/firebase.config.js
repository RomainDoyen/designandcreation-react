import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_API_AUTH,
  projectId: process.env.REACT_APP_API_ID,
  storageBucket: process.env.REACT_APP_API_BUCKET,
  messagingSenderId: process.env.REACT_APP_API_MESSAGING_ID,
  appId: process.env.REACT_APP_API_APP_ID
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);