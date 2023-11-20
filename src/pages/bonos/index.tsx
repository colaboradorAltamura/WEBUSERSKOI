// ** React Imports
import { useEffect } from 'react';

import { useDynamics } from 'src/hooks/useDynamics';
import { IUser } from 'src/types/users';
import DynamicSchemaLayoutList from 'src/views/components/dynamics/DynamicSchemaLayoutList';

interface Props {
  user: IUser;
}

const PathologiesList = ({ user }: Props) => {
  // ** Hooks
  const dynamics = useDynamics();

  const onSubmit = (formData: any) =>
    new Promise((resolve, reject) => {
      alert('ON SUBMIT TTTTT');

      console.log(formData);
      resolve(null);
    });

  return <DynamicSchemaLayoutList parentEntitySchema={null} parentEntityData={null} schemaName={'bonos'} />;
};

export default PathologiesList;
