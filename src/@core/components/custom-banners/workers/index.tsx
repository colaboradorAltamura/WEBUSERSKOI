// ** React Imports
import { useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import { Theme, useTheme } from '@mui/material/styles';

// ** Third Party Components
import clsx from 'clsx';
import { useKeenSlider } from 'keen-slider/react';

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar';
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';
import { t } from 'i18next';
import { CardContent, Link } from '@mui/material';

interface SwiperData {
  img: string;
  title: string;
  onClick: () => void;
  labelLink: string;
  subTitle: string;
}

const handleOpenWhatsapp = () => {
  const phoneEnlite = '+5491176360496'; //move to global variables
  const whatsappApiLink = `https://wa.me/${phoneEnlite}?text=Hola, quisiera%20`;
  window.open(whatsappApiLink, '_blank');
};

const data: SwiperData[] = [
  {
    title: 'learning',
    img: '/images/cards/graphic-illustration-3.png',
    labelLink: 'access',
    onClick: () => alert('learning'),
    subTitle: 'to our training platform',
  },
  {
    title: 'benefits',
    img: '/images/cards/congratulations-john.png',
    labelLink: 'access',
    onClick: () => alert('benefits'),
    subTitle: 'our benefits',
  },
  {
    title: 'contact us',
    img: '/images/cards/graphic-illustration-2.png',
    labelLink: 'access',
    onClick: handleOpenWhatsapp,
    subTitle: 'questions or suggestions',
  },
];

const Banners = ({ theme }: { theme: Theme }) => {
  return (
    <>
      {data.map((data: SwiperData, index: number) => {
        return (
          <Grid item xs={12} sm={4} key={index} md={4} sx={{ paddingTop: '0px' }}>
            <Card
              sx={{
                minHeight: 100,
                backgroundColor: 'primary.main',
                '& .MuiTypography-root': { color: 'common.white' },
              }}
            >
              <CardContent sx={{ padding: '15px !important' }}>
                <Grid item xs={12} sm={12}>
                  <Typography variant='h5'>{t(data.title)}</Typography>
                  <Grid item key={index} xs={12}>
                    <Typography sx={{ fontSize: 12 }} color='text.secondary' gutterBottom>
                      {t(data.subTitle)}
                      <Link href={'#'} onClick={data.onClick} sx={{ color: '#ffd701 !important' }} underline='hover'>
                        {t(data.labelLink)}
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </>
  );
};

const BannersWorker = () => {
  // ** States
  const [loaded, setLoaded] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // ** Hook
  const theme = useTheme();

  return (
    <Grid
      container
      spacing={3}
      sx={{
        display: 'flex',
        alignContent: 'right',
        alignItems: 'right',
        marginBottom: '10px',
        paddingTop: '0px',
      }}
    >
      <Banners theme={theme} />
    </Grid>
  );
};

export default BannersWorker;
