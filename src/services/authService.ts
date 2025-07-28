import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export const signupUser = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};


export const signinUser = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };
