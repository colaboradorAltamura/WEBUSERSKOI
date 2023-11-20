// formik components

import { useFormikContext } from 'formik';
import CustomTextField from 'src/@core/components/mui/text-field';
import { IDynamicComponent, DynamicComponentTypes, IDynamicFormComponent } from 'src/types/dynamics';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTranslation } from 'react-i18next';

interface PropsType {
  component: IDynamicFormComponent;
  isCreating?: boolean;
}

const DynamicFormComponentBoolean = ({ component, isCreating, ...rest }: PropsType) => {
  // ** HOOKS
  const { t } = useTranslation();
  const { values, setFieldValue, errors } = useFormikContext();

  // const [currentValue, setCurrentValue] = useState<any>(component.initialValue ? component.initialValue : '');

  const theValues = values as any;
  const theErrors = errors as any;

  const isError = theErrors && theErrors[component.name] ? true : false;

  if (!values) return null;

  return (
    <FormControlLabel
      label={t(component.label ? component.label : '')}
      control={
        <Checkbox
          name='basic-checked'
          checked={theValues[component.name]}
          onChange={(event) => {
            setFieldValue(component.name, event.target.checked, true);
          }}
          disabled={(component.readOnly?.create && isCreating) || (component.readOnly?.edit && !isCreating)}
        />
      }
    />
  );
};

export default DynamicFormComponentBoolean;
