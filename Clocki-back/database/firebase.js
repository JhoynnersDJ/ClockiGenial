import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNXC-5ht7SpHD5NsAHX3yem4oZeU0jnis",
  authDomain: "dev-fusion-401517.firebaseapp.com",
  projectId: "dev-fusion-401517",
  storageBucket: "dev-fusion-401517.appspot.com",
  messagingSenderId: "868868796303",
  appId: "1:868868796303:web:d77f959da31b3cfbaf25fa",
  measurementId: "G-TMQZY691K6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export default {
    firebase: app,
    db
};
