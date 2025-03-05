// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAj6Hd8IprZwh9bv9CZJW4rHgrzPKJkKTg",
  authDomain: "ecommerce-project-f8834.firebaseapp.com",
  projectId: "ecommerce-project-f8834",
  storageBucket: "ecommerce-project-f8834.firebasestorage.app",
  messagingSenderId: "638280185929",
  appId: "1:638280185929:web:d665b4dec6d16d859c6798",
  measurementId: "G-RE6QZ4WB0N"
};

// Initialize Firebase
import { getApps } from "firebase/app";

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// const analytics = getAnalytics(app);

export default app;