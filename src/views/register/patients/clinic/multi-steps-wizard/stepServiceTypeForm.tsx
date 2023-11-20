// ** React Imports
import { ChangeEvent, useEffect, useState } from 'react';

// ** MUI Components
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field';

// ** Icon Imports
import Icon from 'src/@core/components/icon';
import {
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  capitalize,
} from '@mui/material';
import FormLocationField from 'src/@core/components/form/FormLocationField';
import { enliteDocumentsTypes } from 'src/types/applicants/enliteDocumentsTypes';
import { documentsTypes } from 'src/types/applicants/documentsTypes';
import { useApplicantsOnboarding } from 'src/hooks/useApplicantsOnboarding';
import { Form, Formik } from 'formik';

import * as Yup from 'yup';
import DynamicFormComponent from 'src/views/components/dynamics/DynamicFormComponent';
import { DynamicComponentTypes } from 'src/types/dynamics';
import { useTranslation } from 'react-i18next';

interface State {
  showPassword: boolean;
  showConfirmPassword: boolean;
}
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
const STEP_VALIDATIONS_INITIAL = Yup.object().shape({});

const StepServiceTypeForm = ({ handleNext, handlePrev }: { [key: string]: () => void }) => {
  const win: any = window;
  // ** Hooks
  const onboarding = useApplicantsOnboarding();
  const { t } = useTranslation();

  const initialValues = onboarding.onboardingData;
  // ** States
  const [documents, setDocuments] = useState<string[]>([]);
  const [enliteDocuments, setEnliteDocuments] = useState<string[]>([]);
  const [schoolAccompanimentDisplay, setSchoolAccompanimentDisplay] = useState<string>(
    initialValues.schoolAccompaniment ? 'inline' : 'none'
  );
  const [schoolAccompaniment, setSchoolAccompaniment] = useState<boolean>(initialValues.schoolAccompaniment);

  const [map, setMap] = useState<any>(null);
  const [addressPlace, setAddressPlace] = useState<any>('');
  const [submitError, setSubmitError] = useState<any>(null);
  const [isCreating, setIsCreating] = useState<boolean>(true);
  const [STEP_VALIDATIONS, setStepValidations] = useState<any>(STEP_VALIDATIONS_INITIAL);

  useEffect(() => {
    if (!map || !addressPlace) return;

    const bounds = new win.google.maps.LatLngBounds();

    const image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

    const marker = new win.google.maps.Marker({
      position: addressPlace.addressObject.geometry.location,
      draggable: false,
      id: 1, //to do check on this
      map: map,
      icon: image,
    });

    bounds.extend(addressPlace.addressObject.geometry.location);

    map.fitBounds(bounds);

    map.setZoom(Math.min(map.getZoom(), 12));
  }, [addressPlace, map]);

  useEffect(() => {
    if (!win.google) return;

    const mapAux = new win.google.maps.Map(document.getElementById('map-canvas'), {
      center: {
        lat: -34.603008, //lat and long Buenos Aires
        lng: -58.3794688,
      },
      zoom: 12,
    });

    setMap(mapAux);
  }, [win.google]);

  const handleSubmit = async (values: any, actions: any) => {
    try {
      setSubmitError(null);
      actions.setSubmitting(true);
      // clono para no modificar el original del form
      const itemValues = { ...values };

      console.log(itemValues);
      const keys = Object.keys(itemValues);
      console.log(keys);

      keys.forEach((key) => {
        const itemValue = itemValues[key];

        if (!itemValue.isOptionField) return;

        // es un select async
        itemValues[key] = itemValue.value;
      });

      // itemValues['applicantAddress'] = addressPlace.addressString ? addressPlace.addressString : ''; //because it will be undefined
      itemValues['applicantAddress'] = addressPlace;
      itemValues['schoolAccompaniment'] = schoolAccompaniment;
      itemValues['schoolDocsfromEnlite'] = enliteDocuments ? enliteDocuments.join(', ') : '';
      itemValues['schoolDocs'] = documents ? documents.join(', ') : '';

      onboarding.saveOnboardingData(itemValues);

      handleNext();

      actions.setSubmitting(false);

      // actions.resetForm();
    } catch (e) {
      setSubmitError(e);
      actions.setSubmitting(false);

      // handleError(e);
    }
  };

  const handleChangeSchoolAccompaniment = (event: ChangeEvent<HTMLInputElement>) => {
    const val = (event.target as HTMLInputElement).value;
    if (val === 'true') {
      setSchoolAccompaniment(true);
      setSchoolAccompanimentDisplay('inline');
    } else {
      setSchoolAccompaniment(false);
      setSchoolAccompanimentDisplay('none');
    }
  };

  const handleChangeDocs = (event: SelectChangeEvent<unknown>) => {
    setDocuments(event.target.value as string[]);
  };
  const handleChangeRiatDocs = (event: SelectChangeEvent<unknown>) => {
    setEnliteDocuments(event.target.value as string[]);
  };

  const onPlaceSelected = (place: any) => {
    setAddressPlace(place);
  };

  const renderRiatDocsChangeOptions = () => {
    const options: any[] = [
      {
        label: enliteDocumentsTypes.PLAN_TRABAJO,
        value: enliteDocumentsTypes.PLAN_TRABAJO,
        checked: documents.includes(enliteDocumentsTypes.PLAN_TRABAJO),
      },
      {
        label: enliteDocumentsTypes.PRESUPUESTO,
        value: enliteDocumentsTypes.PRESUPUESTO,
        checked: documents.includes(enliteDocumentsTypes.PRESUPUESTO),
      },
      {
        label: enliteDocumentsTypes.HABILITACION,
        value: enliteDocumentsTypes.HABILITACION,
        checked: documents.includes(enliteDocumentsTypes.HABILITACION),
      },
      {
        label: enliteDocumentsTypes.DOCUMENTACION_SUPERVISOR,
        value: enliteDocumentsTypes.DOCUMENTACION_SUPERVISOR,
        checked: documents.includes(enliteDocumentsTypes.DOCUMENTACION_SUPERVISOR),
      },
      {
        label: enliteDocumentsTypes.CARTA_PRESENTACION,
        value: enliteDocumentsTypes.CARTA_PRESENTACION,
        checked: documents.includes(enliteDocumentsTypes.CARTA_PRESENTACION),
      },
      {
        label: enliteDocumentsTypes.CONSTANCIA_AFIP,
        value: enliteDocumentsTypes.CONSTANCIA_AFIP,
        checked: documents.includes(enliteDocumentsTypes.CONSTANCIA_AFIP),
      },
      {
        label: enliteDocumentsTypes.OTHER,
        value: enliteDocumentsTypes.OTHER,
        checked: documents.includes(enliteDocumentsTypes.OTHER),
      },
    ];

    return options.map((op, key) => {
      return (
        <MenuItem value={op.value} key={key}>
          <Checkbox checked={op.checked} />
          <ListItemText primary={op.label} />
        </MenuItem>
      );
    });
  };

  const renderDocsChangeOptions = () => {
    const options: any[] = [
      {
        label: documentsTypes.ANTECEDENTES_PENALES,
        value: documentsTypes.ANTECEDENTES_PENALES,
        checked: documents.includes(documentsTypes.ANTECEDENTES_PENALES),
      },
      {
        label: documentsTypes.DNI,
        value: documentsTypes.DNI,
        checked: documents.includes(documentsTypes.DNI),
      },
      {
        label: documentsTypes.SEGURO_ACCIDENTES,
        value: documentsTypes.SEGURO_ACCIDENTES,
        checked: documents.includes(documentsTypes.SEGURO_ACCIDENTES),
      },
      {
        label: documentsTypes.SEGURO_RESPOSABILIDAD_CIVIL,
        value: documentsTypes.SEGURO_RESPOSABILIDAD_CIVIL,
        checked: documents.includes(documentsTypes.SEGURO_RESPOSABILIDAD_CIVIL),
      },
      {
        label: documentsTypes.APTO_FISICO,
        value: documentsTypes.APTO_FISICO,
        checked: documents.includes(documentsTypes.APTO_FISICO),
      },
      {
        label: documentsTypes.TITULO_HABITANTE,
        value: documentsTypes.TITULO_HABITANTE,
        checked: documents.includes(documentsTypes.TITULO_HABITANTE),
      },
      {
        label: documentsTypes.CONSTANCIA_AFIP,
        value: documentsTypes.CONSTANCIA_AFIP,
        checked: documents.includes(documentsTypes.CONSTANCIA_AFIP),
      },
      {
        label: documentsTypes.OTHER,
        value: documentsTypes.OTHER,
        checked: documents.includes(documentsTypes.OTHER),
      },
    ];

    return options.map((op, key) => {
      return (
        <MenuItem value={op.value} key={key}>
          <Checkbox checked={op.checked} />
          <ListItemText primary={op.label} />
        </MenuItem>
      );
    });
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
          <Form id={'stepServiceTypeForm'} autoComplete='off'>
            <Box sx={{ mb: 4 }}>
              <Typography variant='h5'>{t('applicantsAddress') as string}</Typography>
            </Box>

            <Grid container spacing={5} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={12}>
                <FormLocationField
                  label={''}
                  value={addressPlace ? addressPlace.addressString : ''}
                  placeholder={'Av libertador 123'}
                  onPlaceSelected={(place: any) => {
                    onPlaceSelected(place);
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <Divider sx={{ m: '0 !important' }} />
                  <div id='map-canvas' style={{ height: 200 }} />
                </Card>

                <Divider sx={{ m: '0 !important' }} />
              </Grid>
            </Grid>

            <Box sx={{ mb: 4, mt: 15 }}>
              <Typography variant='h5'>{capitalize(t('schoolAccompaniment') as string)}</Typography>
            </Box>

            <Grid item xs={12} sm={12}>
              <RadioGroup
                row
                value={schoolAccompaniment}
                sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                onChange={(e) => handleChangeSchoolAccompaniment(e)}
              >
                <FormControlLabel value='false' label='No' control={<Radio />} />
                <FormControlLabel value='true' label='Si' control={<Radio />} />
              </RadioGroup>
            </Grid>

            <Box sx={{ display: schoolAccompanimentDisplay }}>
              <Grid container spacing={5} sx={{ mb: 4 }}>
                <Grid item xs={6} sm={6}>
                  <DynamicFormComponent
                    component={{
                      id: 'schoolName',
                      name: 'schoolName',
                      label: t('schoolName') as string,
                      type: DynamicComponentTypes.FORM_TEXT,
                      dimensions: { xs: 12, sm: 12 },
                    }}
                    isCreating={isCreating}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <DynamicFormComponent
                      component={{
                        id: 'schoolContact',
                        name: 'schoolContact',
                        label: t('schoolContact') as string,
                        type: DynamicComponentTypes.FORM_TEXT,
                        dimensions: { xs: 12, sm: 12 },
                      }}
                      isCreating={isCreating}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label={t('schoolDocs') as string}
                    id='select-multiple-checkbox-documents'
                    SelectProps={{
                      MenuProps,
                      multiple: true,
                      value: documents,
                      onChange: (e) => handleChangeDocs(e),
                      renderValue: (selected: any) => {
                        const newVal = [...selected] as string[];

                        return newVal
                          .map((item) => {
                            return item;
                          })
                          .join(', ');
                      },
                    }}
                  >
                    {renderDocsChangeOptions()}
                  </CustomTextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label={t('schoolDocsfromEnlite') as string}
                    id='select-multiple-checkbox-documentsRIAT'
                    SelectProps={{
                      MenuProps,
                      multiple: true,
                      value: enliteDocuments,
                      onChange: (e) => handleChangeRiatDocs(e),
                      renderValue: (selected: any) => {
                        const newVal = [...selected] as string[];

                        return newVal
                          .map((item) => {
                            return item;
                          })
                          .join(', ');
                      },
                    }}
                  >
                    {renderRiatDocsChangeOptions()}
                  </CustomTextField>
                </Grid>
              </Grid>
            </Box>

            <Grid item xs={12} sx={{ pt: (theme) => `${theme.spacing(6)} !important` }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button color='secondary' variant='tonal' onClick={handlePrev} sx={{ '& svg': { mr: 2 } }}>
                  <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
                  {capitalize(t('previous') as string)}
                </Button>
                <Button variant='contained' type='submit' sx={{ '& svg': { ml: 2 } }}>
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

export default StepServiceTypeForm;
