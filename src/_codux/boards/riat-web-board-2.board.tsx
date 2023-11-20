import React from 'react';
import { createBoard } from '@wixc3/react-board';
import ThemeComponent from 'src/@core/theme/ThemeComponent';
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext';
import { AuthProvider } from 'src/context/AuthContext';
import Login from '../../pages/login/[productName]';

const setConfig = undefined;

process.env.ENVIRONMENT = 'local';
process.env.FIREBASE_PROJECT_ID = 'ecommitment-qa';
process.env.FIREBASE_API_KEY = 'AIzaSyDIFAv-KvXT4wrzMtWe0tI7n6bKCvzdagE';
process.env.FIREBASE_AUTH_DOMAIN = 'ecommitment-qa.firebaseapp.com';
process.env.FIREBASE_STORAGE_BUCKET = 'ecommitment-qa.appspot.com';
process.env.FIREBASE_MESSAGING_SENDER_ID = '494293929307';
process.env.FIREBASE_APP_ID = '1:494293929307:web:07ea3be85f2bd2b6155e7e';
process.env.FIREBASE_MEASURAMENT_ID = 'G-7RW5FLG27Q';

export default createBoard({
  name: 'web-board-2',
  Board: () => (
    <div>
      <AuthProvider>
        <SettingsProvider>
          <SettingsConsumer>
            {({ settings }) => {
              return (
                <ThemeComponent settings={settings}>
                  <Login />
                </ThemeComponent>
              );
            }}
          </SettingsConsumer>
        </SettingsProvider>
      </AuthProvider>
    </div>
  ),
  environmentProps: {
    windowWidth: 1028,
  },
});
