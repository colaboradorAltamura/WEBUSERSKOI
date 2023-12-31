// formik components

import Box, { BoxProps } from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { IDynamicFormComponent, IDynamicFormFileUploaderComponent } from 'src/types/dynamics';
import { styled } from '@mui/material/styles';

// ** Custom Component Import

// ** Third Party Imports

// ** Icon Imports
import Icon from 'src/@core/components/icon';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { CardContent, Checkbox, FormControlLabel, Grid, InputLabel } from '@mui/material';

import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone';

// ** Demo Components Imports
import FileUploaderSingle from 'src/views/forms/form-elements/file-uploader/FileUploaderSingle';
import { handleError } from 'src/@core/coreHelper';
import { createAttachment } from 'src/services/attachmentsServices';
import { CMSCollections, IAttachment } from 'src/types/@autogenerated';
import Loader from 'src/@core/components/loader';

import { getStoredFileDownloadUrl } from 'src/services/attachmentsServices';
import { dynamicCreate } from 'src/services/entitiesDynamicServices';

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between',
}));

interface PropsType {
  component: IDynamicFormFileUploaderComponent;
  isCreating?: boolean;
}

const DynamicFormComponentFileUploader = ({ component, isCreating, ...rest }: PropsType) => {
  // ** HOOKS
  const { t } = useTranslation();
  const { values, setFieldValue, errors } = useFormikContext();

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const theValues = values as any;
  const theErrors = errors as any;

  const isError = theErrors && theErrors[component.name] ? true : false;

  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  const handleCloseDrawer = () => {
    toggleDrawer();
  };

  const isPublicKeyName = component.name + '_isPublic';

  useEffect(() => {
    setFieldValue(isPublicKeyName, !!component.isPublicDefaultValue, true);
  }, []);

  let isPublic: boolean = theValues && theValues[isPublicKeyName];
  if (!isPublic) isPublic = false;

  const attachmentValue: IAttachment = theValues && theValues[component.name] ? theValues[component.name] : null;

  const handleOnSaveUploadedFiles = async (files: File[]) => {
    try {
      setIsLoading(true);

      toggleDrawer();

      const attachment = await createAttachment({
        attachment: files[0],
        isPublic,
      });

      setFieldValue(component.name, attachment, true);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      handleError(e);
    }
  };

  const renderFilePreview = (attachment: IAttachment) => {
    if (attachment && attachment.extension.startsWith('image') && attachment.downloadURL) {
      return <img className='rounded' alt={attachment.name} src={attachment.downloadURL} height='28' width='28' />;
    } else if (attachment) {
      return <Icon icon={'tabler:file-check'} fontSize={'1.75rem'} style={{ marginBottom: 8 }} color={'green'} />;
    } else {
      // return <Icon icon='tabler:file' fontSize='1.75rem' />;

      return <Icon icon={'tabler:folder'} fontSize={'1.75rem'} style={{ marginBottom: 8 }} />;
    }
  };

  const handleRemoveFile = () => {
    setFieldValue(component.name, null, true);
  };

  const renderFileSize = (size: number) => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
    }
  };

  const handleDownloadFile = async (attachment: IAttachment) => {
    if (attachment.downloadURL) window.open(attachment.downloadURL);
    else {
      const responseResults = (await dynamicCreate({
        params: '/attachments/file-to-download-url/' + CMSCollections.WORKERS,
        data: { refPath: attachment.refPath },
      })) as [string];

      // const downloadUrl = (await getStoredFileDownloadUrl(attachment.refPath)) as any;

      window.open(responseResults[0]);
    }
  };

  const handleFilePress = () => {
    if (attachmentValue) {
      handleDownloadFile(attachmentValue);
    } else {
      toggleDrawer();
    }
  };

  if (!values) return null;

  if (isLoading) return <Loader />;

  return (
    <>
      <Box
        sx={{
          p: 4,
          height: '100%',
          display: 'flex',
          borderRadius: 1,
          cursor: 'pointer',
          position: 'relative',
          alignItems: 'center',
          flexDirection: 'column',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          '&:hover': { borderColor: (theme) => `rgba(${theme.palette.customColors.main}, 0.25)` },
        }}
      >
        {attachmentValue && (
          <Icon
            icon={'tabler:trash-x'}
            fontSize={'1.75rem'}
            style={{ marginBottom: 8, marginLeft: 'auto' }}
            onClick={() => {
              handleRemoveFile();
            }}
          />
        )}
        <Box onClick={() => handleFilePress()}>
          {renderFilePreview(attachmentValue)}
          <Typography variant='h6' sx={{ my: 'auto' }}>
            {component.label}
          </Typography>
        </Box>
      </Box>
      <Drawer
        open={openDrawer}
        anchor='right'
        variant='temporary'
        onClose={handleCloseDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >
        <Header>
          <Typography variant='h5'>{`Upload ${component.label}`}</Typography>
          <IconButton
            size='small'
            onClick={handleCloseDrawer}
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
          <Card>
            <CardContent>
              <DropzoneWrapper>
                <Grid container spacing={6} className='match-height'>
                  <Grid item xs={12}>
                    <FileUploaderSingle
                      onSave={(files: File[]) => {
                        handleOnSaveUploadedFiles(files);
                      }}
                    />
                  </Grid>
                </Grid>
              </DropzoneWrapper>

              {component.allowIsPublicSwitch && (
                <FormControlLabel
                  label={t('public access')}
                  control={
                    <Checkbox
                      checked={theValues[isPublicKeyName]}
                      onChange={(event) => {
                        setFieldValue(isPublicKeyName, event.target.checked, true);
                      }}
                      disabled={(component.readOnly?.create && isCreating) || (component.readOnly?.edit && !isCreating)}
                    />
                  }
                />
              )}
            </CardContent>
          </Card>
        </Box>
      </Drawer>
    </>
  );
};

export default DynamicFormComponentFileUploader;
