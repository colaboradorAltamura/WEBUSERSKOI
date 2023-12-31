// ** React Imports
import { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field';

// ** Third Party Imports

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Store Imports

// ** Actions Imports

// ** Types Imports
import { SelectChangeEvent } from '@mui/material';
import Loader from 'src/@core/components/loader';
import { getUDRoleLabel, handleError, hasRole } from 'src/@core/coreHelper';

import { listUserDefinedRols } from 'src/services/entitiesSchemasServices';
import { createUser } from 'src/services/usersServices';
import { IUserRol } from 'src/types/entities';
import { IUser } from 'src/types/users';
import { UserStatusTypes } from 'src/types/@autogenerated';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

interface SidebarAddUserType {
  open: boolean;
  toggle: () => void;
  onUserCreated: (user: IUser) => void;
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between',
}));

const SidebarAddUser = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle, onUserCreated } = props;

  // ** State

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [loadingUDRols, setLoadingUDRols] = useState<boolean>(true);
  const [udRols, setUDRols] = useState<IUserRol[]>([]);

  const [selectedUDRols, setSelectedUDRols] = useState<string[]>([]);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  useEffect(() => {
    const doAsync = async () => {
      try {
        setLoadingUDRols(true);

        const response = await listUserDefinedRols();

        setUDRols(
          response.items.filter((item) => {
            return !item.isSchemaRelated;
          })
        );
        setLoadingUDRols(false);
      } catch (e) {
        setLoadingUDRols(false);
        handleError(e);
      }
    };

    doAsync();
  }, []);

  const handleClose = () => {
    toggle();
  };

  const handleChangeUDRols = (event: SelectChangeEvent<unknown>) => {
    setSelectedUDRols(event.target.value as string[]);
  };

  const handleSubmit = async () => {
    try {
      setLoadingSubmit(true);
      let newId = null;

      const newUserData = {
        firstName,
        lastName,
        phoneNumber,
        email,

        appUserStatus: UserStatusTypes.USER_STATUS_TYPE_ACTIVE,
      } as IUser;
      // if (hasRole(appRols, UserDefinedRols.UDR_PATIENT)) {
      //   const newUserDataResponse = await createPatient(newUserData);

      //   newId = newUserDataResponse.id;
      // } else {
      const newUserDataResponse = await createUser(newUserData);
      newId = newUserDataResponse.id;
      // }
      newUserData.id = newId;

      // if (selectedUDRols) {
      //   await createUserRole(newId, { bulkRolsIds: selectedUDRols });
      // }

      if (onUserCreated) onUserCreated(newUserData);

      // setUserState(newUserData);

      handleClose();
      setLoadingSubmit(false);
    } catch (e) {
      handleError(e);
      setLoadingSubmit(false);
    }
  };

  const renderUDRolsChangeOptions = () => {
    const options = udRols.map((rol) => {
      return {
        label: getUDRoleLabel(udRols, rol.name),
        value: rol.id,
        checked: hasRole(selectedUDRols, rol.id),
      };
    });

    return options.map((op, key) => {
      return (
        <MenuItem value={op.value} key={key}>
          <Checkbox checked={op.checked} />
          <ListItemText primary={op.label} />
        </MenuItem>
      );
    });
  };

  if (loadingSubmit || loadingUDRols) return <Loader />;

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>Add User</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: (theme) => `rgba(${theme.palette.customColors.main}, 0.16)`,
            },
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: (theme) => theme.spacing(0, 6, 6) }}>
        <form>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='First Name'
                placeholder='John'
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Last Name'
                placeholder='Doe'
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <CustomTextField
                fullWidth
                type='email'
                label='Email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder='john.doe@gmail.com'
              />
            </Grid>
            {/* <Grid item xs={12} sm={12}>
              <CustomTextField
                select
                fullWidth
                label='Rols'
                id='select-multiple-checkbox'
                SelectProps={{
                  MenuProps,
                  multiple: true,
                  value: selectedUDRols,
                  onChange: (e) => handleChangeUDRols(e),
                  renderValue: (selected: any) => {
                    const newVal = [...selected] as string[];

                    return newVal
                      .map((item) => {
                        return getUDRoleLabel(udRols, item);
                      })
                      .join(', ');
                  },
                }}
              >
                {renderUDRolsChangeOptions()}
              </CustomTextField>
            </Grid> */}
            <Grid item xs={12} sm={12}>
              <CustomTextField
                fullWidth
                label='Phone Number'
                value={phoneNumber}
                placeholder='+5491111223311'
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
            <Button type='button' variant='contained' sx={{ mr: 3 }} onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant='tonal' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default SidebarAddUser;
