// formik components

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useEffect, useState } from 'react';
import Icon from 'src/@core/components/icon';
import Loader from 'src/@core/components/loader';
import { getSourceEntityData, handleError, hasRole, nameof, splitByUppercase } from 'src/@core/coreHelper';
import { IEntitySchema, IEntitySchemaField, IEntitySchemaWithFields, ISelectOptionEntity } from 'src/types/entities';

import { DataGrid, GridColDef } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useRouter } from 'next/router';

import { CardContent, Divider, Grid, IconButton, Tooltip, capitalize } from '@mui/material';

import Fuse from 'fuse.js';
import { useTranslation } from 'react-i18next';
import CustomAvatar from 'src/@core/components/mui/avatar';
import CustomTextField from 'src/@core/components/mui/text-field';
import { getInitials } from 'src/@core/utils/get-initials';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { useDynamics } from 'src/hooks/useDynamics';
import { dynamicGet } from 'src/services/entitiesDynamicServices';
import { CMSCollections, ICompany, IPatient, IPatientHealthInsurance } from 'src/types/@autogenerated';
import { AppRols } from 'src/types/appRols';
import { UserDefinedRols } from 'src/types/userDefinedRols';

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

// Se cambia
const SCHEMA_NAME = CMSCollections.PATIENT_HEALTH_INSURANCES;

interface IPatientAndCompany {
  id: string;
  patient: IPatient;
  company: ICompany;
}

interface IPatientAndCompanyRow extends IPatientAndCompany {
  showRow?: boolean;
}

interface CellType {
  row: IPatientAndCompanyRow;
}

interface PropsType {
  docId: string;
}

const PatientsTab = ({ docId }: PropsType) => {
  // ** Hooks
  const router = useRouter();
  const dynamics = useDynamics();
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  // ** State
  const [entitySchema, setEntitySchema] = useState<IEntitySchema | null>(null);
  const [entitySchemaFields, setEntitySchemaFields] = useState<IEntitySchemaField[]>([]);

  const [entitiesData, setEntitiesData] = useState<IPatientAndCompanyRow[]>([]);

  const [loadingSchema, setLoadingSchema] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 });

  const [columns, setColumns] = useState<GridColDef[]>([]);

  const [searchText, setSearchText] = useState<string>('');

  const [applicantStateTypeOptions, setApplicantStateTypeOptions] = useState<ISelectOptionEntity[]>([]);

  const isPermittedByRol = () => {
    return (
      !currentUser.isLoading &&
      !!currentUser.currentUser &&
      (hasRole(currentUser.currentUser?.appRols, AppRols.APP_ADMIN) ||
        hasRole(currentUser.currentUser?.userDefinedRols, UserDefinedRols.UDR_STAFF_COMMERCIAL))
    );
  };

  // ** Effects
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
        // const entitySchemaResponse = (await getEntitySchemaByName(schemaName)) as IEntitySchemaWithFields;
        const entitySchemaResponse: IEntitySchemaWithFields = { ...schema, fields: schemaFields };

        setEntitySchema(entitySchemaResponse);
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamics.isLoadingSchemas]);

  // Fetch schema.collectionName
  useEffect(() => {
    const doAsync = async () => {
      try {
        if (!entitySchema || !entitySchemaFields) return;

        // Define table columns
        updateColumnsData();

        setLoadingData(true);

        // load entity data
        const patientsHealtInsuranceResponse: any = await dynamicGet({
          params: '/cms/' + entitySchema.name + '/by-company/' + docId,
        });

        const companyPatients = patientsHealtInsuranceResponse.items as IPatientHealthInsurance[];
        console.log(companyPatients);

        setEntitiesData(
          companyPatients.map((item: IPatientHealthInsurance) => {
            return {
              ...item, // id = id
              showRow: true,
              patient: getSourceEntityData({ obj: item, key: nameof<IPatientHealthInsurance>('userId') }),
              company: getSourceEntityData({ obj: item, key: nameof<IPatientHealthInsurance>('companyId') }),
            } as IPatientAndCompanyRow;
          }) as IPatientAndCompanyRow[]
        );

        setLoadingData(false);
      } catch (e: any) {
        setLoadingData(false);
        handleError(e);
      }
    };

    doAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entitySchema, entitySchemaFields]);

  useEffect(() => {
    const doAsync = async () => {
      try {
        if (isFirstLoad) {
          setIsFirstLoad(false);

          return;
        }

        if (!entitySchema) return;

        setLoadingData(true);
        if (searchText) {
          const searchByProps = [nameof<IPatient>('firstName'), nameof<IPatient>('lastName')];
          const fuse = new Fuse(entitiesData, {
            threshold: 0.3,
            // minMatchCharLength: 2,
            keys: searchByProps,
          });

          const auxFilteredItems = fuse.search(searchText);

          const filteredItems = auxFilteredItems.map((element: any) => {
            return { ...element.item, showRow: true };
          });

          setEntitiesData(
            entitiesData.map((item) => {
              if (
                filteredItems.find((fi) => {
                  return fi.id === item.id;
                })
              ) {
                return { ...item, showRow: true };
              }

              return { ...item, showRow: false };
            })
          );
        } else {
          setEntitiesData(
            entitiesData.map((item) => {
              return { ...item, showRow: true };
            })
          );
        }
        setLoadingData(false);
      } catch (e) {
        setLoadingData(false);
        handleError(e);
      }
    };

    doAsync();
  }, [searchText]);

  const updateColumnsData = () => {
    // TODO - aca podria jugar con una coleccion de 'layouts' donde defina las cols a mostrar
    // TODO - Los layouts podrian definir si se usan tablas o cards, y las cards que prop usar para cada campo en caso de
    // TODO - incluso las cards podrian ser de estructuras template o creadas por el usuario (designer)
    // TODO - Tmb podria jugar con campos virtuales que puedan ser funciones a lo excel o estáticos
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
                router.push(`/patients/${row.patient.id}`);
              }}
            >
              <Icon icon='tabler:eye' />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    });

    columnsData.push({
      flex: 0.2,
      minWidth: 110,
      field: 'name',
      headerName: t('name') as string,

      renderCell: ({ row }: CellType) => {
        if (!row.patient) return <>Empty patient</>;

        return (
          <>
            <CustomAvatar
              skin='light'
              color={'primary'}
              sx={{
                mr: 2.5,
                width: 38,
                height: 38,
                fontWeight: 500,
                fontSize: (theme) => theme.typography.body1.fontSize,
              }}
            >
              {getInitials(row.patient.firstName.toUpperCase() + ' ' + row.patient.lastName.toUpperCase())}
            </CustomAvatar>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                // component={Link}
                // href='/apps/user/view/account'
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  textTransform: 'capitalize',
                }}
              >
                {row.patient.firstName + ' ' + row.patient.lastName}
              </Typography>
              {row.patient.email && (
                <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                  {row.patient.email}
                </Typography>
              )}
            </Box>
          </>
        );
      },
    });

    columnsData.push({
      flex: 0.2,
      minWidth: 110,
      field: 'phone',
      headerName: t('phone') as string,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.secondary',
                textTransform: 'capitalize',
              }}
            >
              {row.patient.phoneNumber}
            </Typography>
          </Box>
        );
      },
    });

    columnsData.push({
      flex: 0.2,
      minWidth: 110,
      field: 'identificationNumber',
      headerName: t('dni') as string,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              noWrap
              // component={Link}
              // href='/apps/user/view/account'
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.secondary',
                textTransform: 'capitalize',
              }}
            >
              {row.patient.identificationNumber}
            </Typography>
          </Box>
        );
      },
    });

    setColumns(columnsData);
  };

  // const handleSearchFilter = (newText: string) => {};

  if (!entitySchema || !entitySchemaFields || loadingSchema) return <Loader />;

  return (
    <>
      <Card>
        <CardHeader sx={{ textTransform: 'capitalize' }} title={t(splitByUppercase(entitySchema.name))} />
        <CardContent>
          <Grid container spacing={6}>
            <Grid item sm={4} xs={12}></Grid>
          </Grid>
        </CardContent>
        {/* <Divider sx={{ m: '0 !important' }} />
        <Box
          sx={{
            py: 4,
            px: 6,
            rowGap: 2,
            columnGap: 4,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',

            // justifyContent: 'space-between',
            justifyContent: 'right',
          }}
        > */}
        {/* <Button color='secondary' variant='tonal' startIcon={<Icon icon='tabler:upload' />}>
        Export
      </Button> */}
        {/* <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            {isPermittedByRol() && (
              <Button
                onClick={() => {
                  router.push('/admission/applicants');
                }}
                variant='contained'
                sx={{ '& svg': { mr: 2 } }}
              >
                <Icon fontSize='1.125rem' icon='tabler:plus' />
                {capitalize(t('new'))}
              </Button>
            )}
          </Box>
        </Box> */}

        <DataGrid
          autoHeight
          rows={entitiesData.filter((item) => {
            return item.showRow;
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
      </Card>
    </>
  );
};

export default PatientsTab;
