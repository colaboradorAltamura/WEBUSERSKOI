// ** React Imports
import { Fragment, useEffect, useState } from 'react';

// ** MUI Imports
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent, { CardContentProps } from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MuiStep, { StepProps } from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { Theme, styled } from '@mui/material/styles';

// ** Third Party Imports

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Custom Components Imports

import CustomAvatar from 'src/@core/components/mui/avatar';

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';

// ** Styled Component
import StepperWrapper from 'src/@core/styles/mui/stepper';

import useMediaQuery from '@mui/material/useMediaQuery';
import { FormikErrors, FormikTouched } from 'formik';
import Loader from 'src/@core/components/loader';
import { useSettings } from 'src/@core/hooks/useSettings';
import { useDynamics } from 'src/hooks/useDynamics';
import {
  FormStepType,
  IDynamicComponent,
  IDynamicFormComponent,
  IDynamicInlineComponent,
  IForm,
} from 'src/types/dynamics';
import StepperCustomDot from 'src/views/forms/form-wizard/StepperCustomDot';
import DynamicComponent from './DynamicComponent';
import { CONDITIONAL_RENDER_NON_EMPTY_STRING } from 'src/@core/coreHelper';
import { processConditionalRender } from './helpers';

interface PropsType {
  form: IForm;
  allSteps: FormStepType[];

  values: any;
  touched: FormikTouched<any>;
  errors: FormikErrors<any>;

  isSubmitting: boolean;

  onStepChange?: (activeStepIndex: number) => void;
  onStepComponentsChange?: (currentStepComponents: IDynamicFormComponent[] | IDynamicComponent[] | null) => void;

  inlineComponents?: IDynamicInlineComponent[];
  isCreating?: boolean;

  onBack: () => void;
  activeStep?: FormStepType | null;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  activeStepIndex: number;
}

const StepperHeaderContainer = styled(CardContent)<CardContentProps>(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 0,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const DynamicFormStep = ({
  form,
  allSteps,
  values,
  errors,
  touched,
  isSubmitting,
  onStepChange,
  onStepComponentsChange,
  inlineComponents,
  isCreating,

  onBack,
  activeStep,
  isFirstStep,
  isLastStep,
  activeStepIndex,

  ...rest
}: PropsType) => {
  // ** State

  // ** Hooks
  const dynamics = useDynamics();
  const { settings } = useSettings();
  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const [currentStepComponents, setCurrentStepComponents] = useState<
    IDynamicFormComponent[] | IDynamicComponent[] | null
  >(null);

  const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    '&:first-of-type': {
      paddingLeft: 0,
    },
    '&:last-of-type': {
      paddingRight: 0,
    },
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
    [theme.breakpoints.down('md')]: {
      padding: 0,
      ':not(:last-of-type)': {
        marginBottom: theme.spacing(6),
      },
    },
  }));

  useEffect(() => {
    if (!activeStep) return;

    const arr = processConditionalRender(activeStep.components, values);

    setCurrentStepComponents(arr);
    if (onStepComponentsChange) onStepComponentsChange(activeStep.components);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, values]);

  const renderCurrentStep = () => {
    // if (activeStep === steps.length) {

    if (!activeStep) return;

    return (
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
            {activeStep.title}
          </Typography>
          <Typography variant='caption' component='p'>
            {activeStep.subTitle}
          </Typography>
        </Grid>
        {/* {getStepContent(activeStep)} */}

        <Fragment key={'step' + activeStepIndex}>
          {activeStep.components.map((component, index) => {
            if ((component.hidden?.create && isCreating) || (component.hidden?.edit && !isCreating)) return null;

            let xs = 12;
            let sm = 6;

            if (component.dimensions && component.dimensions.xs) xs = parseInt(component.dimensions.xs as any);
            if (component.dimensions && component.dimensions.sm) sm = parseInt(component.dimensions.sm as any);

            return (
              <Grid key={index} item xs={xs} sm={sm}>
                {/* <DynamicFormComponent component={component} /> */}
                <DynamicComponent component={component} isCreating={isCreating} />
              </Grid>
            );
          })}

          {!!inlineComponents &&
            inlineComponents.map((ic, index) => {
              let xs = 12;
              let sm = 6;

              if (ic.dimensions && ic.dimensions.xs) xs = ic.dimensions.xs;
              if (ic.dimensions && ic.dimensions.sm) sm = ic.dimensions.sm;

              return (
                <Grid key={index} item xs={xs} sm={sm}>
                  {ic.component}
                </Grid>
              );
            })}
        </Fragment>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: isFirstStep ? 'right' : 'space-between' }}>
          {/* {form.footer.actions.map((action) => {

if (action.component.attachEvent) action.component.

            return <DynamicFormComponent component={action.component}  />;
          })} */}

          {!isFirstStep && (
            <Button variant='tonal' color='secondary' disabled={activeStepIndex === 0} onClick={onBack}>
              Back
            </Button>
          )}

          {isLastStep && (
            <Button variant='contained' type={'submit'} disabled={isSubmitting}>
              Submit
            </Button>
          )}

          {!isLastStep && (
            <Button variant='contained' type={'submit'} disabled={isSubmitting}>
              Next
            </Button>
            // <Button variant='contained' type={'submit'} onClick={handleNext} disabled={isSubmitting}>
            //   Next
            // </Button>
          )}
        </Grid>
      </Grid>
    );
  };

  if (currentStepComponents === null) return <Loader />;

  const stepperOrientation = 'horizontal';

  let connector: any = <></>;

  if (stepperOrientation === 'horizontal') {
    connector = !smallScreen ? <Icon icon={'tabler:chevron-right'} /> : null;
  }

  return (
    <Card
      sx={null}

      // sx={stepperOrientation === 'vertical' ? { display: 'flex', flexDirection: { xs: 'column', md: 'row' } } : null}
    >
      {allSteps.length > 1 && (
        <>
          <StepperHeaderContainer>
            <StepperWrapper sx={{ height: '100%' }}>
              <Stepper
                activeStep={activeStepIndex}
                orientation={stepperOrientation}
                connector={connector}

                // sx={{ height: '100%', minWidth: '15rem' }}
              >
                {allSteps.map((step, index) => {
                  const RenderAvatar = activeStepIndex >= index ? CustomAvatar : Avatar;

                  return (
                    <Step key={index}>
                      <StepLabel StepIconComponent={StepperCustomDot}>
                        <div className='step-label'>
                          <RenderAvatar
                            variant='rounded'
                            {...(activeStepIndex >= index && { skin: 'light' })}
                            {...(activeStepIndex === index && { skin: 'filled' })}
                            {...(activeStepIndex >= index && { color: 'primary' })}
                            sx={{
                              ...(activeStepIndex === index && { boxShadow: (theme) => theme.shadows[3] }),
                              ...(activeStepIndex > index && {
                                color: (theme) => hexToRGBA(theme.palette.primary.main, 0.4),
                              }),
                            }}
                          >
                            <Icon icon={step.iconName} />
                          </RenderAvatar>
                          <div>
                            <Typography className='step-title'>{step.title}</Typography>
                            <Typography className='step-subtitle'>{step.subTitle}</Typography>
                          </div>
                        </div>
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </StepperWrapper>
          </StepperHeaderContainer>
          <Divider sx={{ m: '0 !important' }} />
        </>
      )}
      <CardContent sx={{ width: '100%' }}>{renderCurrentStep()}</CardContent>
    </Card>
  );
};

export default DynamicFormStep;
