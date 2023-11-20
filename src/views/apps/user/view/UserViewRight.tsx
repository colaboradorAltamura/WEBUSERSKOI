// ** React Imports
import { SyntheticEvent, useEffect, useState } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** MUI Imports
import TabContext from '@mui/lab/TabContext';
import MuiTabList, { TabListProps } from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import MuiTab, { TabProps } from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Demo Components Imports
import UserViewBilling from 'src/views/apps/user/view/UserViewBilling';
import UserViewSecurity from 'src/views/apps/user/view/UserViewSecurity';

// import UserViewConnection from 'src/views/apps/user/view/UserViewConnection';
// import UserViewNotification from 'src/views/apps/user/view/UserViewNotification';
import UserViewLocation from 'src/views/apps/user/view/UserViewLocation';
import UserViewRols from 'src/views/apps/user/view/UserViewRols';

// ** Types
import { hasRole } from 'src/@core/coreHelper';
import { AppRols } from 'src/types/appRols';

import { UserDefinedRols } from 'src/types/userDefinedRols';
import { IUser } from 'src/types/users';

interface Props {
  tab: string;
  user: IUser;
}

// ** Styled Tab component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1.5),
  },
}));

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`,
  },
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));

const UserViewRight = ({ tab, user }: Props) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ** Hooks
  const router = useRouter();

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true);
    setActiveTab(value);

    router
      .push({
        // pathname: `/apps/user/view/${value.toLowerCase()}`,
        pathname: `/users/${user.id}`,
        query: `tab=${value.toLowerCase()}`,
      })
      .then(() => setIsLoading(false));
  };

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }

    if (!tab) {
      setActiveTab('user-defined-rols');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // useEffect(() => {
  //   if (invoiceData) {
  //     setIsLoading(false);
  //   }
  // }, [invoiceData]);

  if (!activeTab) return null;

  return (
    <TabContext value={activeTab}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Tab value='user-defined-rols' label='Rols' icon={<Icon fontSize='1.125rem' icon='tabler:menu' />} />

        <Tab value='security' label='Security' icon={<Icon fontSize='1.125rem' icon='tabler:lock' />} />

        <Tab
          value='billing-plan'
          label='Billing & Plan'
          icon={<Icon fontSize='1.125rem' icon='tabler:currency-dollar' />}
        />
        <Tab value='location' label='Location' icon={<Icon fontSize='1.125rem' icon='tabler:map' />} />

        {hasRole(user.appRols, AppRols.APP_ADMIN) && (
          <Tab value='test-form' label='Test Form' icon={<Icon fontSize='1.125rem' icon='tabler:bell' />} />
        )}
      </TabList>
      <Box sx={{ mt: 4 }}>
        {isLoading ? (
          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <>
            <TabPanel sx={{ p: 0 }} value='user-defined-rols'>
              <UserViewRols user={user} />
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='security'>
              <UserViewSecurity user={user} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='billing-plan'>
              <UserViewBilling />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='location'>
              <UserViewLocation user={user} />
            </TabPanel>

            {/* <TabPanel sx={{ p: 0 }} value='notification'>
              <UserViewNotification />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='connection'>
              <UserViewConnection />
            </TabPanel> */}
          </>
        )}
      </Box>
    </TabContext>
  );
};

export default UserViewRight;
