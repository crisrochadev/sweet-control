import { boot } from 'quasar/wrappers'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAqvVr4cRjZAXOOUxO_lrumoxlbzCI6YXs",
  authDomain: "sweet-control-76a92.firebaseapp.com",
  databaseURL: "https://sweet-control-76a92-default-rtdb.firebaseio.com",
  projectId: "sweet-control-76a92",
  storageBucket: "sweet-control-76a92.appspot.com",
  messagingSenderId: "542959059563",
  appId: "1:542959059563:web:deed32f2070930613aa72e",
  measurementId: "G-K0LESKTS3E"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
let currentUser = null;

// Listen for auth state changes


export async function updateUser(data) {
  return await updateProfile(auth.currentUser, data).then(() => {
    return true
  }).catch((error) => {
    console.error(error)
    return { errorCode: error.code }
  });
}

export async function register(name, email, password) {
  return await createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      return await updateUser({ displayName: name })
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(error)
      return { errorCode };
    });
}

export async function login(email, password) {
  return await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return true
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return {
        errorCode, errorMessage
      }
    });
}

export async function logout() {
  return await signOut(auth).then(() => {
    return true
  }).catch((error) => {
    console.error(error)
    return false
  });
}

export async function userAuth() {
  return await new Promise(resolve => {
    onAuthStateChanged(auth, (user) => {
      resolve(user)
    });// Retorna o usuário atual
  })
}

export async function recoverPass(email) {
  return await sendPasswordResetEmail(auth, email)
    .then(() => {
      return true
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(error)
      return false
    });
}

export default boot(async (/* { app, router, ... } */) => {
  // something to do
})
