// ** React Imports
import { useState, ChangeEvent, useEffect } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Custom Avatar Component
import CustomAvatar from 'src/@core/components/mui/avatar';
import Checkbox from '@mui/material/Checkbox';
import CustomTextField from 'src/@core/components/mui/text-field';

interface PropsType {
  schemaName: string;
  onRoleNameChange?: (roleName: string) => void;
}

const DialogTabUserSchemaRelatedRole = ({ schemaName, onRoleNameChange }: PropsType) => {
  // const [schemaNameValue, setSchemaNameValue] = useState<string>(schemaName);
  const [checkedValue, setCheckedValue] = useState<boolean>(true);
  const [roleNameValue, setRoleNameValue] = useState<string>(``);

  useEffect(() => {
    const newName = `udr-${schemaName}`;
    setRoleNameValue(newName);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaName]);

  useEffect(() => {
    if (onRoleNameChange) onRoleNameChange(roleNameValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleNameValue]);

  return (
    <div>
      <Typography variant='h5' sx={{ mb: 4 }}>
        Algo create a role with this type of User ?
      </Typography>
      <Box sx={{ mb: 8 }}>
        <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='info' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Icon icon='tabler:brand-react' />
            </CustomAvatar>
            <div>
              <Typography>Create role</Typography>
            </div>
          </Box>
          {/* <Checkbox
            name='basic-checked'
            checked={checkedValue}
            onChange={(event) => {
              setCheckedValue(event.target.checked as boolean);

              if (!event.target.checked) setRoleNameValue('');
            }}
          /> */}
          {/* <Radio value='react' onChange={handleChange} checked={value === 'react'} /> */}
        </Box>

        {checkedValue && (
          <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <Typography></Typography>
              </div>
            </Box> */}
            <CustomTextField
              required={true}
              fullWidth
              type='text'
              label={'Role name'}
              placeholder={'eg: productOwner'}
              value={roleNameValue}
              error={!roleNameValue}
              onChange={(event) => {
                setRoleNameValue(event.target.value);
              }}
            />
          </Box>
        )}
      </Box>
    </div>
  );
};

export default DialogTabUserSchemaRelatedRole;
