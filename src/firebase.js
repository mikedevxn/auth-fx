import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDW4Q0C8Fzo9iF1exxH-lYgIl5MQ65JOeU",
    authDomain: "auth-d9696.firebaseapp.com",
    projectId: "auth-d9696",
    storageBucket: "auth-d9696.appspot.com",
    messagingSenderId: "759488583918",
    appId: "1:759488583918:web:e89be01f187a59dab53bff"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export default firebase;
