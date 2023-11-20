import { useEffect, useRef, useState } from 'react';

import { geohashForLocation } from 'geofire-common';

// prop-type is a library for typechecking of props

// formik components

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field';

function FormLocationField({
  label,

  placeholder,

  onPlaceSelected,

  value,

  // ...rest
}) {
  const [query, setQuery] = useState(value);

  const autoCompleteRef = useRef(null);
  let autoComplete;

  async function handlePlaceSelect(updateQuery) {
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
      ? addressObject.address_components.find((ad) => {
          if (ad && ad.types) {
            return ad.types.find((t) => {
              return t === 'locality';
            });
          }

          return false;
        })
      : null;

    if (!city)
      city = addressObject.address_components
        ? addressObject.address_components.find((ad) => {
            if (ad && ad.types) {
              return ad.types.find((t) => {
                return t === 'sublocality';
              });
            }

            return false;
          })
        : null;

    const county = addressObject.address_components
      ? addressObject.address_components.find((ad) => {
          if (ad && ad.types) {
            return ad.types.find((t) => {
              return t === 'administrative_area_level_2';
            });
          }

          return false;
        })
      : null;

    const postal_code = addressObject.address_components
      ? addressObject.address_components.find((ad) => {
          if (ad && ad.types) {
            return ad.types.find((t) => {
              return t === 'postal_code';
            });
          }

          return false;
        })
      : null;

    const state = addressObject.address_components
      ? addressObject.address_components.find((ad) => {
          if (ad && ad.types) {
            return ad.types.find((t) => {
              return t === 'administrative_area_level_1';
            });
          }

          return false;
        })
      : null;

    let street = addressObject.address_components
      ? addressObject.address_components.find((ad) => {
          if (ad && ad.types) {
            return ad.types.find((t) => {
              return t === 'route';
            });
          }

          return false;
        })
      : '';

    if (street) street = street.long_name;

    let streetNumber = addressObject.address_components
      ? addressObject.address_components.find((ad) => {
          if (ad && ad.types) {
            return ad.types.find((t) => {
              return t === 'street_number';
            });
          }

          return false;
        })
      : '';

    if (streetNumber) streetNumber = streetNumber.long_name;

    const country = addressObject.address_components
      ? addressObject.address_components.find((ad) => {
          if (ad && ad.types) {
            return ad.types.find((t) => {
              return t === 'country';
            });
          }

          return false;
        })
      : '';

    onPlaceSelected({
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
  }

  function handleScriptLoad(updateQuery, autoCompleteRefAux) {
    autoComplete = new window.google.maps.places.Autocomplete(
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
    if (!window.google || !window.google.maps) {
      console.log('map not loades yet');

      return;
    }

    handleScriptLoad(setQuery, autoCompleteRef);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.google]);

  return (
    <CustomTextField
      fullWidth
      label={label}
      value={query}
      onChange={(event) => {
        setQuery(event.target.value);
      }}
      inputRef={autoCompleteRef}
      placeholder={placeholder}
    />
  );
}

// // typechecking props for FormField
// FormLocationField.propTypes = {
//   // classes: PropTypes.object.isRequired,
//   labelText: PropTypes.node,
//   errorLabelText: PropTypes.node,
//   errorLabelProps: PropTypes.object,
//   labelProps: PropTypes.object,
//   id: PropTypes.string,
//   inputProps: PropTypes.object,
//   formControlProps: PropTypes.object,
//   inputRootCustomClasses: PropTypes.string,
//   error: PropTypes.bool,
//   success: PropTypes.bool,
//   white: PropTypes.bool,
// };

export default FormLocationField;
