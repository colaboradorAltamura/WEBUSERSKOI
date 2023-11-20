// ** MUI Imports
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';

import { useTranslation } from 'react-i18next';

// ** Custom Components Imports
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Divider,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
  capitalize,
  responsiveFontSizes,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getSourceEntityData, handleError, hasRole, nameof, parseDateToDateTimeString } from 'src/@core/coreHelper';
import { IEntitySchema, IEntitySchemaField, IEntitySchemaWithFields } from 'src/types/entities';
import {
  CMSCollections,
  IOpenPosition,
  IOpenPositionWorker,
  IPatient,
  IPatientWorker,
  IWorker,
  OpenPositionAsignmentStatusTypes,
} from 'src/types/@autogenerated';
import { useDynamics } from 'src/hooks/useDynamics';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { IForm } from 'src/types/dynamics';
import { UserDefinedRols } from 'src/types/userDefinedRols';
import { AppRols } from 'src/types/appRols';
import { Icon } from '@iconify/react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CustomTextField from 'src/@core/components/mui/text-field';
import { dynamicCreate, dynamicGet, dynamicUpdate } from 'src/services/entitiesDynamicServices';
import { IUser } from 'src/types/users';
import { useRouter } from 'next/router';

interface IPatientWorkerRow extends IPatientWorker {
  showRow: boolean;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  identificationType: string;
  identificationNumber: string;
  patientState: string;
  email: string;
}
interface CellType {
  row: IPatientWorkerRow;
}

const PATIENT_WORKERS = CMSCollections.PATIENT_WORKERS;
const PATIENTS = CMSCollections.PATIENTS;

const SCHEMA_NAME = CMSCollections.PATIENT_WORKERS;
const WorkerPatients = () => {
  // ** Hooks
  const router = useRouter();
  const dynamics = useDynamics();
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  const queryAction = router.query['action'] as string;

  // ** State
  const [entitySchema, setEntitySchema] = useState<IEntitySchema>();
  const [entitySchemaFields, setEntitySchemaFields] = useState<IEntitySchemaField[]>();
  const [loadingSchema, setLoadingSchema] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [toggleData, setToggleData] = useState<boolean>(false);

  const [isCreating, setIsCreating] = useState<boolean>(true);
  const [relativeData, setRelativeData] = useState<IPatientWorkerRow>();
  const [entityData, setEntityData] = useState<IWorker | null>(null);
  const [entitiesData, setEntitiesData] = useState<IPatientWorkerRow[]>([]);

  //- grid
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 });
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  // ** Effects
  // fetch schema
  useEffect(() => {
    const doAsync = async () => {
      try {
        setLoadingSchema(true);

        if (dynamics.isLoadingSchemas || !dynamics.entitySchemas || !dynamics.entitySchemasFields) return null;

        const schema = dynamics.entitySchemas.find((schema) => {
          return schema.name === SCHEMA_NAME;
        });
        if (!schema) throw new Error('Missing schemaName: ' + SCHEMA_NAME);
        const schemaFields = dynamics.entitySchemasFields.filter((field) => {
          return field.schemaId === schema.id;
        });

        // Fetch Schema
        //const entitySchemaResponse = (await getEntitySchemaByName(schemaName)) as IEntitySchemaWithFields;
        const entitySchemaResponse: IEntitySchemaWithFields = { ...schema, fields: schemaFields };

        setEntitySchema(entitySchemaResponse);

        // Fetch Fields
        // const entitySchemaFieldsResponse = await listEntitySchemaFields(entitySchemaResponse.id);

        setEntitySchemaFields(
          entitySchemaResponse.fields.sort((a, b) => {
            return a.order - b.order;
          })
        );

        setLoadingSchema(false);
      } catch (e: any) {
        handleError(e);
        setLoadingSchema(false);
      }
    };

    doAsync();
  }, [dynamics.isLoadingSchemas]);

  // fetch entity data
  useEffect(() => {
    const doAsync = async () => {
      try {
        if (!entitySchema || currentUser.isLoading || loadingData) return;

        setLoadingData(true);
        if (!currentUser.currentUser) throw new Error('Missing currentUser.currentUser');

        let response = null;
        response = await dynamicGet({
          params: '/cms/workers/mine/' + currentUser.currentUser.id,
        });

        setEntityData(response);

        // load entity data
        const data: any = await dynamicGet({
          params:
            '/cms/' +
            CMSCollections.OPEN_POSITION_WORKERS +
            '/by-prop/' +
            nameof<IOpenPositionWorker>('userId') +
            '/' +
            currentUser.currentUser.id,
          filters: [
            {
              key: nameof<IOpenPositionWorker>('assignmentStatus'),
              value: [OpenPositionAsignmentStatusTypes.SELECTED],
              operator: '$in',
            },
          ],
        });

        const posts = await Promise.all(
          data.items.map(async (openPositionWorker: IOpenPositionWorker) => {
            const basicData = await getPatientByOpenPositionId(openPositionWorker.openPositionId);
            if (basicData) return basicData;

            return;
          }) as IPatientWorkerRow[]
        );
        setEntitiesData(posts);

        setLoadingData(false);
      } catch (e: any) {
        handleError(e);
        setLoadingData(false);
      }
    };

    doAsync();
  }, [entitySchema, toggleData, currentUser.isLoading]);

  // define columns and filters
  useEffect(() => {
    const doAsync = async () => {
      try {
        if (!entitySchema || !entitySchemaFields) return;

        // Define table columns
        updateColumnsData();
      } catch (e: any) {
        handleError(e);
      }
    };

    doAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entitySchema, entitySchemaFields]);

  //obtiene la data del paciente vinculado al id de la openposition
  const getPatientByOpenPositionId = async (id: string) => {
    if (!currentUser || !currentUser.currentUser) return;

    const openPosition = await dynamicGet({
      params: '/cms/' + CMSCollections.OPEN_POSITIONS + '/' + id,
    });

    if (!openPosition) return;

    const patientData = getPatientData(openPosition);

    if (patientData) {
      const row = {
        showRow: true,
        patientId: patientData.id,
        workerId: currentUser.currentUser.id,
        id: patientData.id,
        ...patientData,
        ...openPosition,
      } as IPatientWorkerRow;

      return row;
    }

    return;
  };
  //obtiene ña data del paciente
  const getPatientData = (openPosition: IOpenPosition) => {
    if (!openPosition) return '';

    const sourceData = getSourceEntityData({
      obj: openPosition,
      key: nameof<IOpenPosition>('patient'),
    });

    if (!sourceData) return;

    return sourceData as IPatient;
  };

  const isPermittedByRol = () => {
    return (
      !currentUser.isLoading &&
      !!currentUser.currentUser &&
      (hasRole(currentUser.currentUser?.appRols, AppRols.APP_ADMIN) ||
        hasRole(currentUser.currentUser?.userDefinedRols, UserDefinedRols.UDR_STAFF_ADMISSION))
    );
  };

  const updateColumnsData = () => {
    const columnsData: GridColDef[] = [];

    // icons col
    columnsData.push({
      flex: 0.1,
      minWidth: 110,
      field: 'icons',
      headerName: '',

      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View Content'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary' }}
              onClick={() => {
                router.push(`/workers/patients/${row.patientId}`);
              }}
            >
              <Icon icon='tabler:eye' />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    });

    // id col
    columnsData.push({
      flex: 0.2,
      minWidth: 110,
      field: 'id',
      headerName: 'id',

      renderCell: ({ row }: CellType) => (
        <Typography
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
    });

    columnsData.push({
      flex: 0.2,
      minWidth: 110,
      field: 'Name',
      headerName: capitalize(t('name')) as string,

      renderCell: ({ row }: CellType) => {
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                  textTransform: 'capitalize',
                }}
              >
                {row.firstName}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                {row.lastName}
              </Typography>
            </Box>
          </>
        );
      },
    });

    columnsData.push({
      flex: 0.2,
      minWidth: 110,
      field: 'phoneNumber',
      headerName: capitalize(t('phone number')) as string,

      renderCell: ({ row }: CellType) => {
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                  textTransform: 'capitalize',
                }}
              >
                {row.phoneNumber}
              </Typography>
            </Box>
          </>
        );
      },
    });

    columnsData.push({
      flex: 0.2,
      minWidth: 110,
      field: 'email',
      headerName: t('email') as string,

      renderCell: ({ row }: CellType) => {
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                  textTransform: 'capitalize',
                }}
              >
                {t(row.email)}
              </Typography>
            </Box>
          </>
        );
      },
    });

    columnsData.push({
      flex: 0.2,
      minWidth: 110,
      field: 'identification',
      headerName: capitalize(t('identification number')) as string,

      renderCell: ({ row }: CellType) => {
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                  textTransform: 'capitalize',
                }}
              >
                {row.identificationType}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                {row.identificationNumber}
              </Typography>
            </Box>
          </>
        );
      },
    });
    columnsData.push({
      flex: 0.2,
      minWidth: 110,
      field: 'updateAt',
      headerName: capitalize(t('updateAt')) as string,

      renderCell: ({ row }: CellType) => {
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                  textTransform: 'capitalize',
                }}
              >
                {parseDateToDateTimeString(row.updatedAt as any)}
              </Typography>
            </Box>
          </>
        );
      },
    });
    columnsData.push({
      flex: 0.2,
      minWidth: 110,
      field: 'status',
      headerName: capitalize(t('status')) as string,

      renderCell: ({ row }: CellType) => {
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                  textTransform: 'capitalize',
                }}
              >
                {row.patientState}
              </Typography>
            </Box>
          </>
        );
      },
    });
    setColumns(columnsData);
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={6}></Grid> <Divider sx={{ m: '0 !important' }} />
            <Box
              sx={{
                py: 4,
                px: 6,
                rowGap: 2,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',

                justifyContent: 'right',
              }}
            >
              <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <CustomTextField
                  sx={{ mr: 4 }}
                  placeholder={capitalize(t('search placeholder'))}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Box>
            </Box>
            <DataGrid
              autoHeight
              rows={entitiesData.filter((item) => {
                if (item) return item.showRow;
              })}
              rowHeight={60}
              loading={loadingData}
              columns={columns}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    id: false,
                  },
                },
              }}
              disableRowSelectionOnClick
              pageSizeOptions={[7, 10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default WorkerPatients;
