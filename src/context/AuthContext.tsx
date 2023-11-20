// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react';

// ** Next Import
// import { useRouter } from 'next/router';

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, InputSocialAuthParams, RegisterParams } from './types';

import { authRef } from 'src/configs/firebase';
import { getAuth, signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { getErrorData, refreshUserToken } from 'src/@core/coreHelper';
import { signIn, signUp, signUpFederatedAuth } from 'src/services/usersServices';
import { IFirebaseUser } from 'src/types/users';

// ** Defaults
const defaultProvider: AuthValuesType = {
  authStatusReported: false,
  isAuthenticated: false,

  user: null,

  isLoading: true,
  authError: null,
  setUser: () => null,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  loginSocialAuth: () => Promise.resolve(),
  registerSocialAuth: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<IFirebaseUser | null>(defaultProvider.user);
  const [authStatusReported, setAuthStatusReported] = useState<boolean>(defaultProvider.authStatusReported);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(defaultProvider.isAuthenticated);
  const [isLoading, setIsLoading] = useState<boolean>(defaultProvider.isLoading);
  const [authError, setAuthError] = useState<any>(defaultProvider.authError);

  // ** Hooks
  // const router = useRouter();

  const processUserAuthentication = async (firebaseUser: User | null) => {
    try {
      setIsLoading(true);

      if (!firebaseUser) {
        setUser(null);
        setAuthStatusReported(true);
        setIsAuthenticated(false);
        setIsLoading(false);

        return;
      }

      const IsAuthenticatedResult = !!(firebaseUser && firebaseUser.email);

      const idTokenResult = await firebaseUser.getIdTokenResult();

      console.log('onAuthStateChange:', idTokenResult);
      const { appRols, orgRols, userDefinedRols, enterpriseRols, appUserStatus } = idTokenResult.claims as any;

      setUser({
        displayName: firebaseUser.displayName ? firebaseUser.displayName : '',
        email: firebaseUser.email,

        appUserStatus,
        appRols,
        orgRols,
        userDefinedRols,
        enterpriseRols,

        avatar: firebaseUser.photoURL,
        uid: firebaseUser.uid,
      });

      setAuthStatusReported(true);
      setIsAuthenticated(IsAuthenticatedResult);
      setAuthError(null);
      setIsLoading(false);
      console.log('Firebase IsAuthenticated', IsAuthenticatedResult);

      //   router.replace('/login')
    } catch (e: any) {
      setUser(null);
      setAuthStatusReported(true);
      setIsAuthenticated(false);
      setIsLoading(false);
      setAuthError(new Error(e.message));
    }
  };

  // solo se ejecuta la primera vez
  useEffect(() => {
    console.log('entro1');
    const unsub = authRef.onAuthStateChanged((firebaseUser) => {
      console.log('entro2');
      processUserAuthentication(firebaseUser);
    });

    // unsub();
  }, []);

  const handleLogin = async (
    params: LoginParams,
    successCallback: (user: any) => void,
    errorCallback?: ErrCallbackType
  ) => {
    try {
      setIsLoading(true);

      const auth = getAuth();

      const result = await signInWithEmailAndPassword(auth, params.email, params.password);

      // TODO MICHEL - por defecto lo hago setea en la unica org que existe, aca deberia dirigirlo a pick the org o team space en caso de no tener org asociada
      const userData = await signIn();

      if (!userData) throw new Error('User not found, please register first');

      await refreshUserToken();

      // The signed-in user info.
      await processUserAuthentication(result.user);

      setIsLoading(false);

      setAuthError(null);

      if (successCallback) successCallback(result.user);
    } catch (e) {
      console.error(e);

      setIsLoading(false);

      const errorData = getErrorData(e);

      const errorMessage = errorData.message.replace('Firebase:', '(F) ');

      setAuthError(new Error(errorMessage));

      if (errorCallback) errorCallback({ errorMessage: errorMessage });

      return null;

      // router.replace(redirectURL as string);
    }
  };

  const handleRegister = async (
    params: RegisterParams,
    successCallback: (user: any) => void,
    errorCallback?: ErrCallbackType
  ) => {
    try {
      // en la registracion no bloqueo la pantalla para que no pierda los valores el form
      // setIsLoading(true);

      const auth = getAuth();

      await signUp(params);

      const result = await signInWithEmailAndPassword(auth, params.email, params.password);

      const userData = await signIn();

      if (!userData) throw new Error('Error on sign up');

      await refreshUserToken();

      // The signed-in user info.
      await processUserAuthentication(result.user);

      setAuthError(null);

      // setIsLoading(false);

      if (successCallback) successCallback(result.user);
    } catch (e) {
      console.error(e);

      // setIsLoading(false);

      const errorData = getErrorData(e);

      const errorMessage = errorData.message.replace('Firebase:', '(F) ');

      setAuthError(new Error(errorMessage));

      if (errorCallback) errorCallback({ errorMessage: errorMessage });

      return null;
    }
  };

  const handleSocialAuthLogin = async (
    params: InputSocialAuthParams,
    successCallback: (user: any) => void,
    errorCallback?: ErrCallbackType
  ) => {
    try {
      if (params.providerType !== 'google') throw new Error('Only google allowed');

      setIsLoading(true);

      const auth = getAuth();

      const result = await signInWithPopup(auth, new GoogleAuthProvider());

      // TODO MICHEL - por defecto lo hago setea en la unica org que existe, aca deberia dirigirlo a pick the org o team space en caso de no tener org asociada
      const userData = await signIn();

      if (!userData) throw new Error('User not found, please register first');

      await refreshUserToken();

      // The signed-in user info.
      await processUserAuthentication(result.user);

      setIsLoading(false);

      if (successCallback) successCallback(result.user);
    } catch (e) {
      console.error(e);

      setIsLoading(false);

      const errorData = getErrorData(e);

      const errorMessage = errorData.message.replace('Firebase:', '(F) ');

      setAuthError(new Error(errorMessage));

      if (errorCallback) errorCallback({ errorMessage: errorMessage });
    }
  };

  const handleSocialAuthRegister = async (
    params: InputSocialAuthParams,
    successCallback: (user: any) => void,
    errorCallback?: ErrCallbackType
  ) => {
    try {
      if (params.providerType !== 'google') throw new Error('Only google allowed');

      setIsLoading(true);

      const auth = getAuth();

      const result = await signInWithPopup(auth, new GoogleAuthProvider());

      await signUpFederatedAuth();

      const userData = await signIn();

      if (!userData) throw new Error('Error on sign up');

      await refreshUserToken();

      // The signed-in user info.
      await processUserAuthentication(result.user);

      setAuthError(null);

      setIsLoading(false);

      if (successCallback) successCallback(result.user);
    } catch (e) {
      console.error(e);

      setIsLoading(false);

      const errorData = getErrorData(e);

      const errorMessage = errorData.message.replace('Firebase:', '(F) ');

      setAuthError(new Error(errorMessage));

      if (errorCallback) errorCallback({ errorMessage: errorMessage });
    }
  };

  const handleLogout = () => {
    setUser(null);

    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // window.location = '/';

        setUser(null);
        setAuthStatusReported(true);
        setIsAuthenticated(false);
        setIsLoading(false);

        const win: Window = window;
        win.location = '/';
      })
      .catch((e) => {
        console.error(e);
        throw e;

        // An error happened.
      });
  };

  const values = {
    user,
    authStatusReported,
    isAuthenticated,

    isLoading,
    authError,
    setUser,
    login: handleLogin,
    register: handleRegister,
    loginSocialAuth: handleSocialAuthLogin,
    registerSocialAuth: handleSocialAuthRegister,

    logout: handleLogout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
