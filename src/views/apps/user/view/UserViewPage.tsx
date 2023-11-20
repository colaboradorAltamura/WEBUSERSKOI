// ** MUI Imports
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import Loader from 'src/@core/components/loader';
import { handleError } from 'src/@core/coreHelper';
import { useDynamics } from 'src/hooks/useDynamics';
import { getUser } from 'src/services/usersServices';

// ** Types
import { IUser } from 'src/types/users';

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft';
import UserViewRight from 'src/views/apps/user/view/UserViewRight';

type Props = {
  tab: string;
  userId: string;
};

const UserView = ({ tab, userId }: Props) => {
  // ** Hooks
  const dynamics = useDynamics();

  // ** State
  const [loading, setLoading] = useState<boolean>(false);

  const [user, setUser] = useState<IUser | null>(null);

  // ** Effectgs
  useEffect(() => {
    const doAsync = async () => {
      try {
        setLoading(true);

        const userResponse = await getUser(userId);

        setUser(userResponse);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        handleError(e);
      }
    };
    doAsync();
  }, [userId]);

  if (!user || loading) return <Loader />;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft user={user} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight tab={tab} user={user} />
      </Grid>
    </Grid>
  );
};

export default UserView;
