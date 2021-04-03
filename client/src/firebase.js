import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCMTCPZe_vm7BgCY6ypOnj4sKecims_R6g",
    authDomain: "ecommerce-5e57f.firebaseapp.com",
    projectId: "ecommerce-5e57f",
    storageBucket: "ecommerce-5e57f.appspot.com",
    messagingSenderId: "813614365373",
    appId: "1:813614365373:web:0c35a858e3ef47e76615d4"
};

firebase.initializeApp(firebaseConfig);

// export 
export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider(); 