// ** React Imports
import { ReactNode, useEffect } from 'react';

// ** Next Imports
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import App from 'next/app';
import Head from 'next/head';
import { Router } from 'next/router';

// ** Store Imports
import { Provider } from 'react-redux';
import { store } from 'src/store';

// ** Loader Import
import NProgress from 'nprogress';

// ** Emotion Imports
import type { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

// ** Config Imports
import 'src/configs/i18n';

// import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig';

// ** Third Party Import
import { Toaster } from 'react-hot-toast';

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout';

import { CookiesProvider } from 'react-cookie';

// import AclGuard from 'src/@core/components/auth/AclGuard'
import AuthGuard from 'src/@core/components/auth/AuthGuard';
import GuestGuard from 'src/@core/components/auth/GuestGuard';
import ThemeComponent from 'src/@core/theme/ThemeComponent';

// ** Spinner Import
import Spinner from 'src/@core/components/spinner';

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext';
import { AuthProvider } from 'src/context/AuthContext';
import { CurrentUserProvider } from 'src/context/CurrentUserContext';
import { DynamicsProvider } from 'src/context/DynamicsContext';

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast';

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache';

// ** Prismjs Styles
import 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/themes/prism-tomorrow.css';

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css';

import 'src/iconify-bundle/icons-bundle-react';

// ** Global css styles
import { loadScript } from 'src/@core/coreHelper';
import '../../styles/globals.css';

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage;
  emotionCache: EmotionCache;
};

type GuardProps = {
  authGuard: boolean;
  guestGuard: boolean;
  children: ReactNode;
};

const clientSideEmotionCache = createEmotionCache();

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start();
  });
  Router.events.on('routeChangeError', () => {
    NProgress.done();
  });
  Router.events.on('routeChangeComplete', () => {
    NProgress.done();
  });
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>;
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>;
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>;
  }
};

// ** Configure JSS & ClassName
const MyApp = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false;
  const getLayout =
    Component.getLayout ?? ((page) => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>);

  const setConfig = Component.setConfig ?? undefined;

  const authGuard = Component.authGuard ?? true;

  const guestGuard = Component.guestGuard ?? false;

  useEffect(() => {
    const win: any = window;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    win.onGoogleMapsLoaded = () => {};

    // const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const apiKey = 'AIzaSyA9TTOIdiEekAMQIAijN_0jqTwZ4FcfNPk';

    if (!win.google || !win.google.maps) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=onGoogleMapsLoaded`,
        () => {
          console.log('google maps autocomplete loaded');
        }
      );
    }
  }, []);

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${themeConfig.templateName}`}</title>
          <meta name='description' content={`${themeConfig.templateName}`} />
          <meta name='keywords' content={`${themeConfig.templateName}`} />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>
        <CookiesProvider>
          <AuthProvider>
            <CurrentUserProvider>
              <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
                <SettingsConsumer>
                  {({ settings }) => {
                    return (
                      <ThemeComponent settings={settings}>
                        <DynamicsProvider>
                          <Guard authGuard={authGuard} guestGuard={guestGuard}>
                            {getLayout(<Component {...pageProps} />)}
                          </Guard>
                          <ReactHotToast>
                            <Toaster
                              position={settings.toastPosition}
                              toastOptions={{ className: 'react-hot-toast' }}
                            />
                          </ReactHotToast>
                        </DynamicsProvider>
                      </ThemeComponent>
                    );
                  }}
                </SettingsConsumer>
              </SettingsProvider>
            </CurrentUserProvider>
          </AuthProvider>
        </CookiesProvider>
      </CacheProvider>
    </Provider>
  );
};

MyApp.getInitialProps = async (appContext: any) => ({ ...(await App.getInitialProps(appContext)) });

export default MyApp;
