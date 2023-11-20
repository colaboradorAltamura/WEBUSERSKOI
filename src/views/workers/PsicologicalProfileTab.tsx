// ** MUI Imports
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';

import { useTranslation } from 'react-i18next';

import { Button, capitalize } from '@mui/material';
import { useEffect, useState } from 'react';
import TextInfo from 'src/@core/components/custom-text-info';
import { getSourceEntityData, handleError, nameof, parseDateToShortString } from 'src/@core/coreHelper';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { useDynamics } from 'src/hooks/useDynamics';
import { IForm } from 'src/types/dynamics';
import { IEntitySchema, IEntitySchemaField, IEntitySchemaWithFields } from 'src/types/entities';
import DynamicFormSidebar from '../components/dynamics/DynamicFormSidebar';
import { getEditEntityForm, schemaToForm, updateEntityDataBySchema } from '../components/dynamics/helpers';
import { CMSCollections, IWorker, IWorkerPsicologicalProfile } from 'src/types/@autogenerated';
import { dynamicCreate, dynamicGet, dynamicUpdate } from 'src/services/entitiesDynamicServices';
import { IUser } from 'src/types/users';

interface PropsType {
  docId: string;
  schemaArg: IEntitySchema;
  workerDataArg: IWorker;
  schemaFieldsArg: IEntitySchemaField[];
  onUpdateWorker: () => Promise<any>;
}

const PsicologicalProfileTab = ({
  docId,
  schemaArg,
  workerDataArg,
  schemaFieldsArg,
  onUpdateWorker: onUpdateWorker,
}: PropsType) => {
  // ** Hooks
  const dynamics = useDynamics();
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  // ** State
  const [entitySchema, setEntitySchema] = useState<IEntitySchema>();
  const [entitySchemaFields, setEntitySchemaFields] = useState<IEntitySchemaField[]>();
  const [psicologicalProfileData, setPsicologicalProfileData] = useState<IWorkerPsicologicalProfile>();
  const [editEntityForm, setEditEntityForm] = useState<IForm | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [loadingSchema, setLoadingSchema] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(true);

  const [editSidebarOpen, setEditSidebarOpen] = useState<boolean>(false);

  const toggleEditDrawer = () => setEditSidebarOpen(!editSidebarOpen);

  // **

  // ** Effects
  useEffect(() => {
    const doAsync = async () => {
      try {
        if (dynamics.isLoadingSchemas || !dynamics.entitySchemas || !dynamics.entitySchemasFields) return null;

        setLoadingSchema(true);
        const schema = dynamics.entitySchemas.find((schema) => {
          return schema.name === CMSCollections.WORKER_PSICOLOGICAL_PROFILE;
        });
        if (!schema) throw new Error('Missing schemaName: ' + CMSCollections.WORKER_PSICOLOGICAL_PROFILE);
        const schemaFields = dynamics.entitySchemasFields.filter((field) => {
          return field.schemaId === schema.id;
        });

        const entitySchemaResponse: IEntitySchemaWithFields = { ...schema, fields: schemaFields };

        setEntitySchema(entitySchemaResponse);

        setEntitySchemaFields(entitySchemaResponse.fields);

        setLoadingSchema(false);
      } catch (e: any) {
        handleError(e);
        setLoadingSchema(false);
      }
    };

    doAsync();
  }, []);

  // ** Effects
  useEffect(() => {
    const doAsync = async () => {
      try {
        setLoadingData(true);

        // getting psicological profile by worker Id
        const data: any = await dynamicGet({
          params:
            '/cms/' +
            CMSCollections.WORKER_PSICOLOGICAL_PROFILE +
            '/by-prop/' +
            nameof<IWorkerPsicologicalProfile>('workerId') +
            '/' +
            docId, // by worker id
        });

        console.log(data);
        if (data && data.items[0]) {
          setPsicologicalProfileData(data.items[0]);
          setIsCreating(false);
        }

        setLoadingData(false);
      } catch (e: any) {
        handleError(e);
        setLoadingSchema(false);
      }
    };

    doAsync();
  }, []);
  const handleOnEntityEdit = () => {
    try {
      if (!entitySchema || !entitySchemaFields) throw new Error('missing entitySchema/entitySchemaFields');

      const fieldsNames = [
        nameof<IWorkerPsicologicalProfile>('evaluationStatus'),
        nameof<IWorkerPsicologicalProfile>('psicologicalProfileDate'),
        nameof<IWorkerPsicologicalProfile>('observations'),
      ];

      const toShowFields = entitySchemaFields.filter((field) => {
        return fieldsNames.includes(field.name);
      });
      const theForm = schemaToForm(schemaArg, toShowFields, null, dynamics);
      setEditEntityForm(theForm);

      setEditSidebarOpen(true);
    } catch (e: any) {
      handleError(e);
    }
  };

  const handleOnEditSubmit = async (formData: any) => {
    try {
      setLoadingData(true);

      if (!entitySchema || !currentUser.currentUser || !entitySchemaFields)
        throw new Error('Missing entitySchema/currentUser.currentUser/entitySchemaFields');

      const itemValues = { ...formData };
      itemValues['evaluatorId'] = currentUser.currentUser.id;
      itemValues['workerId'] = docId;

      if (isCreating || !itemValues.id) {
        //creates doc
        const response = await dynamicCreate({
          params: `/cms/${CMSCollections.WORKER_PSICOLOGICAL_PROFILE}/`,
          data: itemValues,
        });
      } else {
        const response = await dynamicUpdate({
          params: `/cms/${CMSCollections.WORKER_PSICOLOGICAL_PROFILE}/` + itemValues.id,
          data: itemValues,
        });
      }

      // cierro sidebar
      setEditSidebarOpen(false);

      await onUpdateWorker();

      // apago loading
      setLoadingData(false);
    } catch (e) {
      setLoadingData(false);
      handleError(e);
    }
  };

  const getEvaluatorName = (psicologicalProfile: IWorkerPsicologicalProfile | undefined) => {
    if (!psicologicalProfile) return;

    const sourceData = getSourceEntityData({
      obj: psicologicalProfile,
      key: nameof<IWorkerPsicologicalProfile>('evaluatorId'),
    });

    if (!sourceData) return;

    return sourceData as IUser;
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={capitalize(t('psicological evaluation'))}
            action={
              <Button
                variant='contained'
                onClick={() => {
                  handleOnEntityEdit();
                }}
                sx={{ mr: 4, mb: [2, 0] }}
              >
                {capitalize(t('edit'))}
              </Button>
            }
          />
          <CardContent>
            <Grid container spacing={0}>
              <Grid item xs={12} md={6}>
                <TextInfo
                  title={'date'}
                  value={parseDateToShortString(psicologicalProfileData?.psicologicalProfileDate)}
                ></TextInfo>
                <TextInfo
                  title={'evaluator'}
                  value={`${getEvaluatorName(psicologicalProfileData)?.firstName} ${
                    getEvaluatorName(psicologicalProfileData)?.lastName
                  }`}
                ></TextInfo>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextInfo title={'state'} value={psicologicalProfileData?.evaluationStatus}></TextInfo>
              </Grid>
              <Grid item xs={12} md={12}>
                <TextInfo title={'observations'} value={psicologicalProfileData?.observations}></TextInfo>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {!!editSidebarOpen && (
          <DynamicFormSidebar
            isCreating={false}
            onSubmit={handleOnEditSubmit}
            title={'Edit ' + entitySchema?.name}
            formId={'Edit_' + entitySchema?.name}
            initialValues={psicologicalProfileData}
            preloadForm={editEntityForm}
            open={editSidebarOpen}
            toggle={toggleEditDrawer}
            onSubmitDone={() => {
              toggleEditDrawer();

              return Promise.resolve();
            }}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default PsicologicalProfileTab;