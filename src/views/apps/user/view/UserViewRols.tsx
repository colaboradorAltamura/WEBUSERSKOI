// ** React Imports
import { useEffect, useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

// ** Custom Component Import

// ** Third Party Imports
// ** Next Import

// ** React Imports

// ** MUI Imports

// ** Custom Component Import

// ** Third Party Imports

// ** Type Imports

import Button from '@mui/material/Button';
import Icon from 'src/@core/components/icon';
import Loader from 'src/@core/components/loader';
import { handleError } from 'src/@core/coreHelper';
import { listUserDefinedRols, upsertUserRole } from 'src/services/entitiesSchemasServices';
import { IUserRol } from 'src/types/entities';

// ** React Imports

// ** Next Import

// ** MUI Imports
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';

import FormControlLabel from '@mui/material/FormControlLabel';
import TableContainer from '@mui/material/TableContainer';
// ** Type Imports

import { IUser } from 'src/types/users';

import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { getUser, updateUser } from 'src/services/usersServices';
import { AppRols } from 'src/types/appRols';
import { OrgRols } from 'src/types/orgRols';

interface PropsType {
  user: IUser;
}

const UserViewRols = ({ user }: PropsType) => {
  // ** Hooks
  const currentUser = useCurrentUser();

  const initialAppRols: IUserRol[] = [
    {
      id: AppRols.APP_ADMIN,
      organizationId: '',
      name: 'SYS Admin',
      isSchemaRelated: false,
    },
  ];

  const initialOrgRols: IUserRol[] = [
    {
      id: OrgRols.ORG_ADMIN,
      organizationId: '',
      name: 'Admin',
      isSchemaRelated: false,
    },
    {
      id: OrgRols.ORG_AUDIT,
      organizationId: '',
      name: 'Auditor',
      isSchemaRelated: false,
    },
    {
      id: OrgRols.ORG_VIEWER,
      organizationId: '',
      name: 'Viewer',
      isSchemaRelated: false,
    },
  ];

  // ** State

  const [userRols, setUserRols] = useState<string[]>([]);
  const [userOrgRols, setUserOrgRols] = useState<any[]>([]);
  const [userAppRols, setUserAppRols] = useState<any[]>([]);

  const [allUserAppRols, setAllUserAppRols] = useState<IUserRol[]>(initialAppRols);
  const [allUserOrgRols, setAllUserOrgRols] = useState<IUserRol[]>(initialOrgRols);
  const [allUserDefinedRols, setAllUserDefinedRols] = useState<IUserRol[]>([]);

  const [loadingUserRols, setLoadingUserRols] = useState<boolean>(true);

  const [toggleUserDefinedRols, setToggleUserDefinedRols] = useState<boolean>(false);
  const [toggleUserAppRols, setToggleUserAppRols] = useState<boolean>(false);
  const [toggleUserOrgRols, setToggleUserOrgRols] = useState<boolean>(false);

  const [selectedUserDefinedRolsCheckbox, setSelectedUserDefinedRolsCheckbox] = useState<string[]>([]);
  const [selectedUserOrgRolsCheckbox, setSelectedUserOrgRolsCheckbox] = useState<string[]>([]);
  const [selectedUserAppRolsCheckbox, setSelectedUserAppRolsCheckbox] = useState<string[]>([]);

  const [loadingAllUserDefinedRoles, setLoadingAllUserDefinedRoles] = useState<boolean>(true);

  // ** Get User Rols
  useEffect(() => {
    const doAsyncGetUser = async () => {
      try {
        setLoadingUserRols(true);

        const responseData = (await getUser(user.id)) as IUser;

        setUserRols(responseData.userDefinedRols);
        setUserAppRols(responseData.appRols);
        setUserOrgRols(responseData.orgRols);

        setLoadingUserRols(false);
      } catch (e) {
        setLoadingUserRols(false);
        handleError(e);
      }
    };

    doAsyncGetUser();
  }, [user, toggleUserDefinedRols]);

  // ** <User Defined Rols>

  // ** Get User Defined Rols
  useEffect(() => {
    const doAsyncGetUserDefinedRols = async () => {
      try {
        setLoadingAllUserDefinedRoles(true);

        const responseData = await listUserDefinedRols();

        setAllUserDefinedRols(responseData.items);

        setLoadingAllUserDefinedRoles(false);
      } catch (e) {
        setLoadingAllUserDefinedRoles(false);
        handleError(e);
      }
    };

    doAsyncGetUserDefinedRols();
  }, []);

  // ** Set selected initial Rols
  useEffect(() => {
    const doAsync = async () => {
      try {
        if (loadingAllUserDefinedRoles) return;

        // User defined rols
        const selectedGrantsFlatArrUserDefinedRols: string[] = [];
        if (userRols) {
          userRols.forEach((rolId) => {
            const exists = allUserDefinedRols.find((item) => {
              return item.id === rolId;
            });

            // si el usuario tenia roles de la aplicacion viejos que ya fueron borrados, se borran. Sin esta linea quedarian
            if (exists) selectedGrantsFlatArrUserDefinedRols.push(rolId);
          });
        }

        setSelectedUserDefinedRolsCheckbox(selectedGrantsFlatArrUserDefinedRols);

        // User App Rols
        const selectedGrantsFlatArrAppRols: string[] = [];
        if (userAppRols) {
          userAppRols.forEach((rolId) => {
            const exists = allUserAppRols.find((item) => {
              return item.id === rolId;
            });

            // si el usuario tenia roles de la aplicacion viejos que ya fueron borrados, se borran. Sin esta linea quedarian
            if (exists) selectedGrantsFlatArrAppRols.push(rolId);
          });
        }

        setSelectedUserAppRolsCheckbox(selectedGrantsFlatArrAppRols);

        // User Org Rols
        const selectedGrantsFlatArrOrgRols: string[] = [];
        if (userOrgRols) {
          userOrgRols.forEach((rolId) => {
            const exists = allUserOrgRols.find((item) => {
              return item.id === rolId;
            });

            // si el usuario tenia roles de la aplicacion viejos que ya fueron borrados, se borran. Sin esta linea quedarian
            if (exists) selectedGrantsFlatArrOrgRols.push(rolId);
          });
        }

        setSelectedUserOrgRolsCheckbox(selectedGrantsFlatArrOrgRols);
      } catch (e) {
        handleError(e);
      }
    };

    doAsync();
  }, [loadingAllUserDefinedRoles, userRols, userAppRols, userOrgRols]);

  const handleOnSubmitUserRols = async () => {
    try {
      if (!user.id) throw new Error('Missing user.id');
      setLoadingUserRols(true);

      await upsertUserRole(user.id, { bulkRolsIds: selectedUserDefinedRolsCheckbox });

      setToggleUserDefinedRols(!toggleUserDefinedRols);
      // stop del loading
      setLoadingUserRols(false);

      return Promise.resolve();
    } catch (e) {
      handleError(e);
      setLoadingUserRols(false);
    }
  };

  const handleOnSubmitUserAppRols = async () => {
    try {
      setLoadingUserRols(true);

      await updateUser(user.id, { appRols: selectedUserAppRolsCheckbox });

      setToggleUserAppRols(!toggleUserAppRols);
      // stop del loading
      setLoadingUserRols(false);

      return Promise.resolve();
    } catch (e) {
      handleError(e);
      setLoadingUserRols(false);
    }
  };

  const handleOnSubmitUserOrgRols = async () => {
    try {
      setLoadingUserRols(true);

      // await updateUser(user.id, { appRols: selectedUserOrgRolsCheckbox });

      alert('TODO');

      setToggleUserOrgRols(!toggleUserOrgRols);
      // stop del loading
      setLoadingUserRols(false);

      return Promise.resolve();
    } catch (e) {
      handleError(e);
      setLoadingUserRols(false);
    }
  };

  const togglePermissionUserRols = (id: string) => {
    const arr = selectedUserDefinedRolsCheckbox;
    if (selectedUserDefinedRolsCheckbox.includes(id)) {
      arr.splice(arr.indexOf(id), 1);
      setSelectedUserDefinedRolsCheckbox([...arr]);
    } else {
      arr.push(id);
      setSelectedUserDefinedRolsCheckbox([...arr]);
    }
  };

  const togglePermissionUserAppRols = (id: string) => {
    const arr = selectedUserAppRolsCheckbox;
    if (selectedUserAppRolsCheckbox.includes(id)) {
      arr.splice(arr.indexOf(id), 1);
      setSelectedUserAppRolsCheckbox([...arr]);
    } else {
      arr.push(id);
      setSelectedUserAppRolsCheckbox([...arr]);
    }
  };

  const togglePermissionUserOrgRols = (id: string) => {
    const arr = selectedUserOrgRolsCheckbox;
    if (selectedUserOrgRolsCheckbox.includes(id)) {
      arr.splice(arr.indexOf(id), 1);
      setSelectedUserOrgRolsCheckbox([...arr]);
    } else {
      arr.push(id);
      setSelectedUserOrgRolsCheckbox([...arr]);
    }
  };

  // ** </User Defined Rols>

  if (loadingUserRols) return <Loader />;

  return (
    <>
      {/* ** User App Rols ** */}

      {!currentUser.isLoading &&
        !!currentUser.currentUser &&
        currentUser.currentUser.appRols.includes(AppRols.APP_ADMIN) && (
          <Card sx={{ mb: 4 }}>
            <CardHeader
              title={<Typography sx={{ textTransform: 'capitalize' }}>App Rols</Typography>}
              action={
                <Button
                  onClick={() => {
                    handleOnSubmitUserAppRols();
                  }}
                  variant='contained'
                  sx={{ '& svg': { mr: 2 } }}
                >
                  <Icon fontSize='1.125rem' icon='tabler:edit' />
                  Save changes
                </Button>
              }
            />

            <TableContainer style={{ marginLeft: 30, marginRight: 30 }}>
              <Table size='small'>
                <TableBody>
                  {allUserAppRols.map((rol: IUserRol, index: number) => {
                    const id = rol.id;

                    return (
                      <TableRow key={index} sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            fontSize: (theme) => theme.typography.h6.fontSize,
                          }}
                        >
                          {rol.name}
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            label=''
                            sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                            control={
                              <Checkbox
                                size='small'
                                id={`${id}`}
                                onChange={() => togglePermissionUserAppRols(`${id}`)}
                                checked={selectedUserAppRolsCheckbox.includes(`${id}`)}
                              />
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

      {/* ** User Org Rols ** */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title={<Typography sx={{ textTransform: 'capitalize' }}>Org Rols</Typography>}
          action={
            <Button
              onClick={() => {
                handleOnSubmitUserOrgRols();
              }}
              variant='contained'
              sx={{ '& svg': { mr: 2 } }}
            >
              <Icon fontSize='1.125rem' icon='tabler:edit' />
              Save changes
            </Button>
          }
        />

        <TableContainer style={{ marginLeft: 30, marginRight: 30 }}>
          <Table size='small'>
            <TableBody>
              {allUserOrgRols.map((rol: IUserRol, index: number) => {
                const id = rol.id;

                return (
                  <TableRow key={index} sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        fontSize: (theme) => theme.typography.h6.fontSize,
                      }}
                    >
                      {rol.name}
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        label=''
                        sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                        control={
                          <Checkbox
                            size='small'
                            id={`${id}`}
                            onChange={() => togglePermissionUserOrgRols(`${id}`)}
                            checked={selectedUserOrgRolsCheckbox.includes(`${id}`)}
                          />
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* ** User Rols ** */}
      <Card>
        <CardHeader
          title={<Typography sx={{ textTransform: 'capitalize' }}>Grants</Typography>}
          action={
            <Button
              onClick={() => {
                handleOnSubmitUserRols();
              }}
              variant='contained'
              sx={{ '& svg': { mr: 2 } }}
            >
              <Icon fontSize='1.125rem' icon='tabler:edit' />
              Save changes
            </Button>
          }
        />

        {loadingAllUserDefinedRoles && <Loader />}
        {!loadingAllUserDefinedRoles && (
          <TableContainer style={{ marginLeft: 30, marginRight: 30 }}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ pl: '0 !important' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        whiteSpace: 'nowrap',
                        alignItems: 'center',
                        textTransform: 'capitalize',
                        '& svg': { ml: 1, cursor: 'pointer' },
                        color: (theme) => theme.palette.text.secondary,
                        fontSize: (theme) => theme.typography.h6.fontSize,
                      }}
                    >
                      User defined rols
                      <Tooltip placement='top' title='To create new rols go to Rols menu'>
                        <Box sx={{ display: 'flex' }}>
                          <Icon icon='tabler:info-circle' fontSize='1.25rem' />
                        </Box>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell colSpan={3}>
                    {/* <FormControlLabel
                      label='Select All'
                      sx={{ '& .MuiTypography-root': { textTransform: 'capitalize', color: 'text.secondary' } }}
                      control={
                        <Checkbox
                          size='small'
                          onChange={handleSelectAllCheckbox}
                          indeterminate={isIndeterminateCheckbox}
                          checked={selectedCheckbox.length === userDefinedRoles.length * 3}
                        />
                      }
                    /> */}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allUserDefinedRols.map((rol: IUserRol, index: number) => {
                  const id = rol.id;

                  return (
                    <TableRow key={index} sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          fontSize: (theme) => theme.typography.h6.fontSize,
                        }}
                      >
                        {rol.name}
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label=''
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}`}
                              onChange={() => togglePermissionUserRols(`${id}`)}
                              checked={selectedUserDefinedRolsCheckbox.includes(`${id}`)}
                            />
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </>
  );
};

export default UserViewRols;
