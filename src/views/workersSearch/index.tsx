// ** MUI Imports
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

import { useTranslation } from 'react-i18next';

// ** Custom Components Imports
import { Box, CardHeader, Divider, IconButton, MenuItem, Tooltip, Typography, capitalize } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Fuse from 'fuse.js';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Icon from 'src/@core/components/icon';
import CustomAvatar from 'src/@core/components/mui/avatar';
import CustomTextField from 'src/@core/components/mui/text-field';
import { DISTANCE_OPTIONS, getSourceEntityData, handleError, nameof } from 'src/@core/coreHelper';
import { formatDate } from 'src/@core/utils/format';
import { getInitials } from 'src/@core/utils/get-initials';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { useDynamics } from 'src/hooks/useDynamics';
import { dynamicGet } from 'src/services/entitiesDynamicServices';
import { CMSCollections, IUserBasicData, IUsersAddress, IWorker, SexTypes } from 'src/types/@autogenerated';
import { IUserAddressGeoqueryItem } from 'src/types/addresses';
import { IEntitySchema, IEntitySchemaField, IEntitySchemaWithFields } from 'src/types/entities';

interface PropsType {
  addresses: IUsersAddress[];
  initialAddress: IUsersAddress | null;
  defaultFilters?: { distanceInKm: number; sex: SexTypes };
  onWorkerSelected: (worker: IWorker) => void;
}

interface IWorkerGeoqueryRow extends IUserAddressGeoqueryItem {
  showRow: boolean;
}
interface CellType {
  row: IWorkerGeoqueryRow;
}

const SCHEMA_NAME = CMSCollections.WORKERS;

const WorkerSearch = ({ addresses, initialAddress, defaultFilters, onWorkerSelected }: PropsType) => {
  // ** Hooks
  const dynamics = useDynamics();
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const router = useRouter();

  // ** State
  // const [closeWorkersFromPatient, setCloseWorkersFromPatient] = useState<IUserAddressGeoqueryItem[]>([]);
  const [distanceOptions, setDistanceOptions] =
    useState<{ label: string; value: string; raw: any }[]>(DISTANCE_OPTIONS);
  const [selectedDistanceOption, setSelectedDistanceOption] = useState<{ label: string; value: string; raw: any }>(
    DISTANCE_OPTIONS[1]
  );
  const [selectedAddress, setSelectedAddress] = useState<IUsersAddress | null>(initialAddress);

  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  const [entitySchema, setEntitySchema] = useState<IEntitySchema | null>(null);
  const [entitySchemaFields, setEntitySchemaFields] = useState<IEntitySchemaField[]>([]);
  const [loadingSchema, setLoadingSchema] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [toggleData, setToggleData] = useState<boolean>(false);

  const [entitiesData, setEntitiesData] = useState<IWorkerGeoqueryRow[]>([]);

  //- side drawer
  const [openSideDrawer, setOpenSideDrawer] = useState<boolean>(false);
  const toggleSideDrawer = () => setOpenSideDrawer(!openSideDrawer);

  //- grid
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 });
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [searchText, setSearchText] = useState<string>('');

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
          <Tooltip title='Select'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary' }}
              onClick={() => {
                if (!row.worker) return;
                onWorkerSelected(row.worker);
              }}
            >
              <Icon icon='tabler:click' />
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
        return (
          <>
            {!!row.worker?.avatarUrl && (
              <CustomAvatar src={row.worker?.avatarUrl} sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500 }} />
            )}
            {!row.worker?.avatarUrl && (
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
                {getInitials((row.worker?.firstName + ' ' + row.worker?.lastName).toUpperCase())}
              </CustomAvatar>
            )}

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
                {row.worker?.firstName + ' ' + row.worker?.lastName}
              </Typography>
              {row.worker?.email && (
                <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                  {row.worker?.email}
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
      field: 'distance',
      headerName: t('distance') as string,

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
              {Math.round(row.distanceInKm)} km
            </Typography>
          </Box>
        );
      },
    });

    columnsData.push({
      flex: 0.2,
      minWidth: 110,
      field: 'state',
      headerName: t('state') as string,

      renderCell: ({ row }: CellType) => {
        // const workerStatus = getSourceEntityData({ obj: row, key: 'workerState' }).name;

        if (!row.worker?.workerState) return null;

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
                {capitalize(t(row.worker?.workerState))}
              </Typography>
            </Box>
          </Box>
        );
      },
    });

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
                {row.updatedAt ? formatDate(row.updatedAt as any) : '-'}
              </Typography>
            </Box>
          </Box>
        );
      },
    });
    setColumns(columnsData);
  };
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
  }, [dynamics.isLoadingSchemas]);

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

  // Fetch schema.collectionName

  useEffect(() => {
    const doAsync = async () => {
      try {
        if (!entitySchema || !entitySchemaFields) return;

        setLoadingData(true);

        if (selectedAddress?.address) {
          const toleranceDistanceInMts = parseInt(selectedDistanceOption.value) * 1000;

          const geoqueryResults = (await dynamicGet({
            params: `/cms/geo-query-user-addresses/${selectedAddress?.address?.lat}/${selectedAddress?.address?.lng}/${toleranceDistanceInMts}`,
          })) as IUserAddressGeoqueryItem[];

          const addressesWithWorkersData: IUserAddressGeoqueryItem[] = [];

          geoqueryResults.forEach((item: IUserAddressGeoqueryItem) => {
            const workerData = getSourceEntityData({
              obj: item,
              key: nameof<IUserAddressGeoqueryItem>('workerId'),
            }) as IWorker;

            if (!workerData) return;

            if (!workerData.state) return;

            addressesWithWorkersData.push({ ...item, worker: workerData });
          });

          // setCloseWorkersFromPatient(addressesWithWorkersData);

          setEntitiesData(
            addressesWithWorkersData
              .filter((item) => {
                return item.worker;
              })
              .map((item: IUserAddressGeoqueryItem) => {
                // const relatedWoerkeUser = getSourceEntityData({
                //   obj: worker,
                //   key: nameof<IWorker>('userId'),
                // }) as IUserBasicData;

                // if (relatedWoerkeUser && relatedWoerkeUser.dirtyAddress && relatedWoerkeUser.dirtyAddress.city) {
                //   addressCity = relatedWoerkeUser.dirtyAddress.city;
                // }

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
  }, [entitySchema, entitySchemaFields, selectedDistanceOption, selectedAddress]);

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
            nameof<IWorker>('firstName'),
            nameof<IWorker>('lastName'),
            // nameof<IWorkerRow>('workerAddress'),
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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card style={{ marginBottom: 10, marginTop: 10 }}>
          <CardHeader title={capitalize(t('search'))} />
          <CardContent>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  label={t('Target address')}
                  onChange={(event) => {
                    const selected = addresses.find((address) => {
                      return address.id === event.target.value;
                    });
                    if (selected) setSelectedAddress(selected);
                  }}
                  value={selectedAddress?.id}
                >
                  {!!addresses &&
                    addresses.map((op, index) => {
                      return (
                        <MenuItem key={index} value={op.id}>
                          {/* <em>None</em> */}
                          {op.address.addressString}
                        </MenuItem>
                      );
                    })}
                </CustomTextField>
              </Grid>

              <Grid item xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  label={t('distance in km')}
                  onChange={(event) => {
                    const selected = distanceOptions.find((op) => {
                      return op.value === event.target.value;
                    });
                    if (selected) setSelectedDistanceOption(selected);
                  }}
                  value={selectedDistanceOption.value}
                >
                  {!!distanceOptions &&
                    distanceOptions.map((op, index) => {
                      return (
                        <MenuItem key={index} value={op.value}>
                          {/* <em>None</em> */}
                          {op.label}
                        </MenuItem>
                      );
                    })}
                </CustomTextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

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

export default WorkerSearch;
