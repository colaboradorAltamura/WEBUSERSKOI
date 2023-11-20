// ** React Imports
import { useState, useEffect } from 'react';

// ** MUI Components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

// ** Third Party Imports
import axios from 'axios';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Types
import { ProfileHeaderType } from 'src/types';
import { IUser } from 'src/types/users';
import { parseDateToShortString } from 'src/@core/coreHelper';
import { useAuth } from 'src/hooks/useAuth';

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 108,
  height: 108,
  borderRadius: theme.shape.borderRadius,
  border: `4px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4),
  },
}));

const UserProfileHeader = ({ user }: { user: IUser }) => {
  const auth = useAuth();

  // ** State
  const [defaultAvatarUrl, setDefaultAvatarUrl] = useState<string>('/images/avatars/default-avatar.png');
  const designationIcon = 'tabler:briefcase';

  useEffect(() => {
    if (auth.user && auth.user.avatar) setDefaultAvatarUrl(auth.user.avatar);
  }, [auth.user]);

  return (
    <Card>
      <CardMedia
        component='img'
        alt='profile-header'
        image={'/images/banners/banner-7.jpg'}
        sx={{
          height: { xs: 150, md: 250 },
        }}
      />
      <CardContent
        sx={{
          pt: 0,
          mt: -8,
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: { xs: 'center', md: 'flex-start' },
        }}
      >
        <ProfilePicture src={user.avatarUrl ? user.avatarUrl : defaultAvatarUrl} alt='profile-picture' />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            ml: { xs: 0, md: 6 },
            alignItems: 'flex-end',
            flexWrap: ['wrap', 'nowrap'],
            justifyContent: ['center', 'space-between'],
          }}
        >
          <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
            <Typography variant='h5' sx={{ mb: 2.5 }}>
              {user.firstName + ' ' + user.lastName}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: ['center', 'flex-start'],
              }}
            >
              {user.userDefinedRols.map((rol, index) => {
                return (
                  <Box
                    key={index}
                    sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}
                  >
                    <Icon fontSize='1.25rem' icon={designationIcon} />
                    <Typography sx={{ color: 'text.secondary' }}>{rol}</Typography>
                  </Box>
                );
              })}

              <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <Icon fontSize='1.25rem' icon='tabler:calendar' />
                <Typography sx={{ color: 'text.secondary' }}>
                  Joined {parseDateToShortString(user.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserProfileHeader;
