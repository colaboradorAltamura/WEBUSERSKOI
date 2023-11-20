// formik components

import CustomTextField from 'src/@core/components/mui/text-field';
import { IDynamicFormComponent, DynamicComponentTypes, IDynamicFormSelectComponent } from 'src/types/dynamics';
import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { useDynamics } from 'src/hooks/useDynamics';
import { Checkbox, ListItemText } from '@mui/material';
import Loader from 'src/@core/components/loader';
import { useTranslation } from 'react-i18next';

interface PropsType {
  component: IDynamicFormComponent;
  isCreating?: boolean;
}

const DynamicFormComponentSelect = ({ component, isCreating, ...rest }: PropsType) => {
  // ** Hooks
  const dynamics = useDynamics();
  const { t } = useTranslation();
  const { values, setFieldValue, errors } = useFormikContext();

  // ** State
  const [options, setOptions] = useState<{ label: string; value: string; raw: any }[]>([]);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(true);

  const selectComponent = component as IDynamicFormSelectComponent;

  // ** Effects
  useEffect(() => {
    setLoadingOptions(true);

    if (selectComponent.dataSource.contextVariableName) {
      const optionsResult = dynamics.variables.find((variable) => {
        return variable.name === selectComponent.dataSource.contextVariableName;
      });

      if (optionsResult) {
        setOptions(optionsResult.value);
      } else {
        setOptions([]);
      }
    } else {
      setOptions(selectComponent.dataSource.fixedOptions);
    }
    setLoadingOptions(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamics.variables, component]);

  const theValues = values as any;
  const theErrors = errors as any;

  const formComponent = component as IDynamicFormComponent;
  const isError = theErrors && theErrors[component.name] ? true : false;

  if (loadingOptions) return <Loader />;

  if (!values) return null;

  if (component.type === DynamicComponentTypes.FORM_SELECT) {
    return (
      <CustomTextField
        required={formComponent.validation?.isRequired}
        select
        fullWidth
        label={t(component.label ? component.label : '')}
        id={component.id}
        name={component.name}
        placeholder={component.placeholder}
        error={isError}
        helperText={isError ? component.errorMsg : component.tooltip}
        value={theValues[component.name]}
        onChange={(event) => {
          setFieldValue(component.name, event.target.value, true);

          if (selectComponent.onChange) {
            const option = options.find((op) => {
              return op.value === event.target.value;
            });

            const optionValue = option ? option.raw : null;

            selectComponent.onChange(optionValue, values, setFieldValue);
          }
        }}
        disabled={(component.readOnly?.create && isCreating) || (component.readOnly?.edit && !isCreating)}
      >
        {!!options &&
          options.map((op, index) => {
            return (
              <MenuItem key={index} value={op.value}>
                {/* <em>None</em> */}
                {t(op.label)}
              </MenuItem>
            );
          })}
      </CustomTextField>
    );
  }

  if (component.type === DynamicComponentTypes.FORM_MULTI_SELECT) {
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

    return (
      <CustomTextField
        disabled={(component.readOnly?.create && isCreating) || (component.readOnly?.edit && !isCreating)}
        required={formComponent.validation?.isRequired}
        select
        fullWidth
        label={t(component.label ? component.label : '')}
        id={component.id}
        SelectProps={{
          MenuProps,
          multiple: true,
          value: theValues[component.name],
          error: isError,

          onChange: (event) => {
            setFieldValue(component.name, event.target.value, true);

            if (selectComponent.onChange) {
              const option = options.find((op) => {
                return op.value === event.target.value;
              });

              const optionValue = option ? option.raw : null;

              selectComponent.onChange(optionValue, values, setFieldValue);
            }
          },
          renderValue: (selected) => (selected as unknown as string[]).join(', '),
        }}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.label}>
            <Checkbox checked={theValues[component.name].indexOf(option.value) > -1} />
            <ListItemText primary={index} />
          </MenuItem>
        ))}
      </CustomTextField>
    );
  }

  return null;
};

export default DynamicFormComponentSelect;
