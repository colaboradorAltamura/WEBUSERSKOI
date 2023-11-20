// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types';

// ** React Imports
import { useEffect, useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// ** Third Party Imports
import toast from 'react-hot-toast';

// ** Type Imports

import { CardContent, Divider, IconButton, MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Icon from 'src/@core/components/icon';
import Loader from 'src/@core/components/loader';
import CustomTextField from 'src/@core/components/mui/text-field';
import { handleError, hasRole } from 'src/@core/coreHelper';
import {
  createEntitySchemaField,
  createEntitySchemaFieldGroup,
  deleteEntitySchema,
  deleteEntitySchemaField,
  deleteEntitySchemaFieldGroup,
  getEntitySchemaById,
  listEntitySchemaFieldGroups,
  listEntitySchemaFields,
  listUserDefinedRols,
  updateEntitySchema,
  updateEntitySchemaField,
  updateEntitySchemaFieldGroup,
} from 'src/services/entitiesSchemasServices';
import {
  EntitySchemaTypes,
  IEntitySchema,
  IEntitySchemaField,
  IEntitySchemaFieldGroup,
  IUserRol,
} from 'src/types/entities';
import EntitySchemaFieldFormSidebar from 'src/views/cms/EntitySchemaFieldFormSidebar';

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
import { useRouter } from 'next/router';
import Link from 'next/link';
import EntitySchemaFieldGroupFormSidebar from 'src/views/cms/EntitySchemaFieldGroupFormSidebar';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { AppRols } from 'src/types/appRols';
import _ from 'lodash';
import { DynamicComponentTypes } from 'src/types/dynamics';

// ** Third Party Imports

// ** Types

// ** Demo Components Imports

interface FieldCellType {
  row: IEntitySchemaField;
}

interface FieldGroupCellType {
  row: IEntitySchemaFieldGroup;
}

const UIBuilderPageEdit = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** Hooks
  const router = useRouter();

  const id = router.query.id as string;

  const currentUser = useCurrentUser();

  // ** State
  const [loading, setLoading] = useState<boolean>(false);

  if (loading) return <Loader />;

  return (
    <>
      <Card style={{ marginBottom: 30 }}>
        <CardHeader
          title={<Typography sx={{ textTransform: 'capitalize' }}>Page builder</Typography>}
          action={
            <Button
              onClick={() => {
                alert('n');
              }}
              variant='contained'
              sx={{ '& svg': { mr: 2 } }}
            >
              <Icon fontSize='1.125rem' icon='tabler:plus' />
              New
            </Button>
          }
        />
      </Card>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  return {
    props: {
      id: params?.id,

      // tab: params?.tab,
    },
  };
};

export default UIBuilderPageEdit;
