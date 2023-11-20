// ** MUI Import
import Grid from '@mui/material/Grid';

// ** Demo Component Imports

// ** Custom Component Imports
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // Fix para los refresh de pagina para componentes dynamicos eg: [id] ó [schemaName]
    if (window.location.pathname != router.pathname) {
      console.log('Redirecting next router because a refresh');
      router.push(`${window.location.pathname}`);
    }
  }, []);

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        Main home
      </Grid>
    </ApexChartWrapper>
  );
};

Home.authGuard = true;

export default Home;
