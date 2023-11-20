// formik components
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import CustomTextField from 'src/@core/components/mui/text-field';
import { IDynamicFormComponent } from 'src/types/dynamics';
import React, { useRef, useState } from 'react';
import CleavePhoneNumberTextField from './CleavePhoneNumberTextField';
import Icon from 'src/@core/components/icon';
import OptionsMenuCustom from 'src/@core/components/custom-option-menu';

interface PropsType {
  component: IDynamicFormComponent;
  isCreating?: boolean;
}

const countries = [
  {
    code: 'AR',
    prefix: '+54',
    img: 'https://flagicons.lipis.dev/flags/4x3/ar.svg',
    text: 'Argentina',
  },
  {
    code: 'BR',
    prefix: '+55',
    img: 'https://flagicons.lipis.dev/flags/4x3/br.svg',
    text: 'Brasil',
  },
];

const getPrefix = (phoneNumber: string) => phoneNumber?.split(' ')[0];

const getCountry = (prefix: string) => {
  return prefix ? countries.find((country) => country.prefix === prefix) : countries[0];
};

const DynamicFormComponentPhoneInput = ({ component, isCreating, ...rest }: PropsType) => {
  // ** HOOKS
  const { t } = useTranslation();

  const { values, setFieldValue, errors, touched, handleBlur } = useFormikContext();

  const theValues = values as any;
  const theErrors = errors as any;
  const theTouched = touched as any;

  const formComponent = component as IDynamicFormComponent;
  const isError = theErrors && theErrors[component.name] && theTouched && theTouched[component.name];
  const countryPrefixFromValue = getPrefix(theValues[component.name]);
  const countryFromValue = getCountry(countryPrefixFromValue);
  const [countrySelected, setCountrySelected] = useState<any>(countryFromValue || countries[0]);
  const ref = useRef();

  // Cleave's key to force it to re-init with new options when changing the country selector: https://github.com/nosir/cleave.js/issues/197
  const [cleaveKey, setCleaveKey] = useState(1);

  if (!values) return null;

  const handleOnChangeCountry = (index: number) => {
    const selectedCountry = countries[index];
    setCountrySelected(selectedCountry);
    setFieldValue(component.name, selectedCountry.prefix, true);
    setCleaveKey(cleaveKey + 1);
  };

  const CommonCustomTextField = (props: any) => {
    return (
      <CustomTextField
        inputRef={ref}
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

  return CommonCustomTextField({
    name: component.name,
    type: 'text',
    InputProps: {
      inputComponent: CleavePhoneNumberTextField,
      startAdornment: (
        <OptionsMenuCustom
          label={''}
          imagen={countrySelected.img}
          iconButtonProps={{
            color: 'inherit',
            sx: {
              '& .MuiButtonBase-root.MuiIconButton-root': { mr: 3 },
              '& .MuiTypography-root.MuiTypography-body1': { mt: 0, ml: 0 },
            },
          }}
          icon={<Icon icon='tabler:select' />}
          menuProps={{
            sx: {
              '& .MuiMenu-paper': { mt: 4.25, minWidth: 130 },
            },
          }}
          options={countries.map((country, index) => {
            return {
              text: country.text,
              menuItemProps: {
                selected: countrySelected.prefix == country.prefix,
                onClick: () => {
                  handleOnChangeCountry(index);
                },
              },
            };
          })}
        />
      ),
    },
    inputProps: {
      country: countrySelected,
      cleaveKey: cleaveKey,
      ref: ref,
    },
  });
};

export default DynamicFormComponentPhoneInput;
