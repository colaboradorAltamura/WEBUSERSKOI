// ** React Imports
import { useState, ChangeEvent, useEffect } from 'react';

// ** MUI Imports
import MenuItem from '@mui/material/MenuItem';

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Custom Avatar Component
import CustomAvatar from 'src/@core/components/mui/avatar';
import { listEntitiesSchemas } from 'src/services/entitiesSchemasServices';
import { handleError } from 'src/@core/coreHelper';
import Loader from 'src/@core/components/loader';
import { IEntitySchema } from 'src/types/entities';

interface PropsType {
  onSourceSchemaChange: (schemaId: string) => void;
  onTargetSchemaChange: (schemaId: string) => void;
}

const DialogTabSchemaFields = ({ onSourceSchemaChange, onTargetSchemaChange }: PropsType) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [schemas, setSchemas] = useState<IEntitySchema[]>([]);

  const [selectedSourceSchema, setSelectedSourceSchema] = useState<string>('');
  const [selectedTargetSchema, setSelectedTargetSchema] = useState<string>('');

  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const doAsync = async () => {
      try {
        setLoading(true);

        const result = await listEntitiesSchemas();

        setLoading(false);

        setSchemas(result.items);
      } catch (e) {
        setLoading(false);
        handleError(e);
      }
    };
    doAsync();
  }, []);

  useEffect(() => {
    if (onSourceSchemaChange) onSourceSchemaChange(selectedSourceSchema);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSourceSchema]);

  useEffect(() => {
    if (onTargetSchemaChange) onTargetSchemaChange(selectedTargetSchema);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTargetSchema]);
  if (loading) return <Loader />;

  return (
    <div>
      <CustomTextField
        required={true}
        select
        fullWidth
        label={'Source'}
        placeholder={'eg: products'}
        value={selectedSourceSchema}
        onChange={(event) => {
          setSelectedSourceSchema(event.target.value);
        }}
      >
        {!!options &&
          options.map((op, index) => {
            return (
              <MenuItem key={index} value={op.value}>
                {/* <em>None</em> */}
                {op.label}
              </MenuItem>
            );
          })}
      </CustomTextField>
      <CustomTextField
        required={true}
        select
        fullWidth
        label={'Target'}
        placeholder={'eg: subProducts'}
        value={selectedTargetSchema}
        onChange={(event) => {
          setSelectedTargetSchema(event.target.value);
        }}
      >
        {!!options &&
          options.map((op, index) => {
            return (
              <MenuItem key={index} value={op.value}>
                {/* <em>None</em> */}
                {op.label}
              </MenuItem>
            );
          })}
      </CustomTextField>
    </div>
  );
};

export default DialogTabSchemaFields;
