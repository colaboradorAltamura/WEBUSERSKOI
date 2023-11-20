// ** React Imports
import { useEffect, useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Custom Avatar Component
import Checkbox from '@mui/material/Checkbox';
import CustomAvatar from 'src/@core/components/mui/avatar';

interface PropsType {
  onIsCountryFilteredChange: (val: boolean) => void;
  onIsStateRelatedChange: (val: boolean) => void;
  initialIsCountryFiltered: boolean;
  initialIsStateRelated: boolean;
}

const DialogTabSelectOptionsSchema = ({
  onIsCountryFilteredChange,
  onIsStateRelatedChange,
  initialIsCountryFiltered,
  initialIsStateRelated,
}: PropsType) => {
  // const [schemaNameValue, setSchemaNameValue] = useState<string>(schemaName);

  const [isCountryFiltered, setIsCountryFiltered] = useState<boolean>(initialIsCountryFiltered);
  const [isStateRelated, setIsStateRelated] = useState<boolean>(initialIsStateRelated);

  useEffect(() => {
    onIsCountryFilteredChange(isCountryFiltered);
  }, [isCountryFiltered]);

  useEffect(() => {
    onIsStateRelatedChange(isStateRelated);
  }, [isStateRelated]);

  return (
    <div>
      <Typography variant='h5' sx={{ mb: 4 }}>
        Algo create a role with this type of User ?
      </Typography>
      <Box sx={{ mb: 8 }}>
        <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='info' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Icon icon='tabler:flag-3' />
            </CustomAvatar>
            <div>
              <Typography>Is country filtered</Typography>
            </div>
          </Box>
          <Checkbox
            name='basic-checked-1'
            checked={isCountryFiltered}
            onChange={(event) => {
              setIsCountryFiltered(event.target.checked as boolean);
            }}
          />
        </Box>
        <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='info' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Icon icon='tabler:brand-redux' />
            </CustomAvatar>
            <div>
              <Typography>Is state related</Typography>
            </div>
          </Box>
          <Checkbox
            name='basic-checked-2'
            checked={isStateRelated}
            onChange={(event) => {
              setIsStateRelated(event.target.checked as boolean);
            }}
          />
        </Box>
      </Box>
    </div>
  );
};

export default DialogTabSelectOptionsSchema;
