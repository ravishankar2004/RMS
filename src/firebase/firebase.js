import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD99OD2lAgCEk7CIpSCd9QlVhaJipMhVSs",
  authDomain: "fuse-470fd.firebaseapp.com",
  projectId: "fuse-470fd",
  storageBucket: "fuse-470fd.appspot.com",
  messagingSenderId: "42255224260",
  appId: "1:42255224260:web:83defc095c78d64d762891",
  measurementId: "G-B8H11EEKK1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
