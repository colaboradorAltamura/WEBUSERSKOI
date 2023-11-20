/* eslint-disable no-console */

import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASURAMENT_ID,
  ENVIRONMENT,
} from 'src/configs/appConfig';

console.log('NODE_ENV: ', process.env.NODE_ENV, 'ENVIRONMENT: ', ENVIRONMENT, 'PROJECT_ID:', FIREBASE_PROJECT_ID);

const firebaseConfig = {
  apiKey: 'AIzaSyDIFAv-KvXT4wrzMtWe0tI7n6bKCvzdagE',
  authDomain: 'ecommitment-qa.firebaseapp.com',
  projectId: 'ecommitment-qa',
  storageBucket: 'ecommitment-qa.appspot.com',
  messagingSenderId: 494293929307,
  appId: '1:494293929307:web:07ea3be85f2bd2b6155e7e',
  measurementId: 'G-7RW5FLG27Q',
};

export const FirebaseConfig = firebaseConfig;
