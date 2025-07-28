import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAdKwfkgT9dzESPmStRSlrwV5j_PegS37Y',
  authDomain: 'find-space-72361.firebaseapp.com',
  projectId: 'find-space-72361',
  storageBucket: 'find-space-72361.firebasestorage.app',
  messagingSenderId: '453275228864',
  appId: '1:453275228864:android:3a602f472d3381026e6b25',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
