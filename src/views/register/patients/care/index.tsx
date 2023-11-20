// ** React Imports
import { ReactNode } from 'react';

// ** React Imports

// ** MUI Components
import Box from '@mui/material/Box';
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout';

// ** Configs

// ** Demo Components Imports
// ** Type Import

import { useSettings } from 'src/@core/hooks/useSettings';
import CountryDropdown from 'src/@core/layouts/components/shared-components/CountryDropdown';
import ApplicantsMultiSteps from './multi-steps-wizard';

import { ApplicantsOnboardingProvider } from 'src/context/ApplicantsOnboardingContext';

const backgroundImage = {
  backgroundImage: `url('/images/banners/banner-main.png')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  height: '100%',
};

const RegisterPatientsCare = () => {
  // ** Hooks

  const { settings, saveSettings } = useSettings();

  return (
    <Box className='content-right' sx={{ ...backgroundImage, justifyContent: 'center', p: 5 }}>
      <Box
        sx={{
          p: [6, 12],
          height: '100%',
          width: '70%',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          backgroundColor: hexToRGBA('#ffffff', 0.5),
          borderRadius: 5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <img src='/images/logos/logo-completo.png' alt='Logo' width='200' />
        </Box>

        <CountryDropdown settings={settings} saveSettings={saveSettings} />

        <ApplicantsOnboardingProvider>
          <ApplicantsMultiSteps />
        </ApplicantsOnboardingProvider>
      </Box>
    </Box>
  );
};

RegisterPatientsCare.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

RegisterPatientsCare.guestGuard = true;

export default RegisterPatientsCare;
