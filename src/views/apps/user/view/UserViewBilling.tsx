// ** React Imports
import { useState, ChangeEvent } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';
import TableContainer from '@mui/material/TableContainer';
import FormControlLabel from '@mui/material/FormControlLabel';
import DialogContentText from '@mui/material/DialogContentText';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Third Party Imports
import Payment from 'payment';
import Cards, { Focused } from 'react-credit-cards';

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip';
import CustomTextField from 'src/@core/components/mui/text-field';

// ** Util Import
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from 'src/@core/utils/format';

// ** Types
import { ThemeColor } from 'src/@core/layouts/types';

// ** Styled Component Imports
import CardWrapper from 'src/@core/styles/libs/react-credit-cards';

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css';

interface DataType {
  name: string;
  imgSrc: string;
  imgAlt: string;
  cardCvc: string;
  expiryDate: string;
  cardNumber: string;
  cardStatus?: string;
  badgeColor?: ThemeColor;
}

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize,
}));

// ** Styled <sub> component
const Sub = styled('sub')(({ theme }) => ({
  fontWeight: 300,
  alignSelf: 'flex-end',
  color: theme.palette.text.disabled,
  fontSize: theme.typography.body1.fontSize,
}));

const data: DataType[] = [
  {
    cardCvc: '587',
    name: 'Tom McBride',
    expiryDate: '12/24',
    imgAlt: 'Mastercard',
    cardNumber: '5577 0000 5577 9865',
    imgSrc: '/images/logos/mastercard.png',
  },
  {
    cardCvc: '681',
    imgAlt: 'Visa card',
    expiryDate: '02/24',
    badgeColor: 'primary',
    cardStatus: 'Primary',
    name: 'Mildred Wagner',
    cardNumber: '4532 3616 2070 5678',
    imgSrc: '/images/logos/visa.png',
  },
  {
    cardCvc: '3845',
    expiryDate: '08/20',
    name: 'Lester Jennings',
    imgAlt: 'American Express card',
    cardNumber: '3700 000000 00002',
    imgSrc: '/images/logos/american-express.png',
  },
];

const UserViewBilling = () => {
  // ** States
  const [cvc, setCvc] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [focus, setFocus] = useState<Focused>();
  const [cardId, setCardId] = useState<number>(0);
  const [expiry, setExpiry] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [dialogTitle, setDialogTitle] = useState<string>('Add');
  const [openEditCard, setOpenEditCard] = useState<boolean>(false);
  const [openAddressCard, setOpenAddressCard] = useState<boolean>(false);
  const [openUpgradePlans, setOpenUpgradePlans] = useState<boolean>(false);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false);

  // Handle Edit Card dialog and get card ID
  const handleEditCardClickOpen = (id: number) => {
    setDialogTitle('Edit');
    setCardId(id);
    setCardNumber(data[id].cardNumber);
    setName(data[id].name);
    setCvc(data[id].cardCvc);
    setExpiry(data[id].expiryDate);
    setOpenEditCard(true);
  };

  const handleAddCardClickOpen = () => {
    setDialogTitle('Add');
    setCardNumber('');
    setName('');
    setCvc('');
    setExpiry('');
    setOpenEditCard(true);
  };

  const handleEditCardClose = () => {
    setDialogTitle('Add');
    setCardNumber('');
    setName('');
    setCvc('');
    setExpiry('');
    setOpenEditCard(false);
  };

  // Handle Upgrade Plan dialog
  const handleUpgradePlansClickOpen = () => setOpenUpgradePlans(true);
  const handleUpgradePlansClose = () => setOpenUpgradePlans(false);

  const handleBlur = () => setFocus(undefined);

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.name === 'number') {
      target.value = formatCreditCardNumber(target.value, Payment);
      setCardNumber(target.value);
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value);
      setExpiry(target.value);
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value, cardNumber, Payment);
      setCvc(target.value);
    }
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Billing Address'
            action={
              <Button variant='contained' onClick={() => setOpenAddressCard(true)}>
                Edit Address
              </Button>
            }
          />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12} lg={6}>
                <TableContainer>
                  <Table size='small' sx={{ width: '95%' }}>
                    <TableBody
                      sx={{
                        '& .MuiTableCell-root': {
                          border: 0,
                          pt: 2,
                          pb: 2,
                          pl: '0 !important',
                          pr: '0 !important',
                          verticalAlign: 'unset',
                          '&:first-of-type': {
                            width: 150,
                          },
                        },
                      }}
                    >
                      <TableRow>
                        <TableCell>
                          <Typography sx={{ fontWeight: 500 }}>Company Name:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: 'text.secondary' }}>Koi Ventures</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography sx={{ fontWeight: 500 }}>Billing Email:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: 'text.secondary' }}>gertrude@gmail.com</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography sx={{ fontWeight: 500 }}>Tax ID:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: 'text.secondary' }}>TAX-875623</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography sx={{ fontWeight: 500 }}>VAT Number:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: 'text.secondary' }}>SDF754K77</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography sx={{ fontWeight: 500 }}>Billing Address:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: 'text.secondary' }}>
                            100 Water Plant Avenue, Building 1303 Wake Island
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} lg={6}>
                <TableContainer>
                  <Table size='small'>
                    <TableBody
                      sx={{
                        '& .MuiTableCell-root': {
                          border: 0,
                          pt: 2,
                          pb: 2,
                          pl: '0 !important',
                          pr: '0 !important',
                          verticalAlign: 'unset',
                          '&:first-of-type': {
                            width: 150,
                          },
                        },
                      }}
                    >
                      <TableRow>
                        <TableCell>
                          <Typography sx={{ fontWeight: 500 }}>Contact:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: 'text.secondary' }}>+1(609) 933-44-22</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography sx={{ fontWeight: 500 }}>Country:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: 'text.secondary' }}>Australia</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography sx={{ fontWeight: 500 }}>State:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: 'text.secondary' }}>Queensland</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography sx={{ fontWeight: 500 }}>Zip Code:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: 'text.secondary' }}>403114</Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </CardContent>

          <Dialog
            open={openAddressCard}
            onClose={() => setOpenAddressCard(false)}
            aria-labelledby='user-address-edit'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
            aria-describedby='user-address-edit-description'
          >
            <DialogTitle
              id='user-address-edit'
              sx={{
                textAlign: 'center',
                fontSize: '1.625rem !important',
                px: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pt: (theme) => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
              }}
            >
              Edit Address
            </DialogTitle>
            <DialogContent
              sx={{
                pb: (theme) => `${theme.spacing(8)} !important`,
                px: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              }}
            >
              <DialogContentText id='user-address-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                Edit Address for future billing
              </DialogContentText>
              <form>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      defaultValue='Koi Ventures'
                      label='Company Name'
                      placeholder='Koi Ventures'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      type='email'
                      label='Email'
                      placeholder='john.doe@gmail.com'
                      defaultValue='gertrude@gmail.com'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField fullWidth defaultValue='TAX-875623' label='Tax ID' placeholder='TAX-875623' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField fullWidth defaultValue='SDF754K77' label='VAT Number' placeholder='SDF754K77' />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextField
                      fullWidth
                      multiline
                      minRows={2}
                      label='Billing Address'
                      placeholder='12, Business Park, Mall Road'
                      defaultValue='100 Water Plant Avenue, Building 1303 Wake Island'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label='Contact'
                      placeholder='723-348-2344'
                      defaultValue='+1(609) 933-44-22'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField select fullWidth id='country-select' defaultValue='usa' label='Country'>
                      <MenuItem value='usa'>USA</MenuItem>
                      <MenuItem value='uk'>UK</MenuItem>
                      <MenuItem value='france'>France</MenuItem>
                      <MenuItem value='germany'>Germany</MenuItem>
                      <MenuItem value='japan'>Japan</MenuItem>
                    </CustomTextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField fullWidth defaultValue='Capholim' label='State' placeholder='California' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      type='number'
                      label='Zip Code'
                      placeholder='99950'
                      defaultValue='403114'
                    />
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: 'center',
                px: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: (theme) => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
              }}
            >
              <Button variant='contained' sx={{ mr: 2 }} onClick={() => setOpenAddressCard(false)}>
                Submit
              </Button>
              <Button variant='tonal' color='secondary' onClick={() => setOpenAddressCard(false)}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Grid>
    </Grid>
  );
};

export default UserViewBilling;
