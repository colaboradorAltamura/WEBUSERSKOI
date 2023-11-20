// ** React Imports
import { MouseEvent, useState, ReactNode } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import { Button, Dialog, DialogActions, DialogContent, Typography, capitalize } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Hook Import
import { useTranslation } from 'react-i18next';
// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar';

interface PropsType {
  show: boolean;
  title: string;
  text?: string;
  color?: OverridableStringUnion<'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'>;
  icon?: string;
  onClickClose: () => void;
}

const DialogInformation = ({ show, title, text, color, icon, onClickClose }: PropsType) => {
  // ** Hooks
  const { t } = useTranslation();

  return (
    <Dialog
      fullWidth
      open={show}
      maxWidth='sm'
      scroll='body'
      onClose={onClickClose}
      onBackdropClick={onClickClose}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogContent
        sx={{
          pb: (theme) => `${theme.spacing(8)} !important`,
          px: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: (theme) => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <CustomAvatar
            skin='light'
            color={color ? color : 'primary'}
            variant='rounded'
            sx={{ mb: 4, width: [70, 82], height: [70, 82], '& svg': { fontSize: ['2.2rem', '3.125rem'] } }}
          >
            <Icon icon={icon ? icon : 'tabler:check'} />
          </CustomAvatar>
          <Typography variant='h3' sx={{ mb: 3 }}>
            {t(title)}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>{t(text ? text : '')}</Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DialogInformation;
