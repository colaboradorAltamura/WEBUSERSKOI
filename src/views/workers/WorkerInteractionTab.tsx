// ** MUI Imports
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
// ** Custom Components Imports
import { useState } from 'react';
import { handleError, hasRole } from 'src/@core/coreHelper';
import { IEntitySchema, IEntitySchemaField } from 'src/types/entities';
import { CMSCollections, IAddress, IUsersAddress, IWorker } from 'src/types/@autogenerated';
import { useDynamics } from 'src/hooks/useDynamics';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import Loader from 'src/@core/components/loader';
import { dynamicUpdate } from 'src/services/entitiesDynamicServices';
import AddressRadioDistance from '../address/radioDistance';

import UserInteractions from '../userInteractions';

interface PropsType {
  docId: string;
  schemaArg: IEntitySchema;
  workerDataArg: IWorker;
  schemaFieldsArg: IEntitySchemaField[];
  // primaryAddressArg: IUsersAddress | null;
  onUpdateWorker: () => Promise<any>;
}

const WorkerInteractionTab = ({ docId, schemaArg, workerDataArg, schemaFieldsArg, onUpdateWorker }: PropsType) => {
  // ** Hooks
  const dynamics = useDynamics();
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const win: any = window;

  // ** State
  const [workerSchema, setWorkerSchema] = useState<IEntitySchema>(schemaArg);
  const [workerData, setWorkerData] = useState<IWorker>(workerDataArg);
  const [workerSchemaFields, setWorkerSchemaFields] = useState<IEntitySchemaField[]>(schemaFieldsArg);
  // const [addressData, setAddressData] = useState<IUsersAddress | null>(primaryAddressArg);
  const [loading, setLoading] = useState<boolean>(false);

  const saveLocation = async (addressForm: IAddress, maxDistanceForm: number) => {
    try {
      setLoading(true);
      // if (!addressData) return;

      const itemValues = { ...workerData };
      // const addressValues = { ...addressData };

      itemValues.maxDistance = maxDistanceForm;
      // addressValues.address = addressForm;

      await updateWorker(itemValues);
      // await updateAddressEntity(addressValues);
      onUpdateWorker();

      setLoading(false);
    } catch (e) {
      setLoading(false);
      handleError(e);
    }
  };

  const updateWorker = async (formData: IWorker) => {
    let response = null;

    response = await dynamicUpdate({
      params: `/cms/${CMSCollections.WORKERS}/mine/` + docId,
      data: formData,
    });
  };

  const updateAddressEntity = async (formData: IUsersAddress) => {
    let response = null;

    console.log(formData);

    response = await dynamicUpdate({
      params: '/cms/' + CMSCollections.USERS_ADDRESSES + '/mine/' + formData.id,
      data: formData,
    });
  };

  if (loading) return <Loader />;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserInteractions
          // docId, schemaArg, dataArg, schemaFieldsArg, onUpdatePatient
          docId={docId}
          schemaArg={workerSchema}
          dataArg={workerData}
          schemaFieldsArg={workerSchemaFields}
          // onUpdatePatient={onUpdateWorker}
        />
        {/* <AddressRadioDistance
          primaryAddress={addressData?.address ?? null}
          defaultDistance={workerData.maxDistance ?? 0}
          onSaveLocation={saveLocation}
        /> */}
      </Grid>
    </Grid>
  );
};

export default WorkerInteractionTab;
