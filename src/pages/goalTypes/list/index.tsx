// ** React Imports
import { useEffect } from 'react';

import { useDynamics } from 'src/hooks/useDynamics';
import { IUser } from 'src/types/users';
import DynamicSchemaLayoutList from 'src/views/components/dynamics/DynamicSchemaLayoutList';

interface Props {
  user: IUser;
}

const goalTypeList = ({ user }: Props) => {
  return <DynamicSchemaLayoutList parentEntitySchema={null} parentEntityData={null} schemaName={'goalTypes'} />;
};

export default goalTypeList;
