// import * as firebase from "firebase";
import { initializeApp } from 'firebase/app';

// import { getStorage } from 'firebase/storage';

import { getAuth, updateProfile } from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';

import { FirebaseConfig } from './firebaseConfig';

const app = initializeApp(FirebaseConfig);

const dbAux = getFirestore(app);

const authAux = getAuth();

export const db = dbAux;

export const authRef = authAux;
export const userUpdateProfile = updateProfile;
export const auth = getAuth;
