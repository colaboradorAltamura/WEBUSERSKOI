// ** React Import
import { useEffect, useState } from 'react';
import OptionsMenuCustom from 'src/@core/components/custom-option-menu';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Type Import
import CustomTextField from 'src/@core/components/mui/text-field';

interface Props {
  label: string;
  placeholder?: string;
  codeCountry?: string;
  value?: string;
  onChange?: (values?: any) => void;
}

const countries = [
  {
    name: '+54',
    value: '+54',
    img: 'https://flagicons.lipis.dev/flags/4x3/ar.svg',
  },
  {
    name: '+55',
    value: '+55',
    img: 'https://flagicons.lipis.dev/flags/4x3/br.svg',
  },
];

const PhoneNumberDropdown = (props: Props) => {
  //** props */
  const { label, placeholder, codeCountry, value, onChange } = props;

  //const { i18n } = useTranslation();
  const [countrySelected, setCountrySelected] = useState<string>(codeCountry ? codeCountry : '+55');
  const [countryNameSelected, setCountryNameSelected] = useState<string>(countries[0].name);
  const [countryImgSelected, setCountryImgSelected] = useState<string>(countries[0].img);

  const handleLangItemClick = (lang: '+54' | '+55') => {
    setCountrySelected(lang);

    if (lang == '+55') {
      setCountryNameSelected(countries[1].name);
      setCountryImgSelected(countries[1].img);
    } else {
      setCountryNameSelected(countries[0].name);
      setCountryImgSelected(countries[0].img);
    }
  };

  return (
    <CustomTextField
      fullWidth
      value={value}
      label={label}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <OptionsMenuCustom
            label={countryNameSelected}
            imagen={countryImgSelected}
            iconButtonProps={{ color: 'inherit' }}
            icon={<Icon icon='tabler:select' />}
            menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4.25, minWidth: 130 } } }}
            options={[
              {
                text: 'Argentina',
                menuItemProps: {
                  sx: { py: 2 },
                  selected: countrySelected === '+54',
                  onClick: () => {
                    handleLangItemClick('+54');
                  },
                },
              },
              {
                text: 'Brasil',
                menuItemProps: {
                  sx: { py: 2 },
                  selected: countrySelected === '+55',
                  onClick: () => {
                    handleLangItemClick('+55');
                  },
                },
              },
            ]}
          />
        ),
      }}
    />
  );
};

export default PhoneNumberDropdown;
