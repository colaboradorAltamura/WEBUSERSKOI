// ** Next Import
import Link from 'next/link';

// ** MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import List, { ListProps } from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Theme, styled, useTheme } from '@mui/material/styles';

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field';

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip';

// ** Icon Imports
import Icon from 'src/@core/components/icon';
import Loader from 'src/@core/components/loader';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useRouter } from 'next/router';

const StyledList = styled(List)<ListProps>(({ theme }) => ({
  padding: 0,
  '& .MuiListItem-root': {
    padding: theme.spacing(6),
    border: `1px solid ${theme.palette.divider}`,
    '&:first-of-type': {
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
    },
    '&:last-of-type': {
      borderBottomLeftRadius: 6,
      borderBottomRightRadius: 6,
    },
    '&:not(:last-of-type)': {
      borderBottom: 0,
    },
    '& .MuiListItemText-root': {
      marginTop: 0,
      marginBottom: theme.spacing(4),
      '& .MuiTypography-root': {
        color: theme.palette.text.secondary,
      },
    },
    '& .remove-item': {
      top: '0.5rem',
      right: '0.625rem',
      position: 'absolute',
      color: theme.palette.text.disabled,
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}));

const UiBuilder = ({ handleNext }: { handleNext: () => void }) => {
  // ** Hooks
  const theme = useTheme();
  const breakpointMD = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'lg'));
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const doAsync = async () => {
      setIsLoading(false);
    };
    doAsync();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={12}>
        {/* <Alert severity='success' icon={<Icon icon='tabler:bookmarks' />} sx={{ mb: 4 }}>
          <AlertTitle>Available Offers</AlertTitle>
          <div>
            <Typography sx={{ color: 'success.main' }}>
              - 10% Instant Discount on Bank of America Corp Bank Debit and Credit cards
            </Typography>
            <Typography sx={{ color: 'success.main' }}>
              - 25% Cashback Voucher of up to $60 on first ever PayPal transaction. TCA
            </Typography>
          </div>
        </Alert> */}
        <Card sx={{ mb: 4 }}>
          <CardHeader
            title=''
            action={
              <>
                {/* <Button onClick={() => {}} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                  <Icon fontSize='1.125rem' icon='tabler:plus' />
                  Import
                </Button> */}
              </>
            }
          />
        </Card>

        <Typography variant='h5' sx={{ mb: 4 }}>
          Custom pages
        </Typography>

        <StyledList sx={{ mb: 4 }}>
          <ListItem>
            <ListItemAvatar sx={{ display: 'flex', '& img': { my: 5, mx: 8 } }}>
              <img height={100} src='/images/products/google-home.png' alt='' />
            </ListItemAvatar>
            <IconButton size='small' className='remove-item' sx={{ color: 'text.primary' }}>
              <Icon icon='tabler:x' fontSize={20} />
            </IconButton>
            <Grid container>
              <Grid item xs={12} md={8}>
                <ListItemText primary='My first page' />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, color: 'text.disabled' }}>Path:</Typography>
                  <Typography
                    href='/a/my-first-page'
                    component={Link}
                    sx={{ mr: 4, color: 'primary.main', textDecoration: 'none' }}
                  >
                    /my-first-page
                  </Typography>
                  <CustomChip rounded size='small' skin='light' color='success' label='Active' />
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ mt: [6, 6, 8] }}>
                <Box
                  sx={{
                    gap: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'flex-end' },
                  }}
                >
                  <Button
                    variant='tonal'
                    size='small'
                    onClick={() => {
                      router.push('/ui-builder/pages/my-first-page');
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </ListItem>
        </StyledList>
        <Box
          sx={{
            px: 5,
            gap: 2,
            py: 2.5,
            display: 'flex',
            borderRadius: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            href='/'
            component={Link}
            onClick={(e) => e.preventDefault()}
            sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
          >
            Add more products from wishlist
          </Typography>
          <Icon icon={theme.direction === 'ltr' ? 'tabler:chevron-right' : 'tabler:chevron-left'} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default UiBuilder;
