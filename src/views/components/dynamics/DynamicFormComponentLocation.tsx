// formik components

import { useFormikContext } from 'formik';
import CustomTextField from 'src/@core/components/mui/text-field';
import { IDynamicFormComponent } from 'src/types/dynamics';

// ** MUI Imports

// ** Third Party Imports
import { ReactDatePickerProps } from 'react-datepicker';

// ** React Imports
import { forwardRef, useEffect, useRef, useState } from 'react';

// ** Styled Component
import { useTranslation } from 'react-i18next';

import { geohashForLocation } from 'geofire-common';

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

  // ** Hooks
  const { t } = useTranslation();

  return (
    <CustomTextField
      fullWidth
      {...props}
      inputRef={ref}
      label={t(label ? label : '')}
      {...(readOnly && { inputProps: { readOnly: true } })}
    />
  );
});

const DynamicFormComponentLocation = ({ component, isCreating, popperPlacement, ...rest }: PropsType) => {
  const { values, setFieldValue, errors, touched, handleBlur } = useFormikContext();

  // const [currentValue, setCurrentValue] = useState<any>(component.initialValue ? component.initialValue : '');
  // ** Hooks
  const { t } = useTranslation();

  const theValues = values as any;
  const theErrors = errors as any;
  const theTouched = touched as any;

  const formComponent = component as IDynamicFormComponent;
  const isError = theErrors && theErrors[component.name] && theTouched && theTouched[component.name] ? true : false;

  const [query, setQuery] = useState(theValues ? theValues.addressString : '');

  const win = window as any;

  const autoCompleteRef = useRef(null);
  let autoComplete: any;

  async function handlePlaceSelect(updateQuery: any) {
    const addressObject = autoComplete.getPlace();
    const queryStr = addressObject.formatted_address;
    updateQuery(queryStr);
    console.log(addressObject);

    if (!addressObject.geometry || !addressObject.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      // window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    let city = addressObject.address_components
      ? addressObject.address_components.find((ad: any) => {
          if (ad && ad.types) {
            return ad.types.find((t: any) => {
              return t === 'locality';
            });
          }

          return false;
        })
      : null;

    if (!city)
      city = addressObject.address_components
        ? addressObject.address_components.find((ad: any) => {
            if (ad && ad.types) {
              return ad.types.find((t: any) => {
                return t === 'sublocality';
              });
            }

            return false;
          })
        : null;

    const county = addressObject.address_components
      ? addressObject.address_components.find((ad: any) => {
          if (ad && ad.types) {
            return ad.types.find((t: any) => {
              return t === 'administrative_area_level_2';
            });
          }

          return false;
        })
      : null;

    const postal_code = addressObject.address_components
      ? addressObject.address_components.find((ad: any) => {
          if (ad && ad.types) {
            return ad.types.find((t: any) => {
              return t === 'postal_code';
            });
          }

          return false;
        })
      : null;

    const state = addressObject.address_components
      ? addressObject.address_components.find((ad: any) => {
          if (ad && ad.types) {
            return ad.types.find((t: any) => {
              return t === 'administrative_area_level_1';
            });
          }

          return false;
        })
      : null;

    let street = addressObject.address_components
      ? addressObject.address_components.find((ad: any) => {
          if (ad && ad.types) {
            return ad.types.find((t: any) => {
              return t === 'route';
            });
          }

          return false;
        })
      : '';

    if (street) street = street.long_name;

    let streetNumber = addressObject.address_components
      ? addressObject.address_components.find((ad: any) => {
          if (ad && ad.types) {
            return ad.types.find((t: any) => {
              return t === 'street_number';
            });
          }

          return false;
        })
      : '';

    if (streetNumber) streetNumber = streetNumber.long_name;

    const country = addressObject.address_components
      ? addressObject.address_components.find((ad: any) => {
          if (ad && ad.types) {
            return ad.types.find((t: any) => {
              return t === 'country';
            });
          }

          return false;
        })
      : '';

    setFieldValue(component.name, {
      lat: addressObject.geometry.location.lat(),
      lng: addressObject.geometry.location.lng(),

      city: city ? city.long_name : null,
      county: county ? county.long_name : null,
      postal_code: postal_code ? postal_code.long_name : null,
      state: state ? state.long_name : null,
      addressObject,
      addressString: addressObject.formatted_address,
      streetAndNumber: streetNumber ? `${street} ${streetNumber}` : street,
      country: country ? country.long_name : null,
      geohash: geohashForLocation([addressObject.geometry.location.lat(), addressObject.geometry.location.lng()]),
    });

    // setFieldValue(name, {
    //   lat: addressObject.geometry.location.lat(),
    //   lng: addressObject.geometry.location.lng(),

    //   city: city ? city.long_name : null,
    //   county: county ? county.long_name : null,
    //   postal_code: postal_code ? postal_code.long_name : null,
    //   state: state ? state.long_name : null,
    //   addressObject,
    //   addressString: addressObject.formatted_address,
    //   streetAndNumber: `${street} ${streetNumber}`,
    //   country: country ? country.long_name : null,
    // });
  }

  function handleScriptLoad(updateQuery: any, autoCompleteRefAux: any) {
    autoComplete = new win.google.maps.places.Autocomplete(
      autoCompleteRefAux.current,

      // { types: ["(cities)"], componentRestrictions: { country: "us" } }
      { types: ['address'], componentRestrictions: { country: 'ar' } },
      { types: ['address'] }

      // { componentRestrictions: { country: "us" } }
    );

    autoComplete.setFields(['address_components', 'formatted_address', 'geometry']);
    autoComplete.addListener('place_changed', () => handlePlaceSelect(updateQuery));
  }

  useEffect(() => {
    if (!win.google || !win.google.maps) {
      console.log('map not loades yet');

      return;
    }

    handleScriptLoad(setQuery, autoCompleteRef);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win.google]);

  if (!values) return null;

  return (
    <CustomTextField
      fullWidth
      label={t(component.label ? component.label : '')}
      value={query}
      onChange={(event) => {
        setQuery(event.target.value);
      }}
      inputRef={autoCompleteRef}
      placeholder={component.placeholder}
      onBlur={handleBlur}
      error={isError}
      helperText={isError ? component.errorMsg : component.tooltip}
      disabled={(component.readOnly?.create && isCreating) || (component.readOnly?.edit && !isCreating)}
    />
  );
};

export default DynamicFormComponentLocation;
