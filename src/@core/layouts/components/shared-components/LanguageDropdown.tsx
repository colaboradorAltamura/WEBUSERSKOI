// ** React Import
import { useEffect, useState } from 'react';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Third Party Import
import { useTranslation } from 'react-i18next';

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu';

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext';
import OptionsMenuCustom from 'src/@core/components/custom-option-menu';
import { COUNTRIES } from 'src/@core/coreHelper';

interface Props {
  settings: Settings;
  saveSettings: (values: Settings) => void;
  reloadAfterChange?: boolean;
}

const LanguageDropdown = ({ settings, saveSettings, reloadAfterChange }: Props) => {
  // ** Hook
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(settings.codeCountry);
  }, [settings, settings.codeCountry]);

  let initialCountry = COUNTRIES.find((country) => {
    return country.value === settings.codeCountry;
  });

  if (!initialCountry) initialCountry = COUNTRIES[0];

  //const { i18n } = useTranslation();
  const [countrySelected, setCountrySelected] = useState<string>(initialCountry.value);
  const [countryNameSelected, setCountryNameSelected] = useState<string>(initialCountry.name);
  const [countryImgSelected, setCountryImgSelected] = useState<string>(initialCountry.img);

  // const handleLangItemClick = (lang: string) => {
  //   i18n.changeLanguage(lang);
  // };

  const handleLangItemClick = (lang: string) => {
    const selectedCountry = COUNTRIES.find((country) => {
      return country.value === lang;
    });

    if (!selectedCountry) throw new Error('Invalid country selection');

    setCountrySelected(selectedCountry.value);
    setCountryNameSelected(selectedCountry.name);
    setCountryImgSelected(selectedCountry.img);

    // facilita el reload de todos los textos de la pagina actual
    if (reloadAfterChange) window.location.reload();
  };

  // ** Change html `lang` attribute when changing locale
  useEffect(() => {
    document.documentElement.setAttribute('lang', i18n.language);
  }, [i18n.language]);

  return (
    <OptionsMenuCustom
      label={countryNameSelected}
      imagen={countryImgSelected}
      iconButtonProps={{ color: 'inherit' }}
      icon={<Icon icon='tabler:select' />}
      menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4.25, minWidth: 130 } } }}
      options={[
        {
          text: 'Arg',
          menuItemProps: {
            sx: { py: 2 },
            selected: countrySelected === 'ar',
            onClick: () => {
              handleLangItemClick('ar');
              saveSettings({ ...settings, codeCountry: 'ar' });
            },
          },
        },
        {
          text: 'Bra',
          menuItemProps: {
            sx: { py: 2 },
            selected: countrySelected === 'br',
            onClick: () => {
              handleLangItemClick('br');
              saveSettings({ ...settings, codeCountry: 'br' });
            },
          },
        },
      ]}
    />
  );
};

export default LanguageDropdown;
