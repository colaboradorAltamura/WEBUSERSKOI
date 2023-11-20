import { Icon } from '@iconify/react';
import {
  Box,
  BoxProps,
  Button,
  Card,
  CardContent,
  Drawer,
  Grid,
  IconButton,
  MenuItem,
  Typography,
  styled,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import Loader from 'src/@core/components/loader';
import CustomTextField from 'src/@core/components/mui/text-field';
import { useDynamics } from 'src/hooks/useDynamics';
import { DynamicComponentTypes, IForm } from 'src/types/dynamics';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { dynamicGet } from 'src/services/entitiesDynamicServices';
import { CMSCollections, IPatientRelative } from 'src/types/@autogenerated';
import { nameof } from 'src/@core/coreHelper';
import { IUser } from 'src/types/users';

const STEP_VALIDATIONS = Yup.object().shape({
  // firstName: Yup.string().required('Field is required'),
  //lastName: Yup.string().required('Field is required'),
  //email: Yup.string().email().required('Field is required'),
});

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between',
}));

interface PropsType {
  docId: string;
  formId?: string;
  preloadForm?: IForm | null;
  open: boolean;
  toggle: () => void;
  onSubmit: (formData: any, isCreating: boolean) => Promise<any>;
  onSubmitDone?: (formData: any, isCreating: boolean) => Promise<any>;
  title?: string;
  initialValues: any;
  isCreating?: boolean;
}

const RELATIVE_TYPES = CMSCollections.RELATIVE_TYPES;

const RelativeForm = ({ docId, initialValues, open, title, toggle, onSubmit, isCreating }: PropsType) => {
  // **  HOOKS
  const { t } = useTranslation();
  const dynamics = useDynamics();

  // ** STATES
  const [sidebarTitle, setSidebarTitle] = useState<string | undefined>(title);
  const [relativeData, setRelativeData] = useState<any>(initialValues);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(true);

  // inputs
  const [errorFields, setErrorFields] = useState<any>({});
  const [firstName, setFirstName] = useState<string>(initialValues?.firstName ?? '');
  const [lastName, setLastName] = useState<string>(initialValues?.lastName ?? '');
  const [email, setEmail] = useState<string>(initialValues?.email ?? '');

  //options
  const [relationType, setRelationType] = useState<string>();
  const [businessTypeOptions, setRelationTypeOptions] = useState<any[]>([]);

  const getOptions = async (schema: string) => {
    try {
      const optionsData: any = await dynamicGet({ params: '/cms/' + schema });

      return optionsData.items;
    } catch (error) {
      return [];
    }
  };
  // ** Effects
  useEffect(() => {
    console.log();
    const doAsync = async () => {
      try {
        setLoadingOptions(true);
        setRelationTypeOptions(await getOptions(RELATIVE_TYPES));
        setLoadingOptions(false);
      } catch (error) {}
    };
    if (!relativeData) setRelativeData({ patientId: docId });

    doAsync();
    setRelationType(relativeData.relationshipType);
  }, []);

  const handleSubmit = async (values: any, action: any) => {
    try {
      const itemValues = { ...values };
      const keys = Object.keys(itemValues);

      keys.forEach((key) => {
        const itemValue = itemValues[key];
        if (!itemValue.isOptionField) return;

        itemValues[key] = itemValue.value;
      });

      itemValues[nameof<IPatientRelative>('relationshipType')] = relationType;
      itemValues[nameof<IPatientRelative>('patientId')] = docId;
      itemValues[nameof<IUser>('firstName')] = firstName;
      itemValues[nameof<IUser>('lastName')] = lastName;
      itemValues[nameof<IUser>('email')] = email;

      action.isCreating = isCreating;
      onSubmit(itemValues, action);
      toggle();
    } catch (e) {}
  };
  const handleClose = () => {
    toggle();
  };

  return (
    <>
      <Drawer
        open={open}
        anchor='right'
        variant='temporary'
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >
        <Header>
          <Typography variant='h5'>{sidebarTitle}</Typography>
          <IconButton
            size='small'
            onClick={handleClose}
            sx={{
              p: '0.438rem',
              borderRadius: 1,
              color: 'text.primary',
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: (theme) =>
                  `rgba(${theme.palette.customColors ? theme.palette.customColors.main : ''}, 0.16)`,
              },
            }}
          >
            <Icon icon='tabler:x' fontSize='1.125rem' />
          </IconButton>
        </Header>
        <Box sx={{ p: (theme) => theme.spacing(0, 6, 6) }}>
          {open && (
            <Formik
              enableReinitialize={true}
              initialValues={relativeData}
              validationSchema={STEP_VALIDATIONS}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, isSubmitting }) => (
                <Form id={'relativeForm'} autoComplete='off'>
                  <Card>
                    <CardContent sx={{ width: '100%' }}>
                      <Grid item xs={12} sm={12} sx={{ marginBottom: 5 }}>
                        {loadingOptions ? (
                          <Loader />
                        ) : (
                          <CustomTextField
                            select
                            fullWidth
                            label={t('relation') as string}
                            id='relationType'
                            value={relationType}
                            onChange={(e) => setRelationType(e.target.value)}
                          >
                            {businessTypeOptions.map((item: any, index: any) => {
                              return (
                                <MenuItem key={index} value={item.code}>
                                  {t(item.name)}
                                </MenuItem>
                              );
                            })}
                          </CustomTextField>
                        )}
                      </Grid>

                      <Grid item xs={12} sm={12} sx={{ marginBottom: 5 }}>
                        <CustomTextField
                          sx={{ mb: 4 }}
                          required={true}
                          fullWidth
                          name={'first Name'}
                          type='text'
                          label={t('first Name') as string}
                          error={errorFields['firstName']}
                          helperText={errorFields['firstName'] ? 'field required msj' : ''}
                          value={firstName}
                          onChange={(event) => {
                            setFirstName(event.target.value);
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={12} sx={{ marginBottom: 5 }}>
                        <CustomTextField
                          sx={{ mb: 4 }}
                          required={true}
                          fullWidth
                          name={'lastName'}
                          type='text'
                          label={t('last Name') as string}
                          error={errorFields['lastName']}
                          helperText={errorFields['lastName'] ? 'field required msj' : ''}
                          value={lastName}
                          onChange={(event) => {
                            setLastName(event.target.value);
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={12} sx={{ marginBottom: 5 }}>
                        <CustomTextField
                          sx={{ mb: 4 }}
                          required={true}
                          fullWidth
                          name={'email'}
                          type='text'
                          label={t('email') as string}
                          error={errorFields['email']}
                          helperText={errorFields['email'] ? 'field required msj' : ''}
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ pt: (theme) => `${theme.spacing(6)} !important` }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Button variant='contained' type={'submit'} disabled={isSubmitting}>
                            Submit
                          </Button>
                        </Box>
                      </Grid>
                    </CardContent>
                  </Card>
                </Form>
              )}
            </Formik>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default RelativeForm;