// ** MUI Import
import Grid from '@mui/material/Grid';

import { SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// ** Icon Imports
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Loader from 'src/@core/components/loader';
import { useAuth } from 'src/hooks/useAuth';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { useRouter } from 'next/router';
import { CMSCollections, IAddress, IUsersAddress, IWorker, WorkerStateTypes } from 'src/types/@autogenerated';
import { IEntitySchema, IEntitySchemaField, IEntitySchemaWithFields } from 'src/types/entities';
import { handleError } from 'src/@core/coreHelper';
import { dynamicGet, dynamicUpdate } from 'src/services/entitiesDynamicServices';
import { useDynamics } from 'src/hooks/useDynamics';
import MuiStep, { StepProps } from '@mui/material/Step';
import {
  Avatar,
  CardContent,
  StepLabel,
  Stepper,
  Theme,
  Typography,
  capitalize,
  styled,
  useMediaQuery,
} from '@mui/material';
import { useSettings } from 'src/@core/hooks/useSettings';
import StepperWrapper from 'src/@core/styles/mui/stepper';
import { Icon } from '@iconify/react';
import IntroductionStep from 'src/views/therapist/multi-steps/IntroductionStep';
import SummaryStep from 'src/views/therapist/multi-steps/SummaryStep';
import JobExperienceStep from 'src/views/therapist/multi-steps/JobExperienceStep';
import JobPreferencesStep from 'src/views/therapist/multi-steps/JobPreferencesStep';
import DocumentsStep from 'src/views/therapist/multi-steps/DocumentsStep';
// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar';
// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';
import AvailabilityStep from 'src/views/therapist/multi-steps/AvailabilityStep';
import HomeActiveTherapist from './active';
import BannersWorker from 'src/@core/components/custom-banners/workers';
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider';

const SCHEMA_NAME = CMSCollections.WORKERS;

const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
  padding: 0,
  '& .MuiStepLabel-iconContainer': {
    display: 'none',
  },
  '& .step-subtitle': {
    color: `${theme.palette.text.disabled} !important`,
  },
  '& + svg': {
    color: theme.palette.text.disabled,
  },
  '&.Mui-completed .step-title': {
    color: theme.palette.text.disabled,
  },
  '&.Mui-completed + svg': {
    color: theme.palette.primary.main,
  },
  '& .MuiStepLabel-label': {
    cursor: 'pointer',
  },
  [theme.breakpoints.down('md')]: {
    '&:not(:last-child)': {
      marginBottom: theme.spacing(6),
    },
    '& + svg': {
      display: 'none',
    },
  },
  [theme.breakpoints.up('md')]: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    '&:first-of-type': {
      marginLeft: 0,
    },
    '&:last-of-type': {
      marginRight: 0,
    },
  },
}));

const HomeTherapist = () => {
  //HOOKS
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  const { settings, saveSettings } = useSettings();
  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const { direction } = settings;
  const dynamics = useDynamics();
  // ** Global vars
  const INITIAL_TAB = 0;
  // const tab = router.query['tab'] as string;

  //STATES
  const [entitySchema, setEntitySchema] = useState<IEntitySchema | null>(null);

  const [entitySchemaFields, setEntitySchemaFields] = useState<IEntitySchemaField[]>([]);
  const [entityData, setEntityData] = useState<IWorker>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(INITIAL_TAB);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [toggleData, setToggleData] = useState<boolean>(false);

  //steps
  const [activeStep, setActiveStep] = useState<number>(INITIAL_TAB);
  const [isLoadingStep, setIsLoadingStep] = useState<boolean>(false);

  // ** Address tab
  const [primaryAddress, setPrimaryAddress] = useState<IUsersAddress | null>(null);
  const [userAddresses, setUserAddresses] = useState<IUsersAddress[]>();

  const handleTabChange = (value: number) => {
    //  setLoadingSchema(true);
    setActiveTab(value);
  };
  useEffect(() => {
    const doAsync = async () => {
      try {
        setIsLoading(true);

        if (currentUser.isLoading) return;

        setIsLoading(false);
      } catch (e: any) {
        setIsLoading(false);
      }
    };

    doAsync();
  }, [currentUser.isLoading]);

  // fetch schema
  useEffect(() => {
    const doAsync = async () => {
      try {
        if (dynamics.isLoadingSchemas || !dynamics.entitySchemas || !dynamics.entitySchemasFields) return null;

        const schema = dynamics.entitySchemas.find((schema) => {
          return schema.name === SCHEMA_NAME;
        });
        if (!schema) throw new Error('Missing schemaName: ' + SCHEMA_NAME);
        const schemaFields = dynamics.entitySchemasFields.filter((field) => {
          return field.schemaId === schema.id;
        });

        const entitySchemaResponse: IEntitySchemaWithFields = { ...schema, fields: schemaFields };

        setEntitySchema(entitySchemaResponse);

        setEntitySchemaFields(
          entitySchemaResponse.fields.sort((a, b) => {
            return a.order - b.order;
          })
        );
      } catch (e: any) {
        handleError(e);
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
        if (!currentUser.currentUser || !currentUser.currentUser.rolsData || !currentUser.currentUser.rolsData.worker)
          throw new Error('Missing currentUser.currentUser worker data');

        setEntityData(currentUser.currentUser.rolsData.worker);

        const addresses = await dynamicGet({
          params: `/cms/${CMSCollections.USERS_ADDRESSES}/by-user/${currentUser.currentUser.id}`,
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

        if (currentUser && currentUser.currentUser && currentUser.currentUser.rolsData)
          if (currentUser.currentUser.rolsData.worker?.workerState !== WorkerStateTypes.ACTIVE)
            saveSettings({ ...settings, navHidden: true });

        setLoadingData(false);
        setIsLoadingStep(false);
      } catch (e: any) {
        handleError(e);
        setLoadingData(false);
      }
    };

    doAsync();
  }, [entitySchema, toggleData, currentUser.isLoading]);

  // fetch entity data
  useEffect(() => {
    setActiveStep(getActiveStep());
  }, [entityData]);

  const userFirstName = currentUser.currentUser ? currentUser.currentUser.firstName : '';

  const onSubmitData = async (formData: IWorker, isReload: boolean) => {
    try {
      const entitySchemaName = 'workers';
      setIsLoadingStep(true);

      let response = null;
      response = await dynamicUpdate({
        params: '/cms/' + entitySchemaName + '/mine/' + formData.id,
        data: formData,
      });

      if (!isReload) handleNext(); //solo hace el next step

      window.location.reload();
      //  else setToggleData(!toggleData);

      return Promise.resolve();
    } catch (e) {
      handleError(e);
      setIsLoadingStep(false);

      return Promise.reject(e);
    }
  };
  // Handle Stepper
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1);
    }
  };

  //obtiene el step activo segun el estatus del form del worker
  const getActiveStep = () => {
    if (!entityData) return 0;
    switch (entityData.workerState) {
      case WorkerStateTypes.PENDING_INTERVIEW:
        return 0;
      case WorkerStateTypes.PENDING_GENERAL_INFO:
        return 1;
      case WorkerStateTypes.PENDING_EXPERIENCE:
        return 2;
      case WorkerStateTypes.PENDING_PREFERENCES:
        return 3;
      case WorkerStateTypes.PENDING_AVAILABILITY:
        return 4;
      case WorkerStateTypes.PENDING_DOCS:
      case WorkerStateTypes.INFORMATION_COMPLETED:
        return 5;
      default:
        return 0;
    }
  };

  const steps = [
    {
      title: t('introduction interview') as string,
      icon: 'tabler:calendar-event',
    },
    {
      title: capitalize(t('general information')) as string,
      icon: 'tabler:user',
    },
    {
      title: t('job experience') as string,
      icon: 'tabler:building-skyscraper',
    },
    {
      title: t('address and work area') as string,
      icon: 'tabler:building-estate',
    },
    {
      title: capitalize(t('availability') as string),
      icon: 'tabler:clock-edit',
    },
    {
      title: t('Documentation') as string,
      icon: 'tabler:files',
    },
  ];

  const getStepContent = (step: number) => {
    // si el value de actuve Tab se imprime antes de los tabs estalla el comp
    if (!entitySchema || !entityData || !primaryAddress) return <Loader />;

    switch (step) {
      case 0:
        return <IntroductionStep handleNext={handleNext} entityData={entityData} />;
      case 1:
        return <SummaryStep entityData={entityData} onSubmit={onSubmitData} />;
      case 2:
        return <JobExperienceStep handlePrev={handlePrev} entityData={entityData} onSubmit={onSubmitData} />;
      case 3:
        return (
          <JobPreferencesStep
            handlePrev={handlePrev}
            entityData={entityData}
            addressData={primaryAddress}
            onSubmit={onSubmitData}
          />
        );
      case 4:
        return <AvailabilityStep handlePrev={handlePrev} entityData={entityData} onSubmit={onSubmitData} />;

      case 5:
        return <DocumentsStep handlePrev={handlePrev} entityData={entityData} onSubmit={onSubmitData} />;
      default:
        return <>error</>;
    }
  };
  const renderContent = () => {
    return getStepContent(activeStep);
  };
  const disabledStep = (index: number, step: any) => {
    if (!step.disabled) setActiveStep(index);

    return;
  };

  if (isLoading || currentUser.isLoading || isLoadingStep) return <Loader />;
  //si es worker activo y si ya se consulto primaryAddress
  if (currentUser && currentUser.currentUser && currentUser.currentUser.rolsData && primaryAddress) {
    if (currentUser.currentUser.rolsData.worker?.workerState == WorkerStateTypes.ACTIVE) {
      return (
        <HomeActiveTherapist workerData={currentUser.currentUser.rolsData.worker} addressWorker={primaryAddress} />
      );
    } else {
      return (
        <>
          <KeenSliderWrapper sx={{ marginBottom: '10px' }}>
            <Grid item xs={12}>
              <BannersWorker />
            </Grid>
          </KeenSliderWrapper>
          <Card>
            <CardHeader title={t('welcome') + ' ' + userFirstName + ' 🎉 - '} />

            <CardContent>
              <Grid item xs={12} md={12} lg={12} sx={{ marginTop: '15px' }}>
                <StepperWrapper sx={{ mb: 11.5 }}>
                  <Stepper
                    activeStep={activeStep}
                    sx={{ justifyContent: 'space-between' }}
                    connector={
                      !smallScreen ? (
                        <Icon icon={direction === 'ltr' ? 'tabler:chevron-right' : 'tabler:chevron-left'} />
                      ) : null
                    }
                  >
                    {steps.map((step, index) => {
                      const RenderAvatar = activeStep >= index ? CustomAvatar : Avatar;

                      return (
                        <Step key={index} expanded={true}>
                          <StepLabel>
                            <div className='step-label'>
                              <RenderAvatar
                                variant='rounded'
                                {...(activeStep >= index && { skin: 'light' })}
                                {...(activeStep === index && { skin: 'filled' })}
                                {...(activeStep >= index && { color: 'primary' })}
                                sx={{
                                  mr: 4,
                                  ...(activeStep === index && { boxShadow: (theme) => theme.shadows[3] }),
                                  ...(activeStep > index && {
                                    color: (theme) => hexToRGBA(theme.palette.primary.main, 0.4),
                                  }),
                                }}
                              >
                                <Icon fontSize='1.5rem' icon={step.icon} />
                              </RenderAvatar>
                              <div>
                                <Typography variant='h6' className='step-title'>
                                  {step.title}
                                </Typography>
                              </div>
                            </div>
                          </StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                </StepperWrapper>
                {isLoadingStep ? <Loader /> : renderContent()}
              </Grid>
            </CardContent>
          </Card>
        </>
      );
    }
  } else return <Loader />;
};

export default HomeTherapist;
