// ** React Imports
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

// ** MUI Components
import { Button, capitalize, Grid, GridProps, Typography } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout';

// ** Configs
import { useSettings } from 'src/@core/hooks/useSettings';
import themeConfig from 'src/configs/themeConfig';
import { useRouter } from 'next/router';

// ** calendly
import { InlineWidget } from 'react-calendly';

// ** Icon Imports

// ** custom components
import CountryDropdown from 'src/@core/layouts/components/shared-components/CountryDropdown';

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';

const LeftWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12),
  '& .img-mask': {
    left: 0,
  },
}));

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(7.5, 36),
  backgroundColor: hexToRGBA(theme.palette.primary.main, 0.04),
  [theme.breakpoints.down('xl')]: {
    padding: theme.spacing(7, 20),
  },
  [theme.breakpoints.down('md')]: {
    textAlign: 'center',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(7, 5),
  },
}));

const Img = styled('img')(({ theme }) => ({
  bottom: 0,
  right: 144,
  height: 230,
  position: 'absolute',
  [theme.breakpoints.down('md')]: {
    width: 200,
    position: 'static',
  },
  [theme.breakpoints.down('sm')]: {
    width: 180,
  },
}));

const RegisterSuccessPatientsCare = () => {
  // ** Hooks
  const theme = useTheme();
  const { settings, saveSettings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down('lg'));
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <LeftWrapper>
        <Box sx={{ top: 26, left: 26, display: 'flex', position: 'absolute', alignItems: 'center' }}>
          <svg width={34} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              fill={theme.palette.primary.main}
              d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
            />
            <path
              fill='#161616'
              opacity={0.06}
              fillRule='evenodd'
              clipRule='evenodd'
              d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
            />
            <path
              fill='#161616'
              opacity={0.06}
              fillRule='evenodd'
              clipRule='evenodd'
              d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              fill={theme.palette.primary.main}
              d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
            />
          </svg>
          <Typography sx={{ ml: 2.5, fontWeight: 600, lineHeight: '24px', fontSize: '1.375rem' }}>
            {themeConfig.templateName}
          </Typography>
        </Box>

        <Box sx={{ mt: 5 }}>
          <BoxWrapper>
            <Grid container spacing={5} sx={{ marginRight: 30 }}>
              <Grid item xs={12} md={9} sx={{ mr: 20 }}>
                <Typography variant='h3' sx={{ mb: 1.5, color: 'primary.main' }}>
                  ¡{capitalize(t('information completed'))}!
                </Typography>
                <Grid xs={12} md={9}>
                  <Typography sx={{ color: 'text.secondary' }}>
                    <Typography style={{ fontWeight: 'bold' }}>
                      {capitalize(t('please wait while we validate your data'))}
                    </Typography>
                    {capitalize(t('if you havent booked an interview you can do it here'))}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} md={3}>
                <Img alt='pricing-cta-avatar' src='/images/pages/girl-with-laptop.png' />
              </Grid>
            </Grid>
          </BoxWrapper>
          <Button variant='contained' onClick={() => router.push('/home/patient/')} sx={{ '& svg': { ml: 2 } }}>
            {capitalize(t('return') as string)}
            <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
          </Button>
        </Box>
      </LeftWrapper>
      <CountryDropdown settings={settings} saveSettings={saveSettings} />
      <InlineWidget url='https://calendly.com/anajmoura/entrevista-de-admissao' />
    </>
  );
};

RegisterSuccessPatientsCare.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

RegisterSuccessPatientsCare.guestGuard = true;

export default RegisterSuccessPatientsCare;
