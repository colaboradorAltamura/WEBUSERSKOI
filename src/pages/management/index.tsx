// ** React Imports

// ** MUI Imports
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

// ** Tab Content Imports

import Button from '@mui/material/Button';
import Icon from 'src/@core/components/icon';
import Loader from 'src/@core/components/loader';
import { useEffect, useState } from 'react';
import { exportOrganizationConfig, getCurrentOrganizaion } from 'src/services/managementServices';
import { handleError } from 'src/@core/coreHelper';

const Management = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const doAsync = async () => {
      const org = await getCurrentOrganizaion();
      setIsLoading(false);
    };
    doAsync();
  }, []);

  const handleImport = () => {
    alert('TODO');
  };

  const handleExport = async () => {
    try {
      setIsLoading(true);

      await exportOrganizationConfig();

      setIsLoading(false);
    } catch (e) {
      handleError(e);
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title='Deployments'
          action={
            <>
              <Button
                onClick={() => {
                  handleImport();
                }}
                variant='contained'
                sx={{ '& svg': { mr: 2 } }}
              >
                <Icon fontSize='1.125rem' icon='tabler:plus' />
                Import
              </Button>
              <Button
                onClick={() => {
                  handleExport();
                }}
                variant='contained'
                sx={{ '& svg': { mr: 2 } }}
              >
                <Icon fontSize='1.125rem' icon='tabler:plus' />
                Export
              </Button>
            </>
          }
        />
      </Card>
    </>
  );
};

export default Management;
