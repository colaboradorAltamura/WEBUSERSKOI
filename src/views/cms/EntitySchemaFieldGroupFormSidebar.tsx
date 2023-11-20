// ** React Imports
import { Fragment, useEffect, useState } from 'react';

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// formik components
import { Form, Formik } from 'formik';

import { capitalize, getErrorData } from 'src/@core/coreHelper';

import Alert from '@mui/material/Alert';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Types Imports
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Loader from 'src/@core/components/loader';
import { DynamicComponentTypes, IDynamicComponent, IDynamicFormComponent } from 'src/types/dynamics';
import { IEntitySchemaFieldGroup } from 'src/types/entities';
import DynamicComponent from '../components/dynamics/DynamicComponent';
import { processConditionalRender } from '../components/dynamics/helpers';

interface PropsType {
  open: boolean;
  toggle: () => void;
  onSubmit: (formData: any, isCreating: boolean) => Promise<any>;

  entitySchemaFieldGroupToEdit?: IEntitySchemaFieldGroup | null;
  currentFieldGroupsLen: number;
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between',
}));

const EntitySchemaFieldGroupFormSidebar = ({
  open,
  toggle,
  onSubmit,

  entitySchemaFieldGroupToEdit,
  currentFieldGroupsLen,
}: PropsType) => {
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [sidebarTitle, setSidebarTitle] = useState<string | undefined>('');

  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [components, setComponents] = useState<IDynamicComponent[]>([]);

  const [initialValues, setInitialValues] = useState<any>(null);

  const [submitError, setSubmitError] = useState<any>(null);

  // const [activeStep, setActiveStep] = useState<FormStepType>(allSteps[activeStepIndex]);

  useEffect(() => {
    setSubmitError(null);
    if (entitySchemaFieldGroupToEdit) {
      setSidebarTitle('Edit Field Group');

      setIsCreating(false);
    } else {
      setSidebarTitle('Create Field Group');
      setIsCreating(true);
    }

    const compsAux: IDynamicComponent[] | IDynamicFormComponent[] = [];

    // ** Title
    compsAux.push({
      id: '',
      name: 'title',
      label: 'Title',
      type: DynamicComponentTypes.FORM_TEXT,
      dimensions: { xs: 12, sm: 12 },

      validation: { isRequired: true },

      placeholder: 'eg: title',
    } as IDynamicFormComponent);

    // ** Sub Title
    compsAux.push({
      id: '',
      name: 'subTitle',
      label: 'Sub Title',
      type: DynamicComponentTypes.FORM_TEXT,
      dimensions: { xs: 12, sm: 12 },

      validation: { isRequired: false },

      placeholder: '',
    } as IDynamicFormComponent);

    // ** Icon
    compsAux.push({
      id: '',
      name: 'icon',
      label: 'Icon',
      type: DynamicComponentTypes.FORM_TEXT,
      dimensions: { xs: 12, sm: 12 },

      validation: { isRequired: false },

      placeholder: '',
    } as IDynamicFormComponent);

    // ** Order
    compsAux.push({
      id: '',
      name: 'order',
      label: 'Order',
      type: DynamicComponentTypes.FORM_NUMBER,
      dimensions: { xs: 12, sm: 12 },

      validation: { isRequired: true },

      initialValue: currentFieldGroupsLen + 1,

      tooltip: '',
      placeholder: 'eg: 1',
    } as IDynamicFormComponent);

    setComponents(compsAux);

    updateInitialValues(compsAux, entitySchemaFieldGroupToEdit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entitySchemaFieldGroupToEdit]);

  const handleClose = () => {
    toggle();
  };

  const handleBack = () => {
    setActiveStepIndex((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    setActiveStepIndex((prevActiveStep) => prevActiveStep + 1);
  };

  // const isLastStep = activeStepIndex === allSteps.length - 1;
  // const isFirstStep = activeStepIndex === 0;
  const isLastStep = true;
  const isFirstStep = true;

  if (loadingSubmit) return <Loader />;

  const updateInitialValues = (
    components: IDynamicComponent[],
    entitySchemaFieldInitialValues?: IEntitySchemaFieldGroup | null
  ) => {
    const mixedInitialValues: any = entitySchemaFieldInitialValues ? { ...entitySchemaFieldInitialValues } : {};
    components.forEach((component) => {
      const formComp = component as IDynamicFormComponent;

      if (mixedInitialValues[component.name]) return;

      if (formComp.initialValue) {
        mixedInitialValues[component.name] = formComp.initialValue;
      } else {
        if (component.type === DynamicComponentTypes.FORM_BOOLEAN) mixedInitialValues[component.name] = false;
        else mixedInitialValues[component.name] = '';
      }
    });

    setInitialValues(mixedInitialValues);
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

      await onSubmit(itemValues, isCreating);

      actions.setSubmitting(false);

      // actions.resetForm();
    } catch (e) {
      setSubmitError(e);
      actions.setSubmitting(false);

      // handleError(e);
    }
  };

  const renderedNewValues = (values: any) => {
    return null;
  };

  return (
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
              backgroundColor: (theme) => `rgba(${theme.palette.customColors.main}, 0.16)`,
            },
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: (theme) => theme.spacing(0, 6, 6) }}>
        {open && (
          <>
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              validationSchema={null}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, isSubmitting }) => (
                <Form id={'entitySchemaFieldGroup'} autoComplete='off'>
                  {renderedNewValues(values)}
                  <Grid container spacing={5}>
                    {!!submitError && (
                      <Grid item xs={12}>
                        <Alert severity='error'>{getErrorData(submitError).message}</Alert>
                      </Grid>
                    )}
                    {/* <Grid item xs={12}>
                      <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Entity Field
                      </Typography>
                    </Grid> */}
                    {/* {getStepContent(activeStep)} */}

                    <Fragment key={'step' + activeStepIndex}>
                      {processConditionalRender(components, values).map((component, index) => {
                        if ((component.hidden?.create && isCreating) || (component.hidden?.edit && !isCreating))
                          return null;

                        let xs = 12;
                        let sm = 6;

                        if (component.dimensions && component.dimensions.xs) xs = component.dimensions.xs;
                        if (component.dimensions && component.dimensions.sm) sm = component.dimensions.sm;

                        return (
                          <Grid key={index} item xs={xs} sm={sm}>
                            {/* <DynamicFormComponent component={component} /> */}
                            <DynamicComponent component={component} isCreating={isCreating} />
                          </Grid>
                        );
                      })}
                    </Fragment>

                    <Grid
                      item
                      xs={12}
                      sx={{ display: 'flex', justifyContent: isFirstStep ? 'right' : 'space-between' }}
                    >
                      {!isFirstStep && (
                        <Button variant='tonal' color='secondary' disabled={activeStepIndex === 0} onClick={handleBack}>
                          Back
                        </Button>
                      )}

                      {isLastStep && (
                        <Button variant='contained' type={'submit'} disabled={isSubmitting}>
                          Submit
                        </Button>
                      )}

                      {!isLastStep && (
                        <Button variant='contained' type={'button'} onClick={handleNext} disabled={isSubmitting}>
                          Next
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default EntitySchemaFieldGroupFormSidebar;
