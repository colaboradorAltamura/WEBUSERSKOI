// ** React Imports
import { ChangeEvent, MouseEvent, ReactElement, Ref, forwardRef, useState } from 'react';

// ** MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Custom Components Imports
import CustomTextField from 'src/@core/components/mui/text-field';

// ** Type Import

// ** Demo Components Imports
// ** Styles Import
import {
  Checkbox,
  Dialog,
  DialogContent,
  Fade,
  FadeProps,
  IconButton,
  IconButtonProps,
  ListItemText,
  MenuItem,
  Popover,
  SelectChangeEvent,
  capitalize,
  styled,
} from '@mui/material';
import { Form, Formik } from 'formik';
import 'react-credit-cards/es/styles-compiled.css';
import { useApplicantsOnboarding } from 'src/hooks/useApplicantsOnboarding';

import * as Yup from 'yup';
import DynamicFormComponent from 'src/views/components/dynamics/DynamicFormComponent';
import { DynamicComponentTypes } from 'src/types/dynamics';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Loader from 'src/@core/components/loader';

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

//** error modal */
const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)',
  },
}));
const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});
//** error modal */

const STEP_VALIDATIONS_INSURANCE = Yup.object().shape({
  insuranceNumber: Yup.string().required('Field is required'),
});
const STEP_VALIDATIONS_OTHERINSURANCE = Yup.object().shape({
  insuranceNumber: Yup.string().required('Field is required'),
  otherInsurance: Yup.string().required('Field is required'),
});

const stringToBoolean = (value: string) => {
  if (value) {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }

  return false;
};
const StepPayDetailsForm = ({
  handlePrev,
  onSubmit,
}: {
  handlePrev: () => void;

  onSubmit: (formData: any, isCreating: boolean) => Promise<any>;
}) => {
  // ** Hooks
  const onboarding = useApplicantsOnboarding();
  const router = useRouter();
  const { t } = useTranslation();

  const initialValues = onboarding.onboardingData;

  // ** State
  const [insurance, setInsurance] = useState<string>('Accord Salud');
  const [paymentMode, setPaymentMode] = useState<string>(
    initialValues.paymentMode ? initialValues.paymentMode : 'refund'
  );
  const [insuranceDisplay, setInsuranceDisplay] = useState<string>('inline');
  const [otherInsuranceDisplay, setOtherInsuranceDisplay] = useState<string>('none');
  const [paymentMethod, setPaymentMethod] = useState<string>(
    initialValues.paymentMethod ? initialValues.paymentMethod : 'insurance'
  );
  const [cudCertificate, setcudCertificate] = useState<boolean>(
    initialValues.cudCertificate ? initialValues.cudCertificate : false
  );
  const [amparoIndicator, setAmparoIndicator] = useState<boolean>(
    initialValues.amparoIndicator ? initialValues.amparoIndicator : false
  );
  const [ivaCondition, setIvaCondition] = useState<string>(
    initialValues.ivaCondition ? initialValues.ivaCondition : '10-5'
  );
  const [otherInsuranceValue, setOtherInsuranceValue] = useState<string>('');
  const [ShowErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [submitError, setSubmitError] = useState<any>(null);
  const [isCreating, setIsCreating] = useState<boolean>(true);
  const [STEP_VALIDATIONS, setStepValidations] = useState<any>(STEP_VALIDATIONS_INSURANCE);

  const renderInsuranceChangeOptions = () => {
    const options: any[] = [
      {
        label: 'Accord Salud',
        value: 'Accord Salud',
      },
      {
        label: 'Bancarios',
        value: 'Bancarios',
      },
      {
        label: 'CASA',
        value: 'CASA',
      },
      {
        label: 'Das',
        value: 'DAS',
      },
      {
        label: 'Galeno',
        value: 'Galeno',
      },
      {
        label: 'Guincheros',
        value: 'Guincheros',
      },
      {
        label: 'Hospital Italiano',
        value: 'Hospital Italiano',
      },
      {
        label: 'IOMA',
        value: 'IOMA',
      },
      {
        label: 'Medicus',
        value: 'Medicus',
      },
      {
        label: 'MHM',
        value: 'MHM',
      },
      {
        label: 'Omint',
        value: 'Omint',
      },
      {
        label: 'Osde',
        value: 'Osde',
      },
      {
        label: 'OSIM',
        value: 'OSIM',
      },
      {
        label: 'Oslera/UP',
        value: 'Oslera/UP',
      },
      {
        label: 'Osmecom',
        value: 'Osmecom',
      },
      {
        label: 'Ospecom',
        value: 'Ospecom',
      },
      {
        label: 'Osppra',
        value: 'Osppra',
      },
      {
        label: 'Osuthgra',
        value: 'Outhgra',
      },
      {
        label: 'Pami',
        value: 'Pami',
      },
      {
        label: 'Poder Judicial',
        value: 'Poder Judicial',
      },
      {
        label: 'Swiss Medical',
        value: 'Swiss Medical',
      },
      {
        label: 'UOM',
        value: 'UOM',
      },
      {
        label: 'UP',
        value: 'UP',
      },
      {
        label: 'Otro',
        value: 'Otro',
      },
    ];

    return options.map((op, key) => {
      return (
        <MenuItem value={op.value} key={key}>
          <ListItemText primary={op.label} />
        </MenuItem>
      );
    });
  };

  const handleChangeInsurance = (event: SelectChangeEvent<unknown>) => {
    setInsurance(event.target.value as string);

    if (event.target.value === 'Otro') {
      setOtherInsuranceDisplay('inline');
      setStepValidations(STEP_VALIDATIONS_OTHERINSURANCE);
    } else {
      setOtherInsuranceDisplay('none');
      setStepValidations(STEP_VALIDATIONS_INSURANCE);
    }
  };

  const handlePaymentMethodChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setPaymentMethod(prop);

      if (prop === 'private-insurance') {
        setInsuranceDisplay('none');
        setStepValidations('');
      } else {
        setInsuranceDisplay('inline');
        setStepValidations(STEP_VALIDATIONS_INSURANCE);
      }
    } else {
      setPaymentMethod((prop.target as HTMLInputElement).value);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSubmit = async (values: any, actions: any) => {
    try {
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

      if (insurance === 'Otro') {
        itemValues['insurance'] = `${insurance}  -  ${otherInsuranceValue}`;
      } else if (paymentMethod !== 'private-insurance') {
        itemValues['insurance'] = insurance; //if it is 'private-insurance', insurance should be empty.
      }

      itemValues['paymentMethod'] = paymentMethod;
      itemValues['paymentMode'] = paymentMode;
      itemValues['ivaCondition'] = ivaCondition;
      itemValues['cudCertificate'] = cudCertificate;
      itemValues['amparoIndicator'] = amparoIndicator;
      onboarding.saveOnboardingData(itemValues);

      await onSubmit(itemValues, isCreating);

      actions.setSubmitting(false);

      actions.resetForm();

      router.push('/registerSuccess/patients/clinic');
    } catch (e) {
      setShowErrorModal(true);
      setSubmitError(e);

      actions.setSubmitting(false);

      // handleError(e);
    }
  };
  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      <Dialog
        fullWidth
        open={ShowErrorModal}
        maxWidth='sm'
        scroll='body'
        onClose={handleCloseErrorModal}
        onBackdropClick={handleCloseErrorModal}
        TransitionComponent={Transition}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pb: (theme) => `${theme.spacing(8)} !important`,
            px: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: (theme) => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
          }}
        >
          <CustomCloseButton onClick={handleCloseErrorModal}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              ¡Algo salió mal!
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Por favor intente de vuelta</Typography>
          </Box>
        </DialogContent>
      </Dialog>

      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={STEP_VALIDATIONS}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting }) => {
          if (isSubmitting) return <Loader />;

          return (
            <Form id={'stepPaymentDetailsField'} autoComplete='off'>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  mb: 8,
                  width: '100%',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography variant='subtitle1' sx={{ mb: 2 }}>
                  {t('applicant paymentMethod') as string}
                </Typography>
                <RadioGroup
                  row
                  value={paymentMethod}
                  sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                >
                  <FormControlLabel value='insurance' label={t('insurance') as string} control={<Radio />} />
                  <FormControlLabel
                    value='prepaid-insurance'
                    label={t('prepaid-insurance') as string}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value='private-insurance'
                    label={t('private-insurance') as string}
                    control={<Radio />}
                  />
                </RadioGroup>
              </Grid>

              <Box sx={{ display: insuranceDisplay }}>
                <Grid container spacing={5} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      select
                      fullWidth
                      label={t('insurance') as string}
                      id='select-multiple-checkbox-insurance'
                      name='selectinsurance'
                      SelectProps={{
                        MenuProps,
                        multiple: false,
                        value: insurance,
                        onChange: (e) => handleChangeInsurance(e),
                        renderValue: (selected: any) => {
                          const newVal = [...selected] as string[];

                          return newVal;
                        },
                      }}
                    >
                      {renderInsuranceChangeOptions()}
                    </CustomTextField>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ display: otherInsuranceDisplay }}>
                    <DynamicFormComponent
                      component={{
                        id: 'otherInsurance',
                        name: 'otherInsurance',
                        initialValue: { otherInsuranceValue },
                        onChange(newValue, allValues, formikSetFieldValueFn) {
                          setOtherInsuranceValue(newValue);
                        },
                        label: t('other insurance') as string,
                        type: DynamicComponentTypes.FORM_TEXT,
                        errorMsg: t('field required msj') as string,
                        dimensions: { xs: 12, sm: 12 },
                      }}
                      isCreating={isCreating}
                    />
                  </Grid>
                  <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                  >
                    <Typography sx={{ p: 4 }} display='block' variant='button' gutterBottom>
                      <Typography style={{ fontWeight: 'bold' }}>Reintegro:</Typography>
                      Paga la familia y la obra social reintegra.
                      <Typography style={{ fontWeight: 'bold' }}>Pago directo:</Typography>
                      La obra social paga directo a Enlite.
                    </Typography>
                  </Popover>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{
                      mb: 8,
                      width: '100%',
                      justifyContent: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant='subtitle1' sx={{ mb: 1 }}>
                      {capitalize(t('paymentMode') as string)}
                      <IconButton aria-haspopup='true' size='small' sx={{ color: 'inherit' }} onClick={handleClick}>
                        <Icon fontSize='1rem' icon='tabler:info-circle' />
                      </IconButton>
                    </Typography>
                    <RadioGroup
                      row
                      value={paymentMode}
                      sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                      onChange={(e) => setPaymentMode(e.target.value)}
                    >
                      <FormControlLabel value='refund' label={capitalize(t('refund'))} control={<Radio />} />
                      <FormControlLabel value='directly' label={capitalize(t('directly-pay'))} control={<Radio />} />
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <DynamicFormComponent
                      component={{
                        id: 'insuranceNumber',
                        name: 'insuranceNumber',
                        label: t('applicant insuranceNumber') as string,
                        type: DynamicComponentTypes.FORM_TEXT,
                        dimensions: { xs: 12, sm: 12 },
                        errorMsg: t('field required msj') as string,
                      }}
                      isCreating={isCreating}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box>
                <Grid container spacing={5} sx={{ mb: 4 }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{
                      mb: 8,
                      width: '100%',
                      justifyContent: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant='subtitle1' sx={{ mb: 2 }}>
                      {t('applicant cudCertificate') as string}
                    </Typography>
                    <RadioGroup
                      row
                      value={cudCertificate}
                      sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                      onChange={(e) => setcudCertificate(stringToBoolean(e.target.value))}
                    >
                      <FormControlLabel value={false} label={capitalize(t('yes'))} control={<Radio />} />
                      <FormControlLabel value={true} label={capitalize(t('no'))} control={<Radio />} />
                    </RadioGroup>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{
                      mb: 8,
                      width: '100%',
                      justifyContent: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant='subtitle1' sx={{ mb: 2 }}>
                      {capitalize(t('applicant amparoIndicator') as string)}
                    </Typography>
                    <RadioGroup
                      row
                      value={amparoIndicator}
                      sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                      onChange={(e) => setAmparoIndicator(stringToBoolean(e.target.value))}
                    >
                      <FormControlLabel value={false} label={capitalize(t('yes'))} control={<Radio />} />
                      <FormControlLabel value={true} label={capitalize(t('no'))} control={<Radio />} />
                    </RadioGroup>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{
                      mb: 8,
                      width: '100%',
                      justifyContent: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant='subtitle1' sx={{ mb: 2 }}>
                      {t('applicant ivaCondition') as string}
                    </Typography>
                    <RadioGroup
                      row
                      value={ivaCondition}
                      sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                      onChange={(e) => setIvaCondition(e.target.value)}
                    >
                      <FormControlLabel value='10-5' label='10,5%' control={<Radio />} />
                      <FormControlLabel value='21' label='21%' control={<Radio />} />
                      <FormControlLabel value='free-iva' label={capitalize(t('free-iva'))} control={<Radio />} />
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <DynamicFormComponent
                      component={{
                        id: 'paymentDocsEnlite',
                        name: 'paymentDocsEnlite',
                        label: t('paymentDocsEnlite') as string,
                        type: DynamicComponentTypes.FORM_TEXT,
                        dimensions: { xs: 12, sm: 12 },
                      }}
                      isCreating={isCreating}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Grid container spacing={5}>
                <Grid item xs={12} sx={{ pt: (theme) => `${theme.spacing(6)} !important` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button color='secondary' variant='tonal' onClick={handlePrev} sx={{ '& svg': { mr: 2 } }}>
                      <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
                      {capitalize(t('previous') as string)}
                    </Button>
                    <Button color='success' variant='contained' type='submit'>
                      {capitalize(t('submit') as string)}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default StepPayDetailsForm;
