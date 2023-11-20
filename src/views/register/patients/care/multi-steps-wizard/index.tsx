// ** React Imports
import { useState } from 'react';

// ** MUI Imports
import Avatar from '@mui/material/Avatar';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { Theme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MuiStep, { StepProps } from '@mui/material/Step';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar';

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings';

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper';

// ** Step Components
import StepGeneralInformationForm from './stepGeneralInformationForm';
import StepDiagnoticDetailsForm from './stepDiagnoticDetailsForm';
import StepServiceTypeForm from './stepServiceTypeForm';
import StepPaymentDetailsForm from './stepPaymentDetailsForm';
import { useApplicantsOnboarding } from 'src/hooks/useApplicantsOnboarding';
import { dynamicCreate } from 'src/services/entitiesDynamicServices';
import { Box } from '@mui/system';
import { CircularProgress, Grid, capitalize } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Loader from 'src/@core/components/loader';
import { DEFAULT_ORGANIZATION_ID } from 'src/configs/appConfig';

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

const ApplicantsMultiSteps = () => {
  // ** States
  const [activeStep, setActiveStep] = useState<number>(0);

  // ** Hooks & Var
  const { settings } = useSettings();
  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const { direction } = settings;
  const onboarding = useApplicantsOnboarding();
  const { t } = useTranslation();

  // ** states
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const steps = [
    {
      title: t('general information') as string,
      icon: 'tabler:users',
    },
    {
      title: capitalize(t('diagnostic')) as string,
      icon: 'tabler:activity',
    },
    {
      title: t('service type') as string,
      icon: 'tabler:building-community',
    },
    {
      title: t('payment details') as string,
      icon: 'tabler:receipt',
    },
  ];

  // Handle Stepper
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleOnSubmitApplicants = async (formData: any, isCreating: boolean) => {
    try {
      const entitySchemaName = 'applicants';

      setIsLoading(true);

      let response = null;
      response = await dynamicCreate({
        params: `/cms/public/${DEFAULT_ORGANIZATION_ID}/${entitySchemaName}`,
        data: formData,
      });

      setIsLoading(false);

      return Promise.resolve();
    } catch (e) {
      setIsLoading(false);

      return Promise.reject(e);
    }
  };
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <StepGeneralInformationForm handleNext={handleNext} />;
      case 1:
        return <StepDiagnoticDetailsForm handleNext={handleNext} handlePrev={handlePrev} />;
      case 2:
        return <StepServiceTypeForm handleNext={handleNext} handlePrev={handlePrev} />;
      case 3:
        return <StepPaymentDetailsForm handlePrev={handlePrev} onSubmit={handleOnSubmitApplicants} />;

      default:
        return <>error</>;
    }
  };

  const renderContent = () => {
    return getStepContent(activeStep);
  };

  return (
    <>
      <Grid>
        <StepperWrapper sx={{ mb: 11.5 }}>
          <Stepper
            activeStep={activeStep}
            sx={{ justifyContent: 'space-between' }}
            connector={
              !smallScreen ? <Icon icon={direction === 'ltr' ? 'tabler:chevron-right' : 'tabler:chevron-left'} /> : null
            }
          >
            {steps.map((step, index) => {
              const RenderAvatar = activeStep >= index ? CustomAvatar : Avatar;

              return (
                <Step key={index} expanded={true} onClick={() => setActiveStep(index)}>
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
                          ...(activeStep > index && { color: (theme) => hexToRGBA(theme.palette.primary.main, 0.4) }),
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
        {renderContent()}
      </Grid>
    </>
  );
};

export default ApplicantsMultiSteps;
