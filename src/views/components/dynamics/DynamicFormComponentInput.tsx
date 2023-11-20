// formik components
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import CustomTextField from 'src/@core/components/mui/text-field';
import { DynamicComponentTypes, IDynamicFormComponent } from 'src/types/dynamics';
import { lazy } from 'react';
import DynamicFormComponentInputEditor from './DynamicFormComponentInputEditor';

const Cleave = lazy(() => import('cleave.js/react'));

interface PropsType {
  component: IDynamicFormComponent;
  isCreating?: boolean;
}

const DynamicFormComponentInput = ({ component, isCreating, ...rest }: PropsType) => {
  // ** HOOKS
  const { t } = useTranslation();

  const { values, setFieldValue, errors, touched, handleBlur } = useFormikContext();

  const theValues = values as any;
  const theErrors = errors as any;
  const theTouched = touched as any;

  const formComponent = component as IDynamicFormComponent;
  const isError = theErrors && theErrors[component.name] && theTouched && theTouched[component.name];

  if (!values) return null;

  const CommonCustomTextField = (props: any) => {
    return (
      <CustomTextField
        className='custom-label'
        required={formComponent.validation?.isRequired}
        fullWidth
        label={t(component.label ? component.label : '')}
        placeholder={component.placeholder}
        error={isError}
        helperText={isError ? component.errorMsg : component.tooltip}
        value={theValues[component.name]}
        onChange={(event) => {
          setFieldValue(component.name, event.target.value, true);
          if (formComponent.onChange) formComponent.onChange(event.target.value, theValues, setFieldValue);
        }}
        onBlur={handleBlur}
        disabled={(component.readOnly?.create && isCreating) || (component.readOnly?.edit && !isCreating)}
        {...props}
        {...rest}
      />
    );
  };

  if (component.type === DynamicComponentTypes.FORM_TEXT) {
    if (component.customMask) {
      try {
        const options = JSON.parse(component.customMask);

        return CommonCustomTextField({
          name: component.name,
          type: 'text',
          InputProps: {
            inputComponent: Cleave,
          },
          inputProps: {
            options,
          },
        });
      } catch (e) {
        console.error(e);

        return <>Invalid custom mask: "{component.customMask}"</>;
      }
    } else if (formComponent.enableTextArea) {
      return CommonCustomTextField({
        name: component.name,
        type: 'text',
        multiline: true,
        rows: component.textAreaRows,
      });
    } else if (formComponent.enableHtmlEditor) {
      return <DynamicFormComponentInputEditor component={component} isCreating={isCreating} {...rest} />;
    } else return CommonCustomTextField({ name: component.name, type: 'text' });
  }
  if (component.type === DynamicComponentTypes.FORM_EMAIL) return CommonCustomTextField({ type: 'email' });

  if (component.type === DynamicComponentTypes.FORM_NUMBER) return CommonCustomTextField({ type: 'number' });

  return null;
};

export default DynamicFormComponentInput;
