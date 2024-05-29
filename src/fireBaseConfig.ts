// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getStorage } from "firebase/storage";

//Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: "chat-app-93789.appspot.com",
  messagingSenderId: "1034936144848",
  appId: "1:1034936144848:web:b58f43e0ad4af1e618dfd5",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imageDb = getStorage(app);
