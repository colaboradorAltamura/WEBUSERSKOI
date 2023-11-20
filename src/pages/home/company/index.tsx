// ** MUI Import
import Grid from '@mui/material/Grid';

// ** Next Import
import Link from 'next/link';

// ** Custom Component Imports
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// ** MUI Imports
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ** Icon Imports
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Icon from 'src/@core/components/icon';
import Loader from 'src/@core/components/loader';
import { ShortcutsType } from 'src/@core/layouts/components/shared-components/ShortcutsDropdown';
import { useAuth } from 'src/hooks/useAuth';
import { useCurrentUser } from 'src/hooks/useCurrentUser';

const HomeCompany = () => {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const auth = useAuth();

  const [isLoadingGrantedCompany, setIsLoadingGrantedCompany] = useState<boolean>(true);

  useEffect(() => {
    const doAsync = async () => {
      try {
        setIsLoadingGrantedCompany(true);

        if (currentUser.isLoading) return;

        setIsLoadingGrantedCompany(false);
      } catch (e: any) {
        setIsLoadingGrantedCompany(false);
      }
    };

    doAsync();
  }, [currentUser.isLoading]);

  const userFirstName = currentUser.currentUser ? currentUser.currentUser.firstName : '';
  const companyName = currentUser.currentCompany ? currentUser.currentCompany.name : '';

  const shortcuts: ShortcutsType[] = [
    {
      title: 'Calendar',
      url: '/apps/calendar',
      icon: 'tabler:calendar',
      subtitle: 'Appointments',
    },
    {
      title: 'Invoice App',
      url: '/apps/invoice/list',
      icon: 'tabler:file-invoice',
      subtitle: 'Manage Accounts',
    },
    {
      title: 'User App',
      icon: 'tabler:users',
      url: '/apps/user/list',
      subtitle: 'Manage Users',
    },
    {
      url: '/apps/roles',
      icon: 'tabler:lock',
      subtitle: 'Permissions',
      title: 'Role Management',
    },
    {
      subtitle: 'CRM',
      title: 'Dashboard',
      url: '/dashboards/crm',
      icon: 'tabler:device-analytics',
    },
    {
      title: 'Settings',
      icon: 'tabler:settings',
      subtitle: 'Account Settings',
      url: '/pages/account-settings/account',
    },
    {
      icon: 'tabler:help',
      title: 'Help Center',
      url: '/pages/help-center',
      subtitle: 'FAQs & Articles',
    },
    {
      title: 'Dialogs',
      icon: 'tabler:square',
      subtitle: 'Useful Popups',
      url: '/pages/dialog-examples',
    },
  ];

  return (
    <ApexChartWrapper>
      <Card>
        <CardHeader
          sx={{ textTransform: 'capitalize' }}
          title={t('bienvenido') + ' ' + userFirstName + ' 🎉 - ' + companyName}
        />
        {isLoadingGrantedCompany && <Loader />}

        <CardContent>
          <Grid
            container
            spacing={0}
            sx={{
              '& .MuiGrid-root': {
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                '&:nth-of-type(odd)': { borderRight: (theme) => `1px solid ${theme.palette.divider}` },
              },
            }}
          >
            {shortcuts.map((shortcut) => (
              <Grid
                item
                xs={6}
                key={shortcut.title}
                onClick={() => {
                  alert(1);
                }}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <Box
                  component={Link}
                  href={shortcut.url}
                  sx={{
                    p: 6,
                    display: 'flex',
                    textAlign: 'center',
                    alignItems: 'center',
                    textDecoration: 'none',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Avatar sx={{ mb: 2, width: 48, height: 48 }}>
                    <Icon fontSize='1.5rem' icon={shortcut.icon} />
                  </Avatar>
                  <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{shortcut.title}</Typography>
                  <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                    {shortcut.subtitle}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </ApexChartWrapper>
  );
};

export default HomeCompany;
