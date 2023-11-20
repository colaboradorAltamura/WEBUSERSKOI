// ** React Imports
import { ChangeEvent, useState } from 'react';

// ** Next Import
import Link from 'next/link';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field';
import { handleError } from 'src/@core/coreHelper';
import { updateUserPassword } from 'src/services/adminServices';
import { IUser } from 'src/types/users';
import Loader from 'src/@core/components/loader';

interface State {
  newPassword: string;
  showNewPassword: boolean;
}

interface Props {
  user: IUser;
}

const UserViewSecurity = ({ user }: Props) => {
  // ** States
  const [loading, setLoading] = useState<boolean>(false);

  const [values, setValues] = useState<State>({
    newPassword: '',
    showNewPassword: false,
  });

  // Handle Password
  const handleNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword });
  };
  const changePassword = async () => {
    try {
      setLoading(true);

      const userResponse = await updateUserPassword(user.id, values.newPassword);

      // default values
      setValues({ ...values, newPassword: '', showNewPassword: false });

      setLoading(false);
    } catch (e) {
      setLoading(false);
      handleError(e);
    }
  };

  if (loading) return <Loader />;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Change Password' />
          <CardContent>
            <Alert icon={false} severity='warning' sx={{ mb: 4 }}>
              <AlertTitle
                sx={{ fontWeight: 500, fontSize: '1.125rem', mb: (theme) => `${theme.spacing(2.5)} !important` }}
              >
                Ensure that these requirements are met
              </AlertTitle>
              Minimum 8 characters long, uppercase & symbol
            </Alert>

            <form onSubmit={(e) => e.preventDefault()}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={12}>
                  <CustomTextField
                    fullWidth
                    label='New Password'
                    placeholder='············'
                    value={values.newPassword}
                    id='user-view-security-new-password'
                    onChange={handleNewPasswordChange('newPassword')}
                    type={values.showNewPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowNewPassword}
                            onMouseDown={(e) => e.preventDefault()}
                            aria-label='toggle password visibility'
                          >
                            <Icon fontSize='1.25rem' icon={values.showNewPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type='button'
                    variant='contained'
                    onClick={() => {
                      changePassword();
                    }}
                  >
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default UserViewSecurity;
