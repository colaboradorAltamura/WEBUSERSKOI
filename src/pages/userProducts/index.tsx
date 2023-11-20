// ** React Imports
import { useEffect } from 'react';
import Loader from 'src/@core/components/loader';
import { USERS_SCHEMA } from 'src/@core/coreHelper';
import { useCurrentUser } from 'src/hooks/useCurrentUser';

import { useDynamics } from 'src/hooks/useDynamics';
import { IEntitySchema } from 'src/types/entities';
import { IUser } from 'src/types/users';
import DynamicSchemaLayoutList from 'src/views/components/dynamics/DynamicSchemaLayoutList';

interface Props {
  user: IUser;
}

const UserProductsList = ({ user }: Props) => {
  // ** Hooks
  const dynamics = useDynamics();
  const currentUserContext = useCurrentUser();

  if (currentUserContext.isLoading) return <Loader />;

  return (
    <DynamicSchemaLayoutList
      parentEntitySchema={USERS_SCHEMA}
      parentEntityData={currentUserContext.currentUser}
      schemaName={'userProducts'}
    />
  );
};

export default UserProductsList;
