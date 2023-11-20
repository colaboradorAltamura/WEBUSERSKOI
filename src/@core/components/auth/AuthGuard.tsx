// ** React Imports
import { ReactElement, ReactNode, useEffect, useState } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** Hooks Import

import { useAuth } from 'src/hooks/useAuth';
import { UserDefinedRols } from 'src/types/userDefinedRols';
import { IFirebaseUser } from 'src/types/users';

import { useSettings } from 'src/@core/hooks/useSettings';

interface AuthGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props;
  const auth = useAuth();
  const router = useRouter();

  const [calledPush, setCalledPush] = useState(false); // <- add this state

  const { settings } = useSettings();

  const getCurrentUserHomeUrl = (user: IFirebaseUser) => {
    if (!user.userDefinedRols || !user.userDefinedRols.length) return null;

    if (
      settings.currentRole === UserDefinedRols.SYS_COMP_EMPLOYEE ||
      (!settings.currentRole && user.userDefinedRols.includes(UserDefinedRols.SYS_COMP_EMPLOYEE))
    )
      return '/home/company';

    // if (user.userDefinedRols.includes(UserDefinedRols.UDR_STAFF_ADMISSION)) return '/home/admission';
    if (
      settings.currentRole === UserDefinedRols.UDR_STAFF_ADMISSION ||
      (!settings.currentRole && user.userDefinedRols.includes(UserDefinedRols.UDR_STAFF_ADMISSION))
    )
      return '/home/admission';

    if (
      settings.currentRole === UserDefinedRols.UDR_STAFF_RECRUITER ||
      (!settings.currentRole && user.userDefinedRols.includes(UserDefinedRols.UDR_STAFF_RECRUITER))
    )
      return '/home/recruiter';

    if (
      settings.currentRole === UserDefinedRols.UDR_STAFF_CLINIC ||
      (!settings.currentRole && user.userDefinedRols.includes(UserDefinedRols.UDR_STAFF_CLINIC))
    )
      return '/home/clinic';
    if (
      settings.currentRole === UserDefinedRols.UDR_STAFF_SEEKER ||
      (!settings.currentRole && user.userDefinedRols.includes(UserDefinedRols.UDR_STAFF_SEEKER))
    )
      return '/home/seeker';

    if (
      settings.currentRole === UserDefinedRols.UDR_STAFF_SALES ||
      (!settings.currentRole && user.userDefinedRols.includes(UserDefinedRols.UDR_STAFF_SALES))
    )
      return '/home/sales';

    if (
      settings.currentRole === UserDefinedRols.UDR_STAFF_ADMINISTRATIVE ||
      (!settings.currentRole && user.userDefinedRols.includes(UserDefinedRols.UDR_STAFF_ADMINISTRATIVE))
    )
      return '/home/administrative';

    if (
      settings.currentRole === UserDefinedRols.UDR_WORKERS ||
      (!settings.currentRole && user.userDefinedRols.includes(UserDefinedRols.UDR_WORKERS))
    )
      return '/home/therapist';

    if (
      settings.currentRole === UserDefinedRols.UDR_PATIENT ||
      (!settings.currentRole && user.userDefinedRols.includes(UserDefinedRols.UDR_PATIENT))
    )
      return '/home/patient';

    if (
      settings.currentRole === UserDefinedRols.UDR_PATIENT_RELATIVE ||
      (!settings.currentRole && user.userDefinedRols.includes(UserDefinedRols.UDR_PATIENT_RELATIVE))
    )
      return '/home/patient';

    if (
      settings.currentRole === UserDefinedRols.UDR_STAFF_COMMERCIAL ||
      (!settings.currentRole && user.userDefinedRols.includes(UserDefinedRols.UDR_STAFF_COMMERCIAL))
    )
      return '/home/commercial';

    if (
      settings.currentRole === UserDefinedRols.UDR_STAFF_TRIAGE ||
      (!settings.currentRole && user.userDefinedRols.includes(UserDefinedRols.UDR_STAFF_TRIAGE))
    )
      return '/home/triage';

    return null;
  };

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      console.log('AuthGuard Data: ', { auth, calledPush, asPath: router.asPath });

      if (!auth.authStatusReported || auth.isLoading) return;

      if (calledPush) {
        return; // no need to call router.push() again
      }

      // si no esta logueado lo mando pal login
      if (!auth.user || !auth.user.appUserStatus) {
        setCalledPush(true); // <-- toggle 'true' after first redirect
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/login/care',
            query: { returnUrl: router.asPath },
          });
        } else {
          router.replace('/login/care');
        }
      } else if (router.asPath === '/') {
        const routeUrl = getCurrentUserHomeUrl(auth.user);
        if (routeUrl) router.replace(routeUrl);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route, auth]
  );

  console.log('status: ', auth.authStatusReported, 'isLoading: ', auth.isLoading);
  if (!auth.authStatusReported || auth.isLoading) {
    console.log('Returning fallback (1)');

    return fallback;
  }

  // no dejo que renderice la home si aun no ejecuto el redirect a /login
  if (router.asPath === '/' && (!auth.user || !auth.user.appUserStatus)) {
    console.log('Returning fallback (2)');

    return fallback;
  }

  console.log('Returning children');

  return <>{children}</>;
};

export default AuthGuard;
