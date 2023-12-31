// ** Next Import
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types';
import { SyntheticEvent, useEffect, useState } from 'react';
import {
  capitalize,
  getSourceEntityData,
  handleError,
  hasRole,
  nameof,
  parseDateToDateTimeString,
} from 'src/@core/coreHelper';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { useDynamics } from 'src/hooks/useDynamics';
import { Collections } from 'src/types/collectionsTypes';
import { IEntitySchema, IEntitySchemaField, IEntitySchemaWithFields } from 'src/types/entities';
import CustomChip from 'src/@core/components/mui/chip';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { toast } from 'react-hot-toast';
import Icon from 'src/@core/components/icon';
import Loader from 'src/@core/components/loader';
import CustomAvatar from 'src/@core/components/mui/avatar';
import { IForm } from 'src/types/dynamics';
import DynamicFormSidebar from 'src/views/components/dynamics/DynamicFormSidebar';
import {
  getEditEntityForm,
  getEntityDataBySchema,
  removeEntityDataBySchema,
  restoreEntityDataBySchema,
  schemaToForm,
  updateEntityDataBySchema,
} from 'src/views/components/dynamics/helpers';

import CardHeader from '@mui/material/CardHeader';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';
import OptionsMenu from 'src/@core/components/option-menu';
import { getInitials } from 'src/@core/utils/get-initials';
import SummaryTab from 'src/views/workers/SummaryTab';
import AvailabilityTab from 'src/views/workers/AvailabilityTab';

import { CMSCollections, IAddress, IUsersAddress, IWorker, WorkerStateTypes } from 'src/types/@autogenerated';
import { CardActions } from '@mui/material';
import { AppRols } from 'src/types/appRols';
import { UserDefinedRols } from 'src/types/userDefinedRols';
import DialogAction from 'src/@core/components/custom-dialog-action';
import { dynamicGet, dynamicUpdate } from 'src/services/entitiesDynamicServices';
import { ThemeColor } from 'src/@core/layouts/types';
import PreferencesTab from 'src/views/workers/PreferencesTab';
import PatientsTab from 'src/views/workers/PatientsTab';
import AddressTab from 'src/views/workers/AddressTab';
import DocsTab from 'src/views/workers/DocsTab';
import WorkerInteractionTab from 'src/views/workers/WorkerInteractionTab';
import WorkerEvaluationsTab from 'src/views/workers/WorkerEvaluationsTab';
import PsicologicalProfileTab from 'src/views/workers/PsicologicalProfileTab';

const SCHEMA_NAME = Collections.WORKERS;

const WorkersEdit = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** Hooks
  const router = useRouter();
  const dynamics = useDynamics();
  const currentUser = useCurrentUser();
  const { t } = useTranslation();

  const theme = useTheme();

  // ** Global vars
  const INITIAL_TAB = 'summary';
  const AVAILABILITY_TAB = 'availability';
  const PREFERENCES_TAB = 'preferences';
  const PATIENTS_TAB = 'patients';
  const ADDRESS_TAB = 'address';
  const DOCS_TAB = 'docs';
  const INTERACTIONS_TAB = 'interactions';
  const WORKEREVALUATIONS_TAB = 'WorkerEvaluations';
  const PSICOLOGICALPROFILE_TAB = 'psicological profile';

  const id = router.query.id as string | null;
  const tab = router.query['tab'] as string;

  // ** States
  const [entitySchema, setEntitySchema] = useState<IEntitySchema | null>(null);
  const [entitySchemaFields, setEntitySchemaFields] = useState<IEntitySchemaField[]>([]);

  const [loadingSchema, setLoadingSchema] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [entityData, setEntityData] = useState<IWorker | null>(null);
  const [toggleData, setToggleData] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<string>(tab ? tab : INITIAL_TAB);

  const [editEntityForm, setEditEntityForm] = useState<IForm | null>(null);
  const [editSidebarOpen, setEditSidebarOpen] = useState<boolean>(false);

  const toggleEditDrawer = () => setEditSidebarOpen(!editSidebarOpen);

  const [interviewAttendedDialogShow, setInterviewAttendedDialogShow] = useState<boolean>(false);
  const [activateWorkerDialogShow, setActivateWorkerDialogShow] = useState<boolean>(false);
  const [inactivateWorkerDialogShow, setInactivateWorkerDialogShow] = useState<boolean>(false);

  // ** Address tab
  const [primaryAddress, setPrimaryAddress] = useState<IUsersAddress | null>(null);
  const [userAddresses, setUserAddresses] = useState<IUsersAddress[]>();

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
    if (!id) return;

    const doAsync = async () => {
      try {
        if (!entitySchema || currentUser.isLoading || loadingData) return;

        setLoadingData(true);

        if (!currentUser.currentUser) throw new Error('Missing currentUser.currentUser');

        const data: any = await getEntityDataBySchema(
          currentUser.currentUser,
          entitySchema,
          entitySchemaFields,
          id,
          null,
          null
        );

        setEntityData(data);

        if (data) {
          const addresses = await dynamicGet({
            params: `/cms/${CMSCollections.USERS_ADDRESSES}/by-user/${data.id}`,
          });

          if (addresses && addresses.items && addresses.items.length) {
            let primaryAddress: IUsersAddress = addresses.items.find((address: IUsersAddress) => {
              return address.isPrimary;
            });

            if (!primaryAddress && addresses.items.length) {
              primaryAddress = addresses.items[0] as IUsersAddress;
            }

            if (primaryAddress) {
              setPrimaryAddress(primaryAddress);
            }
            setUserAddresses(addresses.items);
          }
        }

        setLoadingData(false);
      } catch (e: any) {
        handleError(e);
        setLoadingData(false);
      }
    };

    doAsync();
  }, [entitySchema, id, toggleData, currentUser.isLoading]);

  const handleTabChange = (event: SyntheticEvent, value: string) => {
    setLoadingSchema(true);
    setActiveTab(value);

    router
      .push({
        pathname: `/${SCHEMA_NAME}/${id}`,
        query: `tab=${value}`,
      })
      .then(() => setLoadingSchema(false));
  };

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [tab]);

  const handleOnEntityEdit = async () => {
    try {
      if (!entitySchema) throw new Error('missing entitySchema');
      const fieldsNames = [
        nameof<IWorker>('firstName'),
        nameof<IWorker>('lastName'),
        // nameof<IWorker>('email'),
        nameof<IWorker>('phoneNumber'),
      ];

      const toShowFields = entitySchemaFields.filter((field) => {
        return fieldsNames.includes(field.name);
      });
      const theForm = schemaToForm(entitySchema, toShowFields, null, dynamics);

      setEditEntityForm(theForm);

      setEditSidebarOpen(true);
    } catch (e: any) {
      handleError(e);
    }
  };

  const handleOnEntityDelete = async () => {
    try {
      if (!id) return;

      setLoadingData(true);

      if (!entitySchema || !currentUser.currentUser) throw new Error('Missing entitySchema/currentUser.currentUser');

      await removeEntityDataBySchema(
        currentUser.currentUser,
        entitySchema,
        entitySchemaFields,
        id,

        null,
        null
      );

      // refresco la info
      setToggleData(!toggleData);

      toast.success('successfull removed');

      // cierro sidebar
      setEditSidebarOpen(false);

      // apago loading
      setLoadingData(false);
    } catch (e) {
      setLoadingData(false);
      handleError(e);
    }
  };

  const handleOnEntityRestore = async () => {
    try {
      if (!id) return;

      setLoadingData(true);

      if (!entitySchema || !currentUser.currentUser) throw new Error('Missing entitySchema/currentUser.currentUser');

      await restoreEntityDataBySchema(
        currentUser.currentUser,
        entitySchema,
        entitySchemaFields,
        id,

        null,
        null
      );

      // refresco la info
      setToggleData(!toggleData);

      toast.success('successfull restored');

      // cierro sidebar
      setEditSidebarOpen(false);

      // apago loading
      setLoadingData(false);
    } catch (e) {
      setLoadingData(false);
      handleError(e);
    }
  };

  const handleOnEditSubmit = async (formData: any) => {
    try {
      if (!id) return;

      setLoadingData(true);

      if (!entitySchema || !currentUser.currentUser) throw new Error('Missing entitySchema/currentUser.currentUser');

      await updateEntityDataBySchema(
        currentUser.currentUser,
        entitySchema,
        entitySchemaFields,
        id,
        formData,
        null,
        null
      );

      // refresco la tabla
      setToggleData(!toggleData);

      // cierro sidebar
      setEditSidebarOpen(false);

      // apago loading
      setLoadingData(false);
    } catch (e) {
      setLoadingData(false);
      handleError(e);
    }
  };

  const handleOnTabUpdateData = async () => {
    try {
      // refresco la tabla
      setToggleData(!toggleData);
    } catch (e) {
      handleError(e);
    }
  };

  // const formatPhoneNumberForWhatsappApi = (userNumber) => {
  //   return userNumber.replace(/\s/g, '').slice(-10);
  // };

  const handleOpenWhatsapp = () => {
    if (!entityData) {
      handleError(new Error('Missing entityData'));

      return;
    }
    // const formattedPhoneNumber = formatPhoneNumberForWhatsappApi(entityData?.phoneNumber);
    // en el caso de usar el formatter hay que asignar la func al link
    const whatsappApiLink = `https://wa.me/${entityData?.phoneNumber}?text=Hola%20${entityData?.firstName}%20${entityData?.lastName}%20`;
    window.open(whatsappApiLink, '_blank');
    // console.log('whatsappApiLink', whatsappApiLink);
  };

  const isPermittedByRol = () => {
    return (
      !currentUser.isLoading &&
      !!currentUser.currentUser &&
      (hasRole(currentUser.currentUser?.appRols, AppRols.APP_ADMIN) ||
        hasRole(currentUser.currentUser?.userDefinedRols, UserDefinedRols.UDR_STAFF_RECRUITER))
    );
  };
  const handleInterviewAttendedDialogClose = () => {
    return setInterviewAttendedDialogShow(false);
  };

  const handleActivateWorkerDialogClose = () => {
    return setActivateWorkerDialogShow(false);
  };

  const handleInactivateWorkerDialogClose = () => {
    return setInactivateWorkerDialogShow(false);
  };

  const handleStateUpdate = async (targetState: WorkerStateTypes) => {
    try {
      if (!id) return;
      setLoadingData(true);

      if (!entityData || !currentUser.currentUser) throw new Error('Missing entityData/currentUser.currentUser');

      const itemValues = { ...entityData };

      itemValues.workerState = targetState;

      await updateWorker(itemValues);
      handleInterviewAttendedDialogClose();
      handleActivateWorkerDialogClose();
      handleInactivateWorkerDialogClose();

      // refresco la info
      setToggleData(!toggleData);
      // apago loading
      setLoadingData(false);
    } catch (e) {
      setLoadingData(false);
      handleError(e);
    }
  };

  const updateWorker = async (formData: any) => {
    let response = null;

    response = await dynamicUpdate({
      params: `/cms/${SCHEMA_NAME}/` + id,
      data: formData,
    });
  };

  const renderLeftPanel = () => {
    if (!entitySchema || !entityData) return;

    const relatedUserEntityData = getSourceEntityData({ obj: entityData, key: 'userId' });

    const statusName = getSourceEntityData({ obj: entityData, key: nameof<IWorker>('workerState') })?.name;

    let statusColor: ThemeColor = 'info';

    if (entityData.workerState === WorkerStateTypes.PENDING_PREFERENCES) statusColor = 'warning';
    else if (entityData.workerState === WorkerStateTypes.PENDING_DOCS) statusColor = 'primary';
    else if (entityData.workerState === WorkerStateTypes.PENDING_EXPERIENCE) statusColor = 'info';
    else if (entityData.workerState === WorkerStateTypes.PENDING_GENERAL_INFO) statusColor = 'primary';
    else if (entityData.workerState === WorkerStateTypes.PENDING_INTERVIEW) statusColor = 'warning';
    else if (entityData.workerState === WorkerStateTypes.ACTIVE) statusColor = 'success';
    else if (entityData.workerState === WorkerStateTypes.INACTIVE) statusColor = 'error';

    return (
      <Grid container spacing={6}>
        <DialogAction
          show={interviewAttendedDialogShow}
          title='interview attented'
          text='interview attend confirm'
          textButtonSubmit='change'
          colorButtonSubmit='primary'
          onClickSubmit={() => handleStateUpdate(WorkerStateTypes.PENDING_GENERAL_INFO)}
          onClickClose={() => handleInterviewAttendedDialogClose()}
        />
        <DialogAction
          show={activateWorkerDialogShow}
          title='activate worker'
          text='activate confirm'
          textButtonSubmit='accept worker'
          colorButtonSubmit='success'
          onClickSubmit={() => handleStateUpdate(WorkerStateTypes.ACTIVE)}
          onClickClose={() => handleActivateWorkerDialogClose()}
        />
        <DialogAction
          show={inactivateWorkerDialogShow}
          title='inactivate worker'
          text='inactivate confirm'
          textButtonSubmit='reject worker'
          colorButtonSubmit='error'
          onClickSubmit={() => handleStateUpdate(WorkerStateTypes.INACTIVE)}
          onClickClose={() => handleInactivateWorkerDialogClose()}
        />

        <Grid item xs={12}>
          <Card>
            {entityData.state !== 0 && (
              <CardHeader
                action={
                  <OptionsMenu
                    options={[
                      {
                        text: capitalize(t('edit')),
                        menuItemProps: {
                          sx: { py: 2 },
                          // selected: countrySelected === 'ar',
                          onClick: () => {
                            handleOnEntityEdit();
                          },
                        },
                      },
                      {
                        text: capitalize(t('delete')),
                        menuItemProps: {
                          sx: { py: 2 },
                          // selected: countrySelected === 'ar',
                          onClick: () => {
                            handleOnEntityDelete();
                          },
                        },
                      },
                    ]}
                    iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
                  />
                }
              />
            )}
            <CardContent sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CustomAvatar
                skin='light'
                variant='rounded'
                color={'primary'}
                sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
              >
                {getInitials(capitalize(entityData.firstName + ' ' + entityData.lastName))}
              </CustomAvatar>

              <Typography variant='h4' sx={{ mb: 3, textTransform: 'capitalize' }}>
                {entityData.firstName + ' ' + entityData.lastName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CustomChip rounded size='small' skin='light' label={capitalize(t(statusName))} color={statusColor} />
                </Box>
              </Box>
            </CardContent>
            <Divider sx={{ my: '0 !important', mx: 6 }} />
            <CardContent sx={{ pb: 4 }}>
              <Box sx={{ pt: 2 }}>
                <Box sx={{ display: 'flex', mb: 3, margin: 2 }}>
                  <Grid sx={{ ml: 2 }}>
                    <Icon fontSize='1.2rem' icon={'tabler:mail'} />:
                  </Grid>
                  <Grid sx={{ ml: 2 }}>
                    <Typography sx={{ color: 'text.secondary' }}>{entityData.email}</Typography>
                  </Grid>
                </Box>
                <Box sx={{ display: 'flex', mb: 3, margin: 2 }}>
                  <Tooltip title='Open Whatsapp' placement='right-start'>
                    <Grid sx={{ ml: 2 }}>
                      <Icon
                        color={theme.palette.primary.main}
                        fontSize='1.2rem'
                        icon={'logos:whatsapp-icon'}
                        onClick={handleOpenWhatsapp}
                      />{' '}
                      :
                    </Grid>
                  </Tooltip>
                  <Grid sx={{ ml: 2 }}>
                    <Typography sx={{ color: 'text.secondary' }}>{entityData?.phoneNumber}</Typography>
                  </Grid>
                </Box>

                <Box sx={{ display: 'flex', mb: 3, margin: 2 }}>
                  <Grid sx={{ ml: 2 }}>
                    <Icon color={theme.palette.primary.main} fontSize='1.2rem' icon={'tabler:clock-edit'} />
                  </Grid>
                  <Grid sx={{ ml: 2 }}>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {parseDateToDateTimeString(entityData.updatedAt)}
                    </Typography>
                  </Grid>
                </Box>
              </Box>
            </CardContent>
            {isPermittedByRol() && (
              <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                {entityData.workerState === WorkerStateTypes.PENDING_INTERVIEW && (
                  <Button
                    variant='contained'
                    sx={{ mr: 2, textTransform: 'capitalize' }}
                    onClick={() => {
                      setInterviewAttendedDialogShow(true);
                    }}
                  >
                    {t('interview completed')}
                  </Button>
                )}
                {entityData.workerState === WorkerStateTypes.INFORMATION_COMPLETED && (
                  <Button
                    variant='contained'
                    size='small'
                    sx={{ mr: 1, textTransform: 'capitalize' }}
                    color='success'
                    onClick={() => {
                      setActivateWorkerDialogShow(true);
                    }}
                  >
                    {t('accept worker')}
                  </Button>
                )}
                {entityData.workerState === WorkerStateTypes.INFORMATION_COMPLETED && (
                  <Button
                    variant='contained'
                    size='small'
                    sx={{ mr: 1, textTransform: 'capitalize' }}
                    color='error'
                    onClick={() => {
                      setInactivateWorkerDialogShow(true);
                    }}
                  >
                    {t('reject worker')}
                  </Button>
                )}
              </CardActions>
            )}
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderRightPanel = () => {
    // si el value de actuve Tab se imprime antes de los tabs estalla el comp
    if (!activeTab || !entitySchema || !id || !entityData) return null;

    return (
      <TabContext value={activeTab}>
        <TabList
          variant='scrollable'
          scrollButtons='auto'
          onChange={handleTabChange}
          aria-label='forced scroll tabs'
          sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
          <Tab value={INITIAL_TAB} label={t('summary')} sx={{ textTransform: 'capitalize' }} />
          <Tab value={ADDRESS_TAB} label={t('address')} sx={{ textTransform: 'capitalize' }} />
          <Tab value={AVAILABILITY_TAB} label={t('availability')} sx={{ textTransform: 'capitalize' }} />
          <Tab value={PREFERENCES_TAB} label={t('preferences')} sx={{ textTransform: 'capitalize' }} />
          <Tab value={PATIENTS_TAB} label={t('patients')} sx={{ textTransform: 'capitalize' }} />
          <Tab value={DOCS_TAB} label={t('documents')} sx={{ textTransform: 'capitalize' }} />
          <Tab value={INTERACTIONS_TAB} label={t('interactions')} sx={{ textTransform: 'capitalize' }} />
          <Tab value={WORKEREVALUATIONS_TAB} label={t('commintment levels')} sx={{ textTransform: 'capitalize' }} />
          <Tab value={PSICOLOGICALPROFILE_TAB} label={t('psicological profile')} sx={{ textTransform: 'capitalize' }} />
        </TabList>

        <TabPanel sx={{ p: 0 }} value={INITIAL_TAB}>
          <SummaryTab
            docId={id}
            schemaArg={entitySchema}
            schemaFieldsArg={entitySchemaFields}
            workerDataArg={entityData}
            onUpdatWorker={handleOnTabUpdateData}
          />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value={ADDRESS_TAB}>
          <AddressTab
            docId={id}
            schemaArg={entitySchema}
            schemaFieldsArg={entitySchemaFields}
            workerDataArg={entityData}
            onUpdateWorker={handleOnTabUpdateData}
            primaryAddressArg={primaryAddress}
          />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value={PREFERENCES_TAB}>
          <PreferencesTab
            docId={id}
            schemaArg={entitySchema}
            schemaFieldsArg={entitySchemaFields}
            workerDataArg={entityData}
            onUpdateWorker={handleOnTabUpdateData}
          />
        </TabPanel>

        <TabPanel sx={{ p: 0 }} value={AVAILABILITY_TAB}>
          <AvailabilityTab
            docId={id}
            schemaArg={entitySchema}
            schemaFieldsArg={entitySchemaFields}
            workerDataArg={entityData}
            onUpdatWorker={handleOnTabUpdateData}
          />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value={PATIENTS_TAB}>
          <PatientsTab
            docId={id}
            schemaArg={entitySchema}
            schemaFieldsArg={entitySchemaFields}
            workerDataArg={entityData}
          />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value={DOCS_TAB}>
          <DocsTab
            docId={id}
            schemaArg={entitySchema}
            schemaFieldsArg={entitySchemaFields}
            workerDataArg={entityData}
            onUpdateWorker={handleOnTabUpdateData}
          />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value={INTERACTIONS_TAB}>
          <WorkerInteractionTab
            docId={id}
            schemaArg={entitySchema}
            schemaFieldsArg={entitySchemaFields}
            workerDataArg={entityData}
            onUpdateWorker={handleOnTabUpdateData}
          />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value={WORKEREVALUATIONS_TAB}>
          <WorkerEvaluationsTab
            docId={id}
            schemaArg={entitySchema}
            schemaFieldsArg={entitySchemaFields}
            workerDataArg={entityData}
            onUpdateWorker={handleOnTabUpdateData}
          />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value={PSICOLOGICALPROFILE_TAB}>
          <PsicologicalProfileTab
            docId={id}
            schemaArg={entitySchema}
            schemaFieldsArg={entitySchemaFields}
            workerDataArg={entityData}
            onUpdateWorker={handleOnTabUpdateData}
          />
        </TabPanel>
      </TabContext>
    );
  };

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  if (!id) {
    toast.error('Missing id');
    console.error('Missing args', router);
    // router.push('/500');

    return <h1>Loading...</h1>;
  }

  if (!dynamics.entitySchemas || !dynamics.entitySchemasFields) return <Loader />;

  if (loadingSchema || loadingData) return <Loader />;

  if (!entityData) return <>Error loading data</>;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={12} lg={12}>
        <Card>
          {/* <CardContent sx={{ pt: 0, display: 'flex', alignItems: 'left', flexDirection: 'column' }}>back</CardContent> */}
          <IconButton
            color='inherit'
            onClick={() => {
              // TODO Hacer HistoryContext
              const splittedUrl = router.asPath.split('/');

              const backRoute = splittedUrl.reduce((prev, curr, index) => {
                if (index === splittedUrl.length - 2) return prev;

                return prev + '/' + curr;
              });

              router.push(backRoute);
            }}
          >
            <Icon fontSize='1.625rem' icon='tabler:arrow-badge-left-filled' />
          </IconButton>
          {entityData.state === 0 && (
            <Alert
              severity='warning'
              action={
                <Button
                  color='inherit'
                  size='small'
                  onClick={() => {
                    handleOnEntityRestore();
                  }}
                >
                  Undo
                </Button>
              }
            >
              <AlertTitle>This entity is deleted!</AlertTitle>
            </Alert>
          )}
        </Card>
      </Grid>

      <Grid item xs={12} md={5} lg={4}>
        {renderLeftPanel()}
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        {renderRightPanel()}
      </Grid>

      {!!editSidebarOpen && (
        <DynamicFormSidebar
          isCreating={false}
          onSubmit={handleOnEditSubmit}
          title={'Edit ' + entitySchema?.name}
          formId={'Edit_' + entitySchema?.name}
          initialValues={entityData}
          preloadForm={editEntityForm}
          open={editSidebarOpen}
          toggle={toggleEditDrawer}
          onSubmitDone={() => {
            toggleEditDrawer();

            return Promise.resolve();
          }}
        />
      )}
    </Grid>
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

export default WorkersEdit;
