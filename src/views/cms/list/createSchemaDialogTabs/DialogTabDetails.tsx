// ** React Imports
import { useState, ChangeEvent, useEffect } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Config Import
import themeConfig from 'src/configs/themeConfig';

// ** Custom Avatar Component
import CustomAvatar from 'src/@core/components/mui/avatar';
import { EntitySchemaTypes } from 'src/types/entities';

interface PropType {
  onSchemaTypeChange: (selectedType: EntitySchemaTypes) => void;
  onSchemaNameChange: (selectedName: string) => void;
  initialSchemaType: EntitySchemaTypes;
  initialSchemaName: string;
}
const TabDetails = ({ onSchemaTypeChange, onSchemaNameChange, initialSchemaType, initialSchemaName }: PropType) => {
  const [schemaNameValue, setSchemaNameValue] = useState<string>(initialSchemaName);
  const [schemaTypeValue, setSchemaTypeValue] = useState<EntitySchemaTypes>(initialSchemaType);

  const handleChangeSchemaType = (event: ChangeEvent<HTMLInputElement>) => {
    setSchemaTypeValue(event.target.value as EntitySchemaTypes);
  };

  const handleChangeSchemaName = (event: ChangeEvent<HTMLInputElement>) => {
    setSchemaNameValue(event.target.value);
  };

  useEffect(() => {
    if (onSchemaTypeChange) onSchemaTypeChange(schemaTypeValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaTypeValue]);

  useEffect(() => {
    if (onSchemaNameChange) onSchemaNameChange(schemaNameValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaNameValue]);

  return (
    <div>
      <CustomTextField
        fullWidth
        sx={{ mb: 4 }}
        label='Schema Name'
        placeholder={`products`}
        helperText={`Suggestion: Use plural names and capitalized, starting with lowerCase`}
        onChange={handleChangeSchemaName}
        value={schemaNameValue}
      />
      <Typography variant='h5' sx={{ mb: 4 }}>
        Schema type
      </Typography>
      <Box sx={{ mb: 8 }}>
        {/* MAIN_ENTITY */}
        <Box
          onClick={() => setSchemaTypeValue(EntitySchemaTypes.MAIN_ENTITY)}
          sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='info' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Icon icon='tabler:award' />
            </CustomAvatar>
            <div>
              <Typography>Main entity</Typography>
              <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                eg: products, plans, pathologies, etc
              </Typography>
            </div>
          </Box>
          <Radio
            value={EntitySchemaTypes.MAIN_ENTITY}
            onChange={handleChangeSchemaType}
            checked={schemaTypeValue === EntitySchemaTypes.MAIN_ENTITY}
          />
        </Box>

        {/* USER_ENTITY */}
        <Box
          onClick={() => setSchemaTypeValue(EntitySchemaTypes.USER_ENTITY)}
          sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='success' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Icon icon='tabler:user' />
            </CustomAvatar>
            <div>
              <Typography>A user type or archetype</Typography>
              <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                eg: staff, other company staff, patient, client, ...
              </Typography>
            </div>
          </Box>
          <Radio
            value={EntitySchemaTypes.USER_ENTITY}
            onChange={handleChangeSchemaType}
            checked={schemaTypeValue === EntitySchemaTypes.USER_ENTITY}
          />
        </Box>

        {/* ONE_TO_MANY_ENTITY */}
        <Box
          onClick={() => setSchemaTypeValue(EntitySchemaTypes.ONE_TO_MANY_ENTITY)}
          sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='error' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Icon icon='tabler:code' />
            </CustomAvatar>
            <div>
              <Typography>A one to many relationship</Typography>
              <Typography variant='caption'>eg: userAddresses</Typography>
            </div>
          </Box>
          <Radio
            value={EntitySchemaTypes.ONE_TO_MANY_ENTITY}
            onChange={handleChangeSchemaType}
            checked={schemaTypeValue === EntitySchemaTypes.ONE_TO_MANY_ENTITY}
          />
        </Box>

        {/* RELATIONSHIP_ENTITY */}
        <Box
          onClick={() => setSchemaTypeValue(EntitySchemaTypes.RELATIONSHIP_ENTITY)}
          sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='error' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Icon icon='tabler:briefcase' />
            </CustomAvatar>
            <div>
              <Typography>A relationship between schemas</Typography>
              <Typography variant='caption'>eg: userProducts, companyInvoices, patientPathologies</Typography>
            </div>
          </Box>
          <Radio
            value={EntitySchemaTypes.RELATIONSHIP_ENTITY}
            onChange={handleChangeSchemaType}
            checked={schemaTypeValue === EntitySchemaTypes.RELATIONSHIP_ENTITY}
          />
        </Box>

        {/* SELECT_OPTIONS_ENTITY */}
        <Box
          onClick={() => setSchemaTypeValue(EntitySchemaTypes.SELECT_OPTIONS_ENTITY)}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='error' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Icon icon='tabler:menu' />
            </CustomAvatar>
            <div>
              <Typography>Simple list of selectable options</Typography>
              <Typography variant='caption'>eg: fruits [onions, carrots, apples]</Typography>
            </div>
          </Box>
          <Radio
            value={EntitySchemaTypes.SELECT_OPTIONS_ENTITY}
            onChange={handleChangeSchemaType}
            checked={schemaTypeValue === EntitySchemaTypes.SELECT_OPTIONS_ENTITY}
          />
        </Box>
      </Box>
    </div>
  );
};

export default TabDetails;
