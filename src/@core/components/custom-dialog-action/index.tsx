// ** React Imports
import { MouseEvent, useState, ReactNode, useEffect } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import { Breakpoint, Button, Dialog, DialogActions, DialogContent, Typography, capitalize } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';
// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Hook Import
import { useTranslation } from 'react-i18next';

interface PropsType {
  show: boolean;
  title: string;
  text?: string;
  textButtonSubmit?: string;
  colorButtonSubmit?: OverridableStringUnion<
    'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  >;
  children?: React.ReactNode;
  showOnClickClose?: boolean;
  showOnClickSubmit?: boolean;
  icon?: string;
  keepMounted?: boolean;
  maxWidth?: Breakpoint | false;
  onClickSubmit?: () => void;
  onClickClose: () => void;
}

const DialogAction = ({
  show,
  title,
  text,
  textButtonSubmit,
  colorButtonSubmit,
  children,
  showOnClickClose,
  showOnClickSubmit,
  icon,
  keepMounted,
  maxWidth,
  onClickSubmit,
  onClickClose,
}: PropsType) => {
  // ** Hooks
  const { t } = useTranslation();

  // ** states
  const [showCancelButton, setShowCancelButton] = useState<boolean>(true);

  // ** effects
  useEffect(() => {
    if (showOnClickClose === false) {
      setShowCancelButton(showOnClickClose);
    }
  }, [showOnClickClose]);

  return (
    <Dialog
      fullWidth
      open={show}
      maxWidth={maxWidth ?? 'sm'}
      scroll='body'
      keepMounted={keepMounted}
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
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          {icon && <Icon icon={icon} fontSize='2rem' />}
          <Typography variant='h3' sx={{ mb: 3 }}>
            {t(title)}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>{t(text ? text : '')}</Typography>
          {children}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          px: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: (theme) => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
        }}
      >
        {(onClickSubmit || showOnClickSubmit) && (
          <Button variant='contained' color={colorButtonSubmit} sx={{ mr: 1 }} onClick={onClickSubmit}>
            {textButtonSubmit ? capitalize(t(textButtonSubmit)) : capitalize(t('accept'))}
          </Button>
        )}
        {showCancelButton && (
          <Button variant='tonal' color='secondary' onClick={onClickClose}>
            {capitalize(t('cancel'))}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DialogAction;
