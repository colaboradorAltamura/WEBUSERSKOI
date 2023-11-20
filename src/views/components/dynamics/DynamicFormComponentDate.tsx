// formik components

import { useFormikContext } from 'formik';
import CustomTextField from 'src/@core/components/mui/text-field';
import { IDynamicFormComponent } from 'src/types/dynamics';

// ** MUI Imports
import Box from '@mui/material/Box';

// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';

// ** React Imports
import { forwardRef } from 'react';

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import { Typography } from '@mui/material';
import { toDateObject } from 'src/@core/coreHelper';
import { useTranslation } from 'react-i18next';

interface PropsType {
  component: IDynamicFormComponent;
  isCreating?: boolean;
  popperPlacement?: ReactDatePickerProps['popperPlacement'];
}

interface PickerProps {
  label?: string;
  readOnly?: boolean;
}

const PickersComponent = forwardRef(({ ...props }: PickerProps, ref) => {
  // ** Props
  const { label, readOnly } = props;
  const { t } = useTranslation();

  return (
    <CustomTextField
      fullWidth
      {...props}
      inputRef={ref}
      label={t(label as string) || ''}
      {...(readOnly && { inputProps: { readOnly: true } })}
    />
  );
});

const DynamicFormComponentDate = ({ component, isCreating, popperPlacement, ...rest }: PropsType) => {
  const { values, setFieldValue, errors, touched, handleBlur } = useFormikContext();

  //** HOOKS

  const { t } = useTranslation();

  // const [currentValue, setCurrentValue] = useState<any>(component.initialValue ? component.initialValue : '');

  const theValues = values as any;
  const theErrors = errors as any;
  const theTouched = touched as any;

  const formComponent = component as IDynamicFormComponent;
  const isError = theErrors && theErrors[component.name] && theTouched && theTouched[component.name] ? true : false;

  if (!values) return null;

  const dateValue = toDateObject(theValues[component.name]);

  let compProps = {};

  if (component.componentProps) compProps = JSON.parse(component.componentProps);

  return (
    <DatePickerWrapper>
      <DatePicker
        selected={dateValue}
        popperPlacement={popperPlacement}
        onChange={(date: Date) => {
          // setDate(date);

          setFieldValue(component.name, date, true);
          if (formComponent.onChange) formComponent.onChange(date, theValues, setFieldValue);
        }}
        placeholderText={component.placeholder}
        customInput={<PickersComponent label={component.label} />}
        dateFormat={'dd/MM/yyyy'}
        onBlur={handleBlur}
        showYearDropdown
        {...compProps}
        // error={isError}
        // helperText={isError ? component.errorMsg : component.tooltip}
        disabled={(component.readOnly?.create && isCreating) || (component.readOnly?.edit && !isCreating)}
      />
      {isError && <Typography sx={{ color: 'error.main' }}>{`${component.errorMsg}`}</Typography>}
    </DatePickerWrapper>
  );
};

export default DynamicFormComponentDate;
