// formik components
import { Form, Formik } from 'formik';

import { useEffect, useState } from 'react';
import Loader from 'src/@core/components/loader';
import { handleError } from 'src/@core/coreHelper';
import { useDynamics } from 'src/hooks/useDynamics';
import { dynamicGet } from 'src/services/entitiesDynamicServices';
import {
  DynamicComponentTypes,
  FormStepType,
  IDynamicComponent,
  IDynamicFormComponent,
  IDynamicInlineComponent,
  IForm,
} from 'src/types/dynamics';

import * as Yup from 'yup';
import DynamicFormSteps from './DynamicFormSteps';
import { invokeEvent, processPreSubmitValues } from './helpers';
import mergeSchemas from './helpers/mergeSchemas';
import _ from 'lodash';

interface PropsType {
  formId?: string;
  preloadForm?: IForm | null;

  isCreating?: boolean;
  initialValues?: any;
  onFormFetched?: (form: IForm) => Promise<any>;
  onSubmit?: (formData: any, isCreating: boolean) => Promise<any>;
  onSubmitDone?: (formData: any, isCreating: boolean) => Promise<any>;

  onCancel: () => void;
  inlineComponents?: IDynamicInlineComponent[];
}

const DynamicForm = ({
  formId,
  preloadForm,
  isCreating,
  initialValues,
  onFormFetched,
  onSubmit,
  onSubmitDone,
  onCancel,
  inlineComponents,
}: PropsType) => {
  // ** State
  const [form, setForm] = useState<IForm | null>(null);
  const [currentFormikValidations, setCurrentFormikValidations] = useState<any>(null);

  const [currentFormInitialValues, setCurrentFormInitialValues] = useState<any>(null);

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<FormStepType | null>();

  // ** Hooks
  const dynamics = useDynamics();

  const updateInitialValues = (theForm: IForm) => {
    const allComponents: IDynamicFormComponent[] = [];

    theForm.steps.forEach((step) => {
      step.components.forEach((component) => {
        allComponents.push(component as IDynamicFormComponent);

        // TODO recursivo
        component.components?.forEach((innerComponent) => {
          allComponents.push(component as IDynamicFormComponent);
        });
      });
    });

    const mixedInitialValues: any = {};
    allComponents.forEach((component) => {
      if (component.initialValue) {
        mixedInitialValues[component.name] = component.initialValue;
      } else {
        if (component.type === DynamicComponentTypes.FORM_BOOLEAN) mixedInitialValues[component.name] = false;
        else if (component.type === DynamicComponentTypes.FORM_MULTI_SELECT_ASYNC)
          mixedInitialValues[component.name] = [];
        else if (component.type === DynamicComponentTypes.ADDRESS) mixedInitialValues[component.name] = null;
        else if (
          component.type === DynamicComponentTypes.FORM_MULTI_SELECT ||
          component.type === DynamicComponentTypes.FORM_COUNTRY_PICKER_CONSTRAINTS
        )
          mixedInitialValues[component.name] = [];
        else mixedInitialValues[component.name] = '';
      }
    });

    setCurrentFormInitialValues({ ...mixedInitialValues, ..._.cloneDeep(initialValues) });
  };

  // ** Effects
  useEffect(() => {
    const doAsync = async () => {
      try {
        let theForm = preloadForm;

        if (!theForm) {
          const response = await dynamicGet({ params: '/appCreator/forms/' + formId });

          if (!response) throw new Error('No form with id: ' + formId);

          theForm = response as IForm;
        }

        if (onFormFetched) onFormFetched(theForm);

        setForm(theForm);

        updateInitialValues(theForm);
      } catch (e: any) {
        handleError(e);
      }
    };

    doAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  useEffect(() => {
    setActiveStep(form?.steps[activeStepIndex]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStepIndex, form]);

  const onStepComponentsChange = (currentStepComponents: IDynamicFormComponent[] | IDynamicComponent[] | null) => {
    if (!currentStepComponents) {
      setCurrentFormikValidations(null);
    }

    const validationSchemas: any[] = [];

    currentStepComponents
      ?.filter((component) => {
        return !component.hidden || (!component.hidden.create && isCreating) || (!component.hidden.edit && !isCreating);
      })
      .forEach((component) => {
        if (component.type === DynamicComponentTypes.FORM_TEXT) {
          const formComponent = component as IDynamicFormComponent;

          if (formComponent.validation?.isRequired) {
            validationSchemas.push(Yup.object().shape({ [component.name]: Yup.string().required('Error') }));
          }
        } else if (component.type === DynamicComponentTypes.FORM_EMAIL) {
          const formComponent = component as IDynamicFormComponent;

          if (formComponent.validation?.isRequired) {
            validationSchemas.push(Yup.object().shape({ [component.name]: Yup.string().email().required('Error') }));
          }
        }
      });

    const newSchemas = mergeSchemas(...validationSchemas);

    setCurrentFormikValidations(
      newSchemas
      // Yup.object().shape({
      //   patientFullName: Yup.string().email().required(),
      // })
    );
  };

  const handleBack = () => {
    setActiveStepIndex((prevActiveStep) => prevActiveStep - 1);
  };

  const isLastStep = form && activeStepIndex === form.steps.length - 1 ? true : false;
  const isFirstStep = activeStepIndex === 0;

  const handleSubmit = async (values: any, actions: any) => {
    try {
      if (!isLastStep) {
        setActiveStepIndex((prevActiveStep) => prevActiveStep + 1);

        return;
      }

      actions.setSubmitting(true);

      // clono para no modificar el original del form
      const itemValues = processPreSubmitValues(_.cloneDeep(values));

      if (onSubmit) {
        await onSubmit(itemValues, isCreating ? isCreating : false);
      } else {
        // const promises: Promise<any>[] = [];

        // TODO banco hasta 4 como work around pq no gusta como queda la promise sin ejecutar
        if (!form) throw new Error('no form');

        if (form.submitEvents.length >= 1)
          await invokeEvent(
            dynamics,
            form.preDefinedEvents,
            form.submitEvents[0].name,
            itemValues,

            !!isCreating
          );

        if (form.submitEvents.length >= 2)
          await invokeEvent(
            dynamics,
            form.preDefinedEvents,
            form.submitEvents[1].name,
            itemValues,

            !!isCreating
          );

        if (form.submitEvents.length >= 3)
          await invokeEvent(
            dynamics,

            form.preDefinedEvents,
            form.submitEvents[2].name,
            itemValues,

            !!isCreating
          );

        if (form.submitEvents.length >= 4)
          await invokeEvent(
            dynamics,
            form.preDefinedEvents,
            form.submitEvents[3].name,
            itemValues,

            !!isCreating
          );

        // form?.submitEvents.forEach((eventDefinition) => {
        //   console.log('Promise : ' + eventDefinition.name);

        //   promises.push();
        // });

        // TODO intentos fallidos
        // const promisesResults = await resolvePromisesSeq(promises);
        // const results = await Promise.all(promises.reverse());

        // results.find(() => {});
      }

      // itemValues = selectFormValuesHandler({ itemValues, form });
      // itemValues = translateFormValuesHandler({ itemValues, form });
      // itemValues = await dropZoneFormValuesHandler({ itemValues, form });

      // attachEvents: [{ name: 'submit' }, { name: 'onPatientRelativeSubmit' }], await onSubmit(itemValues);

      actions.setSubmitting(false);
      if (onSubmitDone) await onSubmitDone(itemValues, isCreating ? isCreating : false);

      // actions.resetForm();
    } catch (e) {
      actions.setSubmitting(false);
      handleError(e);
    }
  };

  if (!form || !currentFormInitialValues) return <Loader />;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={currentFormInitialValues}
      validationSchema={currentFormikValidations}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, isSubmitting }) => (
        <Form id={formId ? formId : ''} autoComplete='off'>
          <DynamicFormSteps
            form={form}
            allSteps={form.steps}
            onStepComponentsChange={onStepComponentsChange}
            values={values}
            errors={errors}
            touched={touched}
            isSubmitting={isSubmitting}
            inlineComponents={inlineComponents}
            isCreating={isCreating}
            onBack={handleBack}
            activeStep={activeStep}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            activeStepIndex={activeStepIndex}
          />
        </Form>
      )}
    </Formik>
  );
};

export default DynamicForm;
