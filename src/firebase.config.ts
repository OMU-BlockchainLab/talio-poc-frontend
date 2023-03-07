// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyALD4XhcapGadAQs239T4xvMFp_te4jT-0',
  authDomain: 'uploadfiles-51afb.firebaseapp.com',
  projectId: 'uploadfiles-51afb',
  storageBucket: 'uploadfiles-51afb.appspot.com',
  messagingSenderId: '817022028352',
  appId: '1:817022028352:web:ef2efdf267076cf7e26da5',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
