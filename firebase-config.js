
const firebaseConfig = {
  apiKey: "AIzaSyAKMW6pbNwPWs9TyqD9NBc8TWt6zj1eHgU",
  authDomain: "gchs-lost-and-found.firebaseapp.com",
  projectId: "gchs-lost-and-found",
  storageBucket: "gchs-lost-and-found.firebasestorage.app",
  messagingSenderId: "289432763502",
  appId: "1:289432763502:web:7bffa99baaddb3f8573a7f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
