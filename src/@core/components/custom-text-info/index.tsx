// ** React Imports
import { MouseEvent, useState, ReactNode, useEffect } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import { ChipPropsColorOverrides, Typography, capitalize } from '@mui/material';
import { useTranslation } from 'react-i18next';
// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip';
import { OverridableStringUnion } from '@mui/types';

interface props {
  title: string;
  value: any;
  visible?: string;
  //isColored?: boolean;
  color?:
    | OverridableStringUnion<
        'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
        ChipPropsColorOverrides
      >
    | undefined;

  renderAsCode?: boolean;
}

const TextInfo = ({ title, value, visible, color, renderAsCode }: props) => {
  // ** HOOKS
  const { t } = useTranslation();

  // ** states
  const [display, setDisplay] = useState<string>('flex');

  // ** effects
  useEffect(() => {
    setDisplay(visible ? visible : 'flex');
  }, [visible]);

  const renderValue = (val: string) => {
    if (renderAsCode) return val;

    return capitalize(t(val));
  };

  return (
    <>
      <Box sx={{ display: display, alignItems: 'center', mb: 3 }}>
        <Typography sx={{ mr: 4, fontWeight: 500, color: 'text.secondary' }}>{capitalize(t(title))}:</Typography>

        {color && value ? (
          <CustomChip
            rounded
            size='small'
            skin='light'
            label={capitalize(t(value))}
            color={color}
            sx={{ textTransform: 'capitalize' }}
          />
        ) : (
          <Typography variant='body2' className={renderAsCode ? '' : 'custom-label'}>
            {value && Array.isArray(value)
              ? value
                  .map((item) => {
                    return renderValue(item);
                  })
                  .join(', ')
              : renderValue(value)}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default TextInfo;
