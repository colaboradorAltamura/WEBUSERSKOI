// ** MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field';

// ** Icon Imports
import { Checkbox, ListItemText, MenuItem, Select, SelectChangeEvent, capitalize, useTheme } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import CustomRadioIcons from 'src/@core/components/custom-radio/icons';
import { CustomRadioIconsData, CustomRadioIconsProps } from 'src/@core/components/custom-radio/types';
import Icon from 'src/@core/components/icon';

import { Form, Formik } from 'formik';
import PhoneNumberDropdown from 'src/@core/layouts/components/shared-components/custom-components/PhoneNumberDropdown';
import { DynamicComponentTypes } from 'src/types/dynamics';

import DynamicFormComponent from 'src/views/components/dynamics/DynamicFormComponent';
import * as Yup from 'yup';
import { useApplicantsOnboarding } from 'src/hooks/useApplicantsOnboarding';
import { useTranslation } from 'react-i18next';

interface IconType {
  icon: CustomRadioIconsProps['icon'];
  iconProps: CustomRadioIconsProps['iconProps'];
}

interface props {
  handleNext: () => void;
}

const STEP_VALIDATIONS_REQUESTER = Yup.object().shape({
  relativeFullname: Yup.string().required('Field is required'),
  relativeIdentificationNumber: Yup.string().required('Field is required'),
  relativePhoneNumber: Yup.string().required('Field is required'),
  relativeEmail: Yup.string().email().required('Field is required'),
  applicantFullname: Yup.string().required('Field is required'),
  applicantIdentificationNumber: Yup.string().required('Field is required'),
  applicantPhoneNumber: Yup.string().required('Field is required'),
  applicantBirthdate: Yup.date().required('Field is required').max(new Date(), 'Select a valid date'),
  applicantEmail: Yup.string().email().required('Field is required'),
});

const STEP_VALIDATIONS_APPLICANT = Yup.object().shape({
  applicantFullname: Yup.string().required('Field is required'),
  applicantIdentificationNumber: Yup.string().required('Field is required'),
  applicantPhoneNumber: Yup.string().required('Field is required'),
  applicantBirthdate: Yup.date().required('Field is required').max(new Date(), 'Select a valid date'),
  applicantEmail: Yup.string().email().required('Field is required'),
});

const StepGeneralInformationForm = ({ handleNext }: props) => {
  // ** Hooks
  const onboarding = useApplicantsOnboarding();
  const theme = useTheme();
  const { t } = useTranslation();

  const data: CustomRadioIconsData[] = [
    {
      value: 'byRequester',
      content: '',
      isSelected: true,
      title: (
        <Typography variant='h6' sx={{ mb: 1 }}>
          {t('service for other') as string}
        </Typography>
      ),
    },
    {
      value: 'byApplicant',
      content: '',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }}>
          {t('service for me') as string}
        </Typography>
      ),
    },
  ];
  const icons: IconType[] = [
    {
      icon: 'tabler:heart-handshake',
      iconProps: { fontSize: '2.5rem', style: { marginBottom: 8 }, color: theme.palette.text.secondary },
    },
    {
      icon: 'tabler:user',
      iconProps: { fontSize: '2.5rem', style: { marginBottom: 8 }, color: theme.palette.text.secondary },
    },
  ];

  const initialIconSelected: string = data.filter((item) => item.isSelected)[
    data.filter((item) => item.isSelected).length - 1
  ].value;

  const relationWithApplicantOptions = [
    { label: t('mother'), value: 'mother' },
    { label: t('father'), value: 'father' },
    { label: t('sister-brother'), value: 'sister-brother' },
    { label: t('child'), value: 'child' },
    { label: t('partner'), value: 'partner' },
    { label: t('other'), value: 'other' },
  ];
  const genderOptions = [
    { label: t('man'), value: 'man' },
    { label: t('woman'), value: 'woman' },
    { label: t('other'), value: 'other' },
  ];

  const identificationTypeOptions = [
    { label: t('identificationType value'), value: t('identificationType value') },
    { label: t('other'), value: 'other' },
  ];

  const initialValues = onboarding.onboardingData;

  const [selectedRadio, setSelectedRadio] = useState<string>(initialIconSelected);
  const [displayRequesterForm, setDisplayRequesterForm] = useState<string>('inline');
  const [submitError, setSubmitError] = useState<any>(null);
  const [isCreating, setIsCreating] = useState<boolean>(true);
  const [STEP_VALIDATIONS, setStepValidations] = useState<any>(STEP_VALIDATIONS_REQUESTER);

  const [relativeIdentificationType, setRelativeIdentificationType] = useState<string>(
    initialValues.relativeIdentificationType
      ? initialValues.relativeIdentificationType
      : identificationTypeOptions[0].value
  );

  const [relationWithApplicant, setRelationWithApplicant] = useState<string>(
    initialValues.relationWithApplicant ? initialValues.relationWithApplicant : relationWithApplicantOptions[0].value
  );

  const [applicantGender, setApplicantGender] = useState<string>(
    initialValues.applicantGender ? initialValues.applicantGender : genderOptions[0].value
  );
  const [applicantIdentificationType, setApplicantIdentificationType] = useState<string>(
    initialValues.applicantIdentificationType
      ? initialValues.applicantIdentificationType
      : identificationTypeOptions[0].value
  );

  const handleRadioChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setSelectedRadio(prop);
      setVisibilityRequesterForm(prop);
    } else {
      setSelectedRadio((prop.target as HTMLInputElement).value);
    }
  };

  const setVisibilityRequesterForm = (prop: string) => {
    if (prop === 'byApplicant') {
      setDisplayRequesterForm('none');
      setStepValidations(STEP_VALIDATIONS_APPLICANT);
    } else {
      setDisplayRequesterForm('inline');
      setStepValidations(STEP_VALIDATIONS_REQUESTER);
    }
  };

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

        // es un select async
        itemValues[key] = itemValue.value;
      });

      itemValues['applicantIdentificationType'] = applicantIdentificationType;
      itemValues['relativeIdentificationType'] = relativeIdentificationType;
      itemValues['applicantGender'] = applicantGender;
      itemValues['relationWithApplicant'] = relationWithApplicant;

      onboarding.saveOnboardingData(itemValues);

      // await onSubmit(itemValues, isCreating);
      handleNext();
      actions.setSubmitting(false);
    } catch (e) {
      setSubmitError(e);
      actions.setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={STEP_VALIDATIONS}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting }) => (
          <Form id={'stepGeneralInformationForm'} autoComplete='off'>
            <Grid container sx={{ mb: 6 }} spacing={4}>
              {data.map((item, index) => (
                <CustomRadioIcons
                  key={index}
                  data={data[index]}
                  icon={icons[index].icon}
                  selected={selectedRadio}
                  name='custom-radios-deal'
                  gridProps={{ sm: 6, xs: 12 }}
                  handleChange={handleRadioChange}
                  iconProps={icons[index].iconProps}
                />
              ))}
            </Grid>

            <Box sx={{ display: displayRequesterForm }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant='h5'>{capitalize(t('relative information') as string)}</Typography>
              </Box>

              <Grid container spacing={5} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                  <DynamicFormComponent
                    component={{
                      id: 'relativeFullname',
                      name: 'relativeFullname',
                      label: t('fullname') as string,
                      type: DynamicComponentTypes.FORM_TEXT,
                      dimensions: { xs: 12, sm: 12 },
                      errorMsg: t('field required msj') as string,
                    }}
                    isCreating={isCreating}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    select
                    fullWidth
                    label={t('type') as string}
                    id='relativeIdentificationType'
                    defaultValue={relativeIdentificationType}
                    onChange={(e) => setRelativeIdentificationType(e.target.value)}
                  >
                    {identificationTypeOptions.map((item, index) => {
                      return (
                        <MenuItem key={index} value={item.value}>
                          {item.label}
                        </MenuItem>
                      );
                    })}
                  </CustomTextField>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <DynamicFormComponent
                    component={{
                      id: 'relativeIdentificationNumber',
                      name: 'relativeIdentificationNumber',
                      label: t('identificationNumber') as string,
                      type: DynamicComponentTypes.FORM_TEXT,
                      dimensions: { xs: 12, sm: 9 },
                      errorMsg: t('field required msj') as string,
                    }}
                    isCreating={isCreating}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DynamicFormComponent
                    component={{
                      id: 'relativePhoneNumber',
                      name: 'relativePhoneNumber',
                      label: t('phone number') as string,
                      type: DynamicComponentTypes.FORM_TEXT,
                      dimensions: { xs: 12, sm: 12 },
                      errorMsg: t('field required msj') as string,
                    }}
                    isCreating={isCreating}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label={t('relationWithApplicant') as string}
                    id='relationWithApplicant'
                    defaultValue={relationWithApplicant}
                    onChange={(e) => setRelationWithApplicant(e.target.value)}
                  >
                    {relationWithApplicantOptions.map((item, index) => {
                      return (
                        <MenuItem key={index} value={item.value}>
                          {item.label}
                        </MenuItem>
                      );
                    })}
                  </CustomTextField>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <DynamicFormComponent
                    component={{
                      id: 'relativeEmail',
                      name: 'relativeEmail',
                      label: t('email') as string,
                      type: DynamicComponentTypes.FORM_EMAIL,
                      dimensions: { xs: 12, sm: 12 },
                      errorMsg: t('field required msj') as string,
                    }}
                    isCreating={isCreating}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Box sx={{ mb: 4 }}>
                <Typography variant='h5'>{capitalize(t('applicant information')) as string}</Typography>
              </Box>

              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <DynamicFormComponent
                    component={{
                      id: 'applicantFullname',
                      name: 'applicantFullname',
                      label: t('fullname') as string,
                      type: DynamicComponentTypes.FORM_TEXT,
                      dimensions: { xs: 12, sm: 12 },
                      errorMsg: t('field required msj') as string,
                    }}
                    isCreating={isCreating}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    select
                    fullWidth
                    label={t('type') as string}
                    id='applicantNumerIdType'
                    defaultValue={applicantIdentificationType}
                    onChange={(e) => setApplicantIdentificationType(e.target.value)}
                  >
                    {identificationTypeOptions.map((item, index) => {
                      return (
                        <MenuItem key={index} value={item.value}>
                          {item.label}
                        </MenuItem>
                      );
                    })}
                  </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <DynamicFormComponent
                    component={{
                      id: 'applicantIdentificationNumber',
                      name: 'applicantIdentificationNumber',
                      label: t('identificationNumber') as string,
                      type: DynamicComponentTypes.FORM_TEXT,
                      dimensions: { xs: 12, sm: 12 },
                      errorMsg: t('field required msj') as string,
                    }}
                    isCreating={isCreating}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DynamicFormComponent
                    component={{
                      id: 'applicantPhoneNumber',
                      name: 'applicantPhoneNumber',
                      label: t('phone number') as string,
                      type: DynamicComponentTypes.FORM_TEXT,
                      dimensions: { xs: 12, sm: 12 },
                      errorMsg: t('field required msj') as string,
                    }}
                    isCreating={isCreating}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DynamicFormComponent
                    component={{
                      id: '',
                      name: 'applicantBirthdate',
                      label: t('birthdate') as string,
                      type: DynamicComponentTypes.FORM_DATE,
                      dimensions: { xs: 12, sm: 12 },
                      errorMsg: t('valid date msj') as string,
                    }}
                    isCreating={isCreating}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    select
                    fullWidth
                    label={t('gender') as string}
                    id='applicantGender'
                    defaultValue={applicantGender}
                    onChange={(e) => setApplicantGender(e.target.value)}
                  >
                    {genderOptions.map((item, index) => {
                      return (
                        <MenuItem key={index} value={item.value}>
                          {item.label}
                        </MenuItem>
                      );
                    })}
                  </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <DynamicFormComponent
                    component={{
                      id: 'applicantEmail',
                      name: 'applicantEmail',
                      label: t('email') as string,
                      type: DynamicComponentTypes.FORM_TEXT,
                      dimensions: { xs: 12, sm: 12 },
                      errorMsg: t('field required msj') as string,
                    }}
                    isCreating={isCreating}
                  />
                </Grid>

                <Grid item xs={12} sx={{ pt: (theme) => `${theme.spacing(6)} !important` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button disabled variant='tonal' sx={{ '& svg': { mr: 2 } }}>
                      <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
                      {capitalize(t('previous') as string)}
                    </Button>
                    <Button variant='contained' type='submit' sx={{ '& svg': { ml: 2 } }} disabled={isSubmitting}>
                      {capitalize(t('next') as string)}
                      <Icon fontSize='1.125rem' icon='tabler:arrow-right' />
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default StepGeneralInformationForm;
