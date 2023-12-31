// formik components
import Fuse from 'fuse.js';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useEffect, useState } from 'react';
import Icon from 'src/@core/components/icon';
import Loader from 'src/@core/components/loader';
import {
  USERS_SCHEMA,
  handleError,
  hasRole,
  nameof,
  parseDateToDateTimeString,
  splitByUppercase,
  getSourceEntityData,
} from 'src/@core/coreHelper';
import { IEntitySchema, IEntitySchemaField, IEntitySchemaWithFields, ISelectOptionEntity } from 'src/types/entities';

import { DataGrid, GridColDef } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomChip from 'src/@core/components/mui/chip';

import { useRouter } from 'next/router';

import { CardContent, Divider, Grid, IconButton, MenuItem, Tooltip, capitalize } from '@mui/material';
import { ThemeColor } from 'src/@core/layouts/types';

import { useTranslation } from 'react-i18next';
import CustomAvatar from 'src/@core/components/mui/avatar';
import CustomTextField from 'src/@core/components/mui/text-field';
import { getInitials } from 'src/@core/utils/get-initials';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { useDynamics } from 'src/hooks/useDynamics';
import { dynamicGet } from 'src/services/entitiesDynamicServices';
import {
  CMSCollections,
  IPatient,
  WorkerStateTypes,
  IWorker,
  PatientsClinicStateTypes,
  EnliteServices,
  IUsersAddress,
} from 'src/types/@autogenerated';
import { AppRols } from 'src/types/appRols';
import { UserDefinedRols } from 'src/types/userDefinedRols';
import { IForm } from 'src/types/dynamics';
import { createEntityDataBySchema, schemaToForm } from 'src/views/components/dynamics/helpers';
import DynamicFormSidebar from 'src/views/components/dynamics/DynamicFormSidebar';
import { IUserAddressGeoqueryItem } from 'src/types/addresses';

const SCHEMA_NAME = CMSCollections.PATIENTS;

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

interface IPatientRow extends IPatient {
  showRow?: boolean;
  searchNumber: number;
  patientAddress?: string;
}

interface CellType {
  row: IPatientRow;
}

interface IListResponse {
  total: number;
  hasMore: boolean;
  items: IWorker[] | IPatient[];
}

const PatientsList = ({}) => {
  // ** Hooks
  const router = useRouter();
  const dynamics = useDynamics();
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  // ** Global vars
  const queryAction = router.query['action'] as string;

  // ** State
  const [addSidebarOpen, setAddSidebarOpen] = useState<boolean>(queryAction === 'create' ? true : false);
  const [addNewEntityForm, setAddNewEntityForm] = useState<IForm | undefined>();
  const [userEntitySchema, setUserEntitySchema] = useState<IEntitySchema | null>(null);
  const [userEntitySchemaFields, setUserEntitySchemaFields] = useState<IEntitySchemaField[]>([]);
  const [toggleData, setToggleData] = useState<boolean>(false);
  const [closeWorkersFromPatient, setCloseWorkersFromPatient] = useState<IUserAddressGeoqueryItem[]>([]);

  const [entitySchema, setEntitySchema] = useState<IEntitySchema | null>(null);
  const [entitySchemaFields, setEntitySchemaFields] = useState<IEntitySchemaField[]>([]);

  const [entitiesData, setEntitiesData] = useState<IPatientRow[]>([]);

  const [loadingSchema, setLoadingSchema] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 });

  const [columns, setColumns] = useState<GridColDef[]>([]);

  const [searchText, setSearchText] = useState<string>('');

  const [patientStateTypeOptions, setPatientStateTypeOptions] = useState<ISelectOptionEntity[]>([]);

  const [selectedPatientStateTypeOptions, setSelectedPatientStateTypeOptions] = useState<string[]>([
    PatientsClinicStateTypes.ACTIVE,
    PatientsClinicStateTypes.PENDING_INFORMATION,
    PatientsClinicStateTypes.PENDING_PARTIAL_INFO,
    PatientsClinicStateTypes.PENDING_TRIAGE,
    PatientsClinicStateTypes.WAITING_PAYMENT,
  ]);

  const toggleAddDrawer = () => setAddSidebarOpen(!addSidebarOpen);

  const isTriage = () => {
    return (
      !currentUser.isLoading &&
      !!currentUser.currentUser &&
      hasRole(currentUser.currentUser?.userDefinedRols, UserDefinedRols.UDR_STAFF_TRIAGE)
    );
  };

  const deg2rad = (deg: any) => {
    return deg * (Math.PI / 180);
  };

  const getDistanceFromLatLonInKm = (lat1: any, lon1: any, lat2: any, lon2: any) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km

    return d;
  };

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

        if (!dynamics.entitySchemas || !dynamics.entitySchemasFields)
          throw new Error('dynamic entitySchemas not found');

        const usersSchemaResponse = dynamics.entitySchemas.find((schema) => {
          return schema.name === USERS_SCHEMA.name;
        });
        if (!usersSchemaResponse) throw new Error('Missing schemaName: ' + SCHEMA_NAME);

        const usersSchemaResponseFields = dynamics.entitySchemasFields.filter((field) => {
          return field.schemaId === usersSchemaResponse.id;
        });

        setUserEntitySchema(usersSchemaResponse);
        setUserEntitySchemaFields(usersSchemaResponseFields);

        setLoadingSchema(false);
      } catch (e: any) {
        handleError(e);
        setLoadingSchema(false);
      }
    };

    doAsync();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamics.isLoadingSchemas]);

  // define columns and filters
  useEffect(() => {
    const doAsync = async () => {
      try {
        if (!entitySchema || !entitySchemaFields) return;

        // Define table columns
        updateColumnsData();

        // define filters options
        const field = entitySchemaFields.find((field) => {
          return field.name === 'clinicStateType';
        });

        if (field && field.relationshipSchemaId && dynamics.entitySchemas) {
          const relatedSchema = dynamics.entitySchemas.find((schema) => {
            return schema.id === field.relationshipSchemaId;
          });

          if (relatedSchema) {
            const optionsData: any = await dynamicGet({ params: '/cms/' + relatedSchema.name });

            setPatientStateTypeOptions(optionsData.items as ISelectOptionEntity[]);
          }
        }
      } catch (e: any) {
        handleError(e);
      }
    };

    doAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entitySchema, entitySchemaFields]);

  // Fetch schema.collectionName
  useEffect(() => {
    const doAsync = async () => {
      try {
        if (!entitySchema || !entitySchemaFields) return;

        // Define table columns
        updateColumnsData();

        setLoadingData(true);

        // load entity data
        if (!isTriage()) {
          const patientsData: any = (await dynamicGet({
            params: '/cms/' + entitySchema.name,
            filters: [
              {
                key: 'enliteService',
                value: [EnliteServices.CARE],
                operator: '$in',
              },
            ],
          })) as IListResponse;

          const workersData: any = (await dynamicGet({
            params: '/cms/' + CMSCollections.WORKERS,
            filters: [
              {
                key: 'workerState',
                value: [WorkerStateTypes.INACTIVE],
                operator: '$notin',
              },
            ],
          })) as IListResponse;

          setEntitiesData(
            patientsData.items.map((patient: IPatient) => {
              const userPatient = getSourceEntityData({ obj: patient, key: nameof<IPatient>('userId') });

              let closeWorkersFromPatient = [];
              if (userPatient.dirtyAddress || userPatient.dirtyAddress?.lat || userPatient.dirtyAddress?.lng) {
                closeWorkersFromPatient = workersData.items.filter((worker: IWorker) => {
                  const userWorker = getSourceEntityData({ obj: worker, key: nameof<IWorker>('userId') });

                  if (!userWorker.dirtyAddress || !userWorker.dirtyAddress?.lat || !userWorker.dirtyAddress?.lng) {
                    return;
                  }

                  const ditanceFromWorker = getDistanceFromLatLonInKm(
                    userPatient.dirtyAddress?.lng,
                    userPatient.dirtyAddress?.lat,
                    userWorker.dirtyAddress?.lng,
                    userWorker.dirtyAddress?.lat
                  );

                  const TOLERANCE_WORKER_DISTANCE_FROM_PATIENT_IN_KM = 5;

                  return ditanceFromWorker <= TOLERANCE_WORKER_DISTANCE_FROM_PATIENT_IN_KM;
                });
              }

              const address = userPatient.dirtyAddress.addressString;

              console.log('patient:', patient, 'closeWorkersFromPatient:', closeWorkersFromPatient);

              return {
                ...patient,
                showRow: true,
                searchNumber: closeWorkersFromPatient.length,
                patientAddress: address,
              };
            }) as IPatientRow[]
          );
        } else {
          const patientsData: any = (await dynamicGet({
            params: '/cms/' + entitySchema.name,
            filters: [
              {
                key: 'enliteService',
                value: [EnliteServices.CLINIC],
                operator: '$in',
              },
              {
                key: 'clinicStateType',
                value: selectedPatientStateTypeOptions,
                operator: '$in',
              },
            ],
          })) as IListResponse;

          setEntitiesData(
            patientsData.items.map((patient: IPatient) => {
              const userPatient = getSourceEntityData({ obj: patient, key: nameof<IPatient>('userId') });
              console.log('userPatient', userPatient);

              return { ...patient, showRow: true, searchNumber: 0 };
            })
          );
        }

        setLoadingData(false);
      } catch (e: any) {
        setLoadingData(false);
        handleError(e);
      }
    };

    doAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entitySchema, entitySchemaFields, toggleData, selectedPatientStateTypeOptions]);

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
          const searchByProps = [
            nameof<IPatient>('firstName'),
            nameof<IPatient>('lastName'),
            nameof<IPatient>('identificationNumber'),
            nameof<IPatientRow>('patientAddress'),
          ];
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
                router.push(`/${SCHEMA_NAME}/${row.id}`);
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
      field: 'fullname',
      headerName: t('name') as string,

      renderCell: ({ row }: CellType) => {
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
              {getInitials(row.firstName + ' ' + row.lastName).toUpperCase()}
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
                  '&:hover': { color: 'primary.main' },
                  textTransform: 'capitalize',
                }}
              >
                {row.firstName + ' ' + row.lastName}
              </Typography>
              {row.email && (
                <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                  {row.email}
                </Typography>
              )}
            </Box>
          </>
        );
      },
    });

    if (isTriage()) {
      columnsData.push({
        flex: 0.2,
        minWidth: 110,
        field: 'phoneNumber',
        headerName: t('phone') as string,

        renderCell: ({ row }: CellType) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{row.phoneNumber}</Typography>
              </Box>
            </Box>
          );
        },
      });

      columnsData.push({
        flex: 0.2,
        minWidth: 110,
        field: 'status',
        headerName: t('status') as string,

        renderCell: ({ row }: CellType) => {
          const status = getSourceEntityData({ obj: row, key: 'clinicStateType' });
          const statusName = status.name;
          let statusColor: ThemeColor = 'warning';

          if (statusName === PatientsClinicStateTypes.ACTIVE) statusColor = 'success';
          else if (statusName === PatientsClinicStateTypes.INACTIVE) statusColor = 'error';
          else if (statusName === PatientsClinicStateTypes.WAITING_PAYMENT) statusColor = 'info';

          return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center !important' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <CustomChip rounded size='small' skin='light' label={capitalize(t(statusName))} color={statusColor} />
              </Box>
            </Box>
          );
        },
      });
    } else {
      columnsData.push({
        flex: 0.2,
        minWidth: 110,
        field: 'identificationNumber',
        headerName: t('identification number') as string,

        renderCell: ({ row }: CellType) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{row.identificationNumber}</Typography>
              </Box>
            </Box>
          );
        },
      });

      columnsData.push({
        flex: 0.2,
        minWidth: 110,
        field: 'address',
        headerName: t('address') as string,

        renderCell: ({ row }: CellType) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  {row.patientAddress ? row.patientAddress : '-'}
                </Typography>
              </Box>
            </Box>
          );
        },
      });

      columnsData.push({
        flex: 0.2,
        minWidth: 110,
        field: 'totalWorkers',
        headerName: t('total workers nearby') as string,

        renderCell: ({ row }: CellType) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{row.searchNumber}</Typography>
              </Box>
            </Box>
          );
        },
      });
    }

    // TODO MICHEL
    // columnsData.push({
    //   flex: 0.2,
    //   minWidth: 110,
    //   field: 'searchStatus',
    //   headerName: t('searchStatus') as string,

    //   renderCell: ({ row }: CellType) => {
    //     let statusColor: ThemeColor = 'success';

    //     if (row.searchNumber >= 5 && row.searchNumber < 10) statusColor = 'warning';
    //     else if (row.searchNumber < 5) statusColor = 'error';

    //     return (
    //       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center !important' }}>
    //         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    //           <CustomChip rounded size='small' skin='light' label={row.searchNumber} color={statusColor} />
    //         </Box>
    //       </Box>
    //     );
    //   },
    // });

    columnsData.push({
      flex: 0.2,
      minWidth: 110,
      field: 'updatedAt',
      headerName: t('updated at') as string,

      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
                {parseDateToDateTimeString(row.updatedAt as any)}
              </Typography>
            </Box>
          </Box>
        );
      },
    });

    setColumns(columnsData);
  };

  const handlePatientStateTypeOptionsChange = (newValues: string[]) => {
    setSelectedPatientStateTypeOptions(newValues);
  };

  if (!entitySchema || !entitySchemaFields || loadingSchema) return <Loader />;

  return (
    <>
      <Card>
        <CardHeader sx={{ textTransform: 'capitalize' }} title={t(splitByUppercase(entitySchema.name))} />
        {isTriage() ? (
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                {patientStateTypeOptions && (
                  <CustomTextField
                    select
                    fullWidth
                    label={t('status')}
                    SelectProps={{
                      MenuProps,
                      multiple: true,
                      value: selectedPatientStateTypeOptions,
                      onChange: (e) => handlePatientStateTypeOptionsChange(e.target.value as string[]),
                      renderValue: (selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                          {(selected as unknown as string[]).map((value) => {
                            const typeOption = patientStateTypeOptions.find((option) => {
                              return option.code === value;
                            });
                            if (!typeOption) return '-';

                            return (
                              <CustomChip
                                key={typeOption.code}
                                label={capitalize(t(typeOption.name))}
                                sx={{ m: 0.75 }}
                                skin='light'
                                color='primary'
                              />
                            );
                          })}
                        </Box>
                      ),
                    }}
                  >
                    {patientStateTypeOptions.map((selectOption, index) => (
                      <MenuItem key={index} value={selectOption.code}>
                        {capitalize(t(selectOption.name))}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              </Grid>
            </Grid>
          </CardContent>
        ) : null}
        <Divider sx={{ m: '0 !important' }} />
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
        >
          {/* <Button color='secondary' variant='tonal' startIcon={<Icon icon='tabler:upload' />}>
        Export
      </Button> */}
          <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <CustomTextField sx={{ mr: 4 }} placeholder='Search ...' onChange={(e) => setSearchText(e.target.value)} />
          </Box>
        </Box>

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

export default PatientsList;
