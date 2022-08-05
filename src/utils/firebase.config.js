import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "designandcreation-react.firebaseapp.com",
  projectId: "designandcreation-react",
  storageBucket: "designandcreation-react.appspot.com",
  messagingSenderId: "349146390731",
  appId: "1:349146390731:web:2582afa414e1b623a43b4e"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);