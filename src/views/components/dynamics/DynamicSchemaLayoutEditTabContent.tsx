// ** React Imports

// ** Next Import

// ** MUI Imports
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import Loader from 'src/@core/components/loader';
import { handleError } from 'src/@core/coreHelper';
import { getEntitySchemaByName, listEntitySchemaFields } from 'src/services/entitiesSchemasServices';

// ** Icon Imports

// ** Demo Components Imports

// import UserViewConnection from 'src/views/apps/user/view/UserViewConnection';
// import UserViewNotification from 'src/views/apps/user/view/UserViewNotification';

// ** Types
import { ILayoutPanel } from 'src/types/dynamics';
import { IEntitySchema, IEntitySchemaField } from 'src/types/entities';
import DynamicSchemaLayoutList from './DynamicSchemaLayoutList';
import { useDynamics } from 'src/hooks/useDynamics';

interface PropsType {
  panel: ILayoutPanel;
  docId: string;
  parentEntitySchema?: IEntitySchema;
  parentEntityData?: any;
}

const DynamicSchemaLayoutEditTabContent = ({ panel, parentEntitySchema, parentEntityData }: PropsType) => {
  // ** Hooks
  const dynamics = useDynamics();

  // ** State
  const [entitySchema, setEntitySchema] = useState<IEntitySchema | undefined>(panel.schema);
  const [entitySchemaFields, setEntitySchemaFields] = useState<IEntitySchemaField[]>([]);

  const [loadingSchema, setLoadingSchema] = useState<boolean>(true);

  // ** Effects
  useEffect(() => {
    const doAsync = async () => {
      try {
        if (!entitySchema || !dynamics.entitySchemas || !dynamics.entitySchemasFields) return;

        setLoadingSchema(true);
        // const response = await dynamicGet({ params: '/cms/' + schemaName });

        // Fetch Schema
        // const entitySchemaResponse = (await getEntitySchemaByName(panel.dynamicSchemaId)) as IEntitySchemaWithFields;

        // setEntitySchema(entitySchemaResponse);

        // Fetch Fields
        // const entitySchemaFieldsResponse = await listEntitySchemaFields(entitySchema.id);

        const schemaFields = dynamics.entitySchemasFields.filter((field) => {
          return field.schemaId === entitySchema.id;
        });

        setEntitySchemaFields(schemaFields);

        setLoadingSchema(false);
      } catch (e: any) {
        handleError(e);
        setLoadingSchema(false);
      }
    };

    doAsync();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entitySchema]);

  if (loadingSchema) return <Loader />;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DynamicSchemaLayoutList
          parentEntitySchema={parentEntitySchema}
          parentEntityData={parentEntityData}
          schemaName={entitySchema ? entitySchema.name : ''}
          useCmsRoutes={true}
        />
      </Grid>
    </Grid>
  );
};

export default DynamicSchemaLayoutEditTabContent;
