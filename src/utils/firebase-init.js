// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBH6s7ptVGjVTUHGqIAE1L0j344SezqUM",
  authDomain: "digital-wiki-tmatcha.firebaseapp.com",
  databaseURL: "https://digital-wiki-tmatcha-default-rtdb.firebaseio.com",
  projectId: "digital-wiki-tmatcha",
  storageBucket: "digital-wiki-tmatcha.appspot.com",
  messagingSenderId: "1009458981341",
  appId: "1:1009458981341:web:c4d3add36174a6fddb6e34"
};

// Initialize Firebase
const fireBaseInit = initializeApp(firebaseConfig);
// }

export default fireBaseInit;
