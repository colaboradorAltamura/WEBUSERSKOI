// ** React Imports
import { useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Third Party Imports
import { useDropzone } from 'react-dropzone';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'src/@core/coreHelper';

interface FileProp {
  name: string;
  type: string;
  size: number;
}

const FileUploaderSingle = ({ onSave }: { onSave: (files: File[]) => void }) => {
  // ** State
  const [files, setFiles] = useState<File[]>([]);
  const { t } = useTranslation();

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    // accept: {
    //   'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    // },
    onDrop: (acceptedFiles: File[]) => {
      setFiles([...files, ...acceptedFiles.map((file) => Object.assign(file))]);
      // setFiles(acceptedFiles.map((file: File) => Object.assign(file)));
    },
  });

  const renderFilePreview = (file: any) => {
    if (file.type.startsWith('image')) {
      return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='28' width='28' />;
    } else {
      return <Icon icon='tabler:file' fontSize='1.75rem' />;
    }
  };

  const handleRemoveFile = (file: any) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i) => i.name !== file.name);
    setFiles([...filtered]);
  };

  const renderFileSize = (size: number) => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
    }
  };

  const fileList = files.map((file, index) => (
    <div key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
      <div className='file-details d-flex align-items-center'>
        <div className='file-preview me-1'>{renderFilePreview(file)}</div>
        <div>
          <p className='file-name mb-0'>{file.name}</p>
          <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button onClick={() => handleRemoveFile(file)}>
        <Icon icon='tabler:trash-x' fontSize='1.75rem' />
      </Button>
    </div>
  ));

  if (fileList.length === 0)
    return (
      <li style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <div className='d-flex align-items-center justify-content-center flex-column'>
            <Icon icon='tabler:upload' fontSize='1.75rem' />
            <h5>{t('drop Files here or click to upload')}</h5>
            <p className='text-secondary'>
              {t('drop files here or click')}
              <Link href='/' onClick={(e) => e.preventDefault()}>
                {t('browse')}
              </Link>
              {t('thorough your machine')}
            </p>
          </div>
        </div>
      </li>
    );

  return (
    // <Box {...getRootProps({ className: 'dropzone' })}>
    <Box>
      <ul style={{ display: 'flex' }}>{fileList}</ul>
      <div>
        <Button
          variant='contained'
          color='primary'
          onClick={() => {
            onSave(files);
          }}
        >
          {capitalize(t('save'))}
        </Button>
      </div>
    </Box>
  );
};

export default FileUploaderSingle;
