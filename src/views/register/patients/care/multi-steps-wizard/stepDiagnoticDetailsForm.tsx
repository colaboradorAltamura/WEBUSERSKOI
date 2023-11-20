// ** React Imports
import { useState, ChangeEvent } from 'react';

// ** MUI Components
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

// ** Icon Imports
import Icon from 'src/@core/components/icon';
// ** Custom Components Imports
import CustomTextField from 'src/@core/components/mui/text-field';
// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useApplicantsOnboarding } from 'src/hooks/useApplicantsOnboarding';
import DynamicFormComponent from 'src/views/components/dynamics/DynamicFormComponent';
import { DynamicComponentTypes } from 'src/types/dynamics';
import { useTranslation } from 'react-i18next';
import { capitalize } from '@mui/material';

const STEP_VALIDATIONS = Yup.object().shape({
  diagnostic: Yup.string().required('Field is required'),
});

const StepDiagnoticDetailForm = ({ handleNext, handlePrev }: { [key: string]: () => void }) => {
  //**  hooks
  const onboarding = useApplicantsOnboarding();
  const { t } = useTranslation();

  // ** State
  const [isCreating, setIsCreating] = useState<boolean>(true);
  const [submitError, setSubmitError] = useState<any>(null);

  const handleSubmit = async (values: any, actions: any) => {
    try {
      setSubmitError(null);
      actions.setSubmitting(true);

      // clono para no modificar el original del form
      const itemValues = { ...values };

      const keys = Object.keys(itemValues);

      keys.forEach((key) => {
        const itemValue = itemValues[key];

        if (!itemValue.isOptionField) return;

        itemValues[key] = itemValue.value;
      });

      onboarding.saveOnboardingData(itemValues);

      handleNext();

      actions.setSubmitting(false);
    } catch (e) {
      setSubmitError(e);
      actions.setSubmitting(false);
    }
  };

  const initialValues = onboarding.onboardingData;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={STEP_VALIDATIONS}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting }) => (
          <Form id={'stepDiagnosticDetailsForm'} autoComplete='off'>
            <Box sx={{ mb: 2 }}>
              <Typography variant='h5'>{capitalize(t('diagnostic') as string)}</Typography>
            </Box>
            <Grid container spacing={5} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={12}>
                <DynamicFormComponent
                  component={{
                    id: 'diagnostic',
                    name: 'diagnostic',
                    label: t('diagnostic hypothesis') as string,
                    type: DynamicComponentTypes.FORM_TEXT,
                    dimensions: { xs: 12, sm: 12 },
                    errorMsg: t('Field required') as string,
                  }}
                  isCreating={isCreating}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <DynamicFormComponent
                  component={{
                    id: 'specialNeeds',
                    name: 'specialNeeds',
                    label: t('specialNeeds') as string,
                    type: DynamicComponentTypes.FORM_TEXT,
                    dimensions: { xs: 12, sm: 12 },
                  }}
                  isCreating={isCreating}
                />
              </Grid>
            </Grid>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h5'>{capitalize(t('professional team') as string)}</Typography>
            </Box>
            <Grid container spacing={5} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <DynamicFormComponent
                  component={{
                    id: 'professionalStaffFullname',
                    name: 'professionalStaffFullname',
                    label: t('fullname') as string,
                    type: DynamicComponentTypes.FORM_TEXT,
                    dimensions: { xs: 12, sm: 12 },
                  }}
                  isCreating={isCreating}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DynamicFormComponent
                  component={{
                    id: 'professionalStaffPhoneNumber',
                    name: 'professionalStaffPhoneNumber',
                    label: t('phone number') as string,
                    type: DynamicComponentTypes.FORM_TEXT,
                    dimensions: { xs: 12, sm: 12 },
                  }}
                  isCreating={isCreating}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ pt: (theme) => `${theme.spacing(6)} !important` }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button color='secondary' variant='tonal' onClick={handlePrev} sx={{ '& svg': { mr: 2 } }}>
                  <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
                  {capitalize(t('previous') as string)}
                </Button>
                <Button variant='contained' type='submit' disabled={isSubmitting} sx={{ '& svg': { ml: 2 } }}>
                  {capitalize(t('next') as string)}
                  <Icon fontSize='1.125rem' icon='tabler:arrow-right' />
                </Button>
              </Box>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default StepDiagnoticDetailForm;
