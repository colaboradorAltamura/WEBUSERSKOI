// ** React Imports
import { useState, useEffect, ReactElement, SyntheticEvent } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** MUI Components
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import Typography from '@mui/material/Typography';
import { styled, Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MuiTabList, { TabListProps } from '@mui/lab/TabList';
import CircularProgress from '@mui/material/CircularProgress';

// ** Type Import
import { TeamsTabType, ProfileTabType, ProjectsTabType, ConnectionsTabType, UserProfileActiveTab } from 'src/types';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Demo Components
import Teams from 'src/views/pages/user-profile/teams';
import Profile from 'src/views/pages/user-profile/profile';
import Projects from 'src/views/pages/user-profile/projects';
import Connections from 'src/views/pages/user-profile/connections';
import UserProfileHeader from 'src/views/pages/user-profile/UserProfileHeader';
import { getCurrentUser } from 'src/services/usersServices';
import { handleError } from 'src/@core/coreHelper';

import { useCurrentUser } from 'src/hooks/useCurrentUser';
import Loader from 'src/@core/components/loader';

const UserProfile = () => {
  // ** State

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toggleData, setToggleData] = useState<boolean>(false);

  // ** Hooks

  const currentUser = useCurrentUser();

  useEffect(() => {
    try {
      const doAsync = async () => {
        if (currentUser.isLoading) return;

        setIsLoading(false);
      };
      doAsync();
    } catch (e) {
      handleError(e);
    }
  }, [toggleData]);

  // const IDToken =
  //   'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY5MDM5NDEwNSwiZXhwIjoxNjkwMzk3NzA1LCJpc3MiOiJyaWF0LXFhQGFwcHNwb3QuZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6InJpYXQtcWFAYXBwc3BvdC5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoiYTF3NGU1VFU3TFhwZEt5T0YwcXNhb2NiekUxMyIsImNsYWltcyI6eyJjdXN0b21Ub2tlbiI6dHJ1ZX19.LppXaRBb8t2bWS8V6u9S0nv6xap3OKlt0udaaGe910P0T6W981B54jbpyekrmDv_FM63uLnnWM0Ysc9smxYbDv1m_Uv2woKDYdpvS6W1PJdZaytpyW2eIfmZTrM_ZwnsMuDEL_iDSTszmJbUF9BpH9ce1FzzRV3uD1EjvGB-RqArvbd5bPylMjxEZTKnjp_8B2JMHVQ6jldCaVAztwjcsCZRI8y3RLBme5BXnbhYYfQummedaHSxQ8aH68m8TjKOP3b15AYySm6F3kCgvl55h5GIVJ6ArhXmlzni33mdaOW-IiJy0f1JHqbzy184mkcKOkiwfygWU6XXxE1o_lPU5w';
  // const auth = getAuth();
  // const userCredential = await signInWithCustomToken(auth, IDToken);

  // const token = await userCredential.user.getIdToken();
  // const tokenResult = await userCredential.user.getIdTokenResult();

  if (isLoading || !currentUser.currentUser) return <Loader />;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader user={currentUser.currentUser} />
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Profile user={currentUser.currentUser} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserProfile;
