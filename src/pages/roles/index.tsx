// ** React Imports
import { useEffect, useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// ** Custom Component Import

// ** Third Party Imports

// ** Type Imports

import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import Icon from 'src/@core/components/icon';
import Loader from 'src/@core/components/loader';
import { handleError } from 'src/@core/coreHelper';
import {
  createUserDefinedRol,
  deleteUserDefinedRol,
  listUserDefinedRols,
  updateUserDefinedRol,
} from 'src/services/entitiesSchemasServices';
import { IUserRol } from 'src/types/entities';
import DynamicFormSidebar from 'src/views/components/dynamics/DynamicFormSidebar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

interface CellType {
  row: IUserRol;
}
const Roles = () => {
  // ** Hooks
  const router = useRouter();

  // ** State

  const [userDefinedRols, setUserDefinedRols] = useState<IUserRol[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 });
  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [toggleData, setToggleData] = useState<boolean>(false);

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [currentUserDefinedRol, setCurrentUserDefinedRol] = useState<IUserRol | null>(null);

  const toggleAddDrawer = () => setAddOpen(!addOpen);

  useEffect(() => {
    const doAsync = async () => {
      try {
        setLoading(true);
        const response = await listUserDefinedRols();

        setUserDefinedRols(response.items);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        handleError(e);
      }
    };

    doAsync();
  }, [toggleData]);

  const handleDelete = async (rowToDelete: IUserRol) => {
    try {
      setLoading(true);
      await deleteUserDefinedRol(rowToDelete.id);
      setToggleData(!toggleData);
      setLoading(false);
    } catch (e) {
      handleError(e);
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 110,
      field: 'id',
      headerName: 'id',
      renderCell: ({ row }: CellType) => (
        <Typography
          onClick={() => {
            setCurrentUserDefinedRol(row);
            setIsCreating(false);

            setAddOpen(true);
          }}
          noWrap
          sx={{
            fontWeight: 500,
            textDecoration: 'none',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
            cursor: 'pointer',
          }}
        >
          {row.id}
        </Typography>
      ),
    },
    {
      flex: 0.35,
      minWidth: 250,
      field: 'name',
      headerName: 'name',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{row.name}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete'>
            <IconButton
              size='small'
              sx={{ color: 'text.danger' }}
              onClick={() => {
                handleDelete(row);
              }}
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleOnSubmit = async (formData: any, isCreating: boolean) => {
    try {
      // NO hacer un set loading pq se re renderiza formik dentro del sidedrawer y pierde el estado y entonces no muestra el error
      // setLoading(true);

      if (isCreating) await createUserDefinedRol(formData as IUserRol);
      else await updateUserDefinedRol(formData.id, formData as IUserRol);

      // cierro el sidedrawer
      toggleAddDrawer();
      // stop del loading
      setLoading(false);

      // refresco la info de la tabla de fields
      setToggleData(!toggleData);

      return Promise.resolve();
    } catch (e) {
      // NO hacer un set loading pq se re renderiza formik dentro del sidedrawer y pierde el estado y entonces no muestra el error
      // setLoading(false);
      // handleError(e);

      return Promise.reject(e);
      // return null;
    }
  };

  if (loading) return <Loader />;

  return (
    <Card>
      <CardHeader
        title='Rols'
        action={
          <Button
            onClick={() => {
              setCurrentUserDefinedRol(null);

              setIsCreating(true);

              toggleAddDrawer();
            }}
            variant='contained'
            sx={{ '& svg': { mr: 2 } }}
          >
            <Icon fontSize='1.125rem' icon='tabler:plus' />
            New
          </Button>
        }
      />

      <DataGrid
        autoHeight
        rows={userDefinedRols}
        rowHeight={60}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />

      {!!addOpen && (
        <DynamicFormSidebar
          isCreating={isCreating}
          initialValues={currentUserDefinedRol}
          onSubmit={handleOnSubmit}
          title={'Create Rol'}
          formId={'userDefinedRolForm'}
          open={addOpen}
          toggle={toggleAddDrawer}
          onSubmitDone={() => {
            toggleAddDrawer();

            return Promise.resolve();
          }}
        />
      )}
    </Card>
  );
};

export default Roles;
