// ** React Imports
import { useState } from 'react';

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// ** Custom Component Import

// ** Third Party Imports

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Store Imports

// ** Actions Imports

// ** Types Imports
import Loader from 'src/@core/components/loader';
import { IForm } from 'src/types/dynamics';
import DynamicForm from './DynamicForm';

interface PropsType {
  formId?: string;

  preloadForm?: IForm | null;
  open: boolean;
  toggle: () => void;
  onSubmit?: (formData: any, isCreating: boolean) => Promise<any>;
  onSubmitDone?: (formData: any, isCreating: boolean) => Promise<any>;
  title?: string;
  initialValues?: any;
  isCreating?: boolean;
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between',
}));

const DynamicFormSidebar = ({
  formId,
  preloadForm,

  open,
  toggle,
  onSubmit,
  onSubmitDone,
  title,
  initialValues,
  isCreating,
}: PropsType) => {
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [sidebarTitle, setSidebarTitle] = useState<string | undefined>(title);

  const handleClose = () => {
    toggle();
  };

  if (loadingSubmit) return <Loader />;

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>{sidebarTitle}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: (theme) =>
                `rgba(${theme.palette.customColors ? theme.palette.customColors.main : ''}, 0.16)`,
            },
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: (theme) => theme.spacing(0, 6, 6) }}>
        {open && (
          <DynamicForm
            initialValues={initialValues ? initialValues : {}}
            formId={formId}
            preloadForm={preloadForm}
            isCreating={isCreating}
            onCancel={handleClose}
            onSubmit={onSubmit}
            onSubmitDone={onSubmitDone}

            // onFormFetched={(form) => {
            //   return Promise.resolve();
            // }}
          />
        )}
      </Box>
    </Drawer>
  );
};

export default DynamicFormSidebar;
