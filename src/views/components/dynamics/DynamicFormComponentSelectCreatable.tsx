// ** React Imports
import { useCallback, useEffect, useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';

import { AutocompleteRenderOptionState } from '@mui/material/Autocomplete';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

// ** Third Party Imports

import debounce from 'debounce-promise';

// ** Types Imports
import { SearchEntitiesOptionType } from 'src/types';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Custom Component Import
import CustomAutocomplete from 'src/@core/components/mui/autocomplete';

// ** Configs Imports

import { useFormikContext } from 'formik';
import CustomTextField from 'src/@core/components/mui/text-field';
import { handleError } from 'src/@core/coreHelper';
import { useDynamics } from 'src/hooks/useDynamics';
import { DynamicComponentTypes, IDynamicFormSelectComponent, IDynamicFormComponent } from 'src/types/dynamics';
import { invokeEvent } from './helpers';
import { useTranslation } from 'react-i18next';

interface PropsType {
  component: IDynamicFormComponent;
  isCreating?: boolean;
}

const DynamicFormComponentSelectCreatable = ({ component, isCreating }: PropsType) => {
  // ** Hooks & Vars
  const theme = useTheme();
  const { t } = useTranslation();
  const dynamics = useDynamics();
  const { values, setFieldValue, errors } = useFormikContext();

  // ** States
  const [searchValue, setSearchValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<SearchEntitiesOptionType[]>([]);

  const theValues = values as any;
  const theErrors = errors as any;

  // const [initialValue, setInitialValue] = useState<any>(theValues[component.name]);

  const selectComponent = component as IDynamicFormSelectComponent;

  // Handle click event on a list item in search result
  const handleOptionClick = (obj: any) => {
    setSearchValue('');

    if (obj) setFieldValue(component.name, obj, true);
    else setFieldValue(component.name, '', true);
    setIsLoading(false);

    console.log('Options: ', options);

    // onEntitySelected(obj.rawObject);
    // setOpenDialog(false);
  };

  const getOptionLabel = (option: any) => {
    return option.label;
  };

  const getCurrentOptionLabel = (option: any) => {
    return option.label ? option.label : option;
  };

  const renderAutocompleteOption = (props: any, option: any | unknown, state: AutocompleteRenderOptionState) => {
    return searchValue.length ? (
      <ListItem
        {...props}
        key={state.index}
        className={`suggestion ${props.className}`}
        onClick={() => handleOptionClick(option as SearchEntitiesOptionType)}
        secondaryAction={<Icon icon='tabler:corner-down-left' fontSize='1.25rem' />}
        sx={{
          '& .MuiListItemSecondaryAction-root': {
            '& svg': {
              cursor: 'pointer',
              color: 'text.disabled',
            },
          },
        }}
      >
        <ListItemButton
          sx={{
            py: 2,
            px: `${theme.spacing(6)} !important`,
            '& svg': { mr: 2.5, color: 'text.primary' },
          }}
        >
          {/* <Icon icon={(option as SearchEntitiesOptionType).icon || themeConfig.navSubItemIcon} /> */}
          <Typography>{getOptionLabel(option)}</Typography>
        </ListItemButton>
      </ListItem>
    ) : null;
  };

  const isError = theErrors && theErrors[component.name] ? true : false;

  if (!values) return null;

  return (
    <>
      <Box sx={{ top: 0, width: '100%', position: 'sticky' }}>
        <CustomTextField
          required={selectComponent.validation?.isRequired}
          fullWidth
          name={component.name}
          type='text'
          label={t(component.label ? component.label : '')}
          placeholder={component.placeholder}
          error={isError}
          helperText={isError ? component.errorMsg : component.tooltip}
          value={theValues[component.name]}
          onChange={(event) => {
            setFieldValue(component.name, event.target.value, true);
          }}
          disabled={(component.readOnly?.create && isCreating) || (component.readOnly?.edit && !isCreating)}
        />

        {/* <CustomAutocomplete
          multiple={true}
          clearOnBlur={true}
          disabled={(component.readOnly?.create && isCreating) || (component.readOnly?.edit && !isCreating)}
          fullWidth
          noOptionsText={selectComponent.noOptionsText}

          value={theValues[component.name]}
          options={options}
          onInputChange={(event, value: string) => {
            if (theValues[component.name] && theValues[component.name].label === value && value !== '') return;

            // setFieldValue(component.name, '', true);

            setSearchValue(value);
          }}
          onChange={(event, obj) => {
            handleOptionClick(obj as any);
          }}
          renderOption={(props, option: SearchEntitiesOptionType | unknown, state: AutocompleteRenderOptionState) => {
            return renderAutocompleteOption(props, option, state);
          }}
          getOptionLabel={(option: any | unknown) => getCurrentOptionLabel(option) || ''}
          isOptionEqualToValue={(option, value) => {
            // if (value === '') return true;
            if (option && option.value === value) return true;
            else if (option === value) return true;

            return false;
          }}
          renderInput={(params) => (
            <CustomTextField
              {...params}
              error={isError}
              helperText={isError ? component.errorMsg : component.tooltip}
              fullWidth
              label={component.label}
            />
          )}
        /> */}
      </Box>
    </>
  );
};

export default DynamicFormComponentSelectCreatable;
