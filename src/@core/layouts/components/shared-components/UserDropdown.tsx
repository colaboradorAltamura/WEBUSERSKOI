// ** React Imports
import { Fragment, SyntheticEvent, useState } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** MUI Imports
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';
// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext';

// ** Hooks
import { useAuth } from 'src/hooks/useAuth';
import { useCurrentUser } from 'src/hooks/useCurrentUser';

interface Props {
  saveSettings: (values: Settings) => void;
  settings: Settings;
}

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}));

const MenuItemStyled = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  '&:hover .MuiBox-root, &:hover .MuiBox-root svg': {
    color: theme.palette.primary.main,
  },
}));

const UserDropdown = (props: Props) => {
  // ** Props
  const { settings, saveSettings } = props;

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  // ** Hooks
  const router = useRouter();
  const auth = useAuth();
  const currentUser = useCurrentUser();

  // ** Vars
  const { direction } = settings;

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url);
    }
    setAnchorEl(null);
  };

  const styles = {
    px: 4,
    py: 1.75,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2.5,
      fontSize: '1.5rem',
      color: 'text.secondary',
    },
  };

  const handleLogout = () => {
    auth.logout();
    handleDropdownClose();
  };

  const handleSwitchCurrentRol = (targetRol: string) => {
    saveSettings({ ...settings, currentRole: targetRol });
    const win = window as any;
    win.location = '/';
  };

  if (!auth || !auth.user) return null;
  const fullName = auth.user.displayName;
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];

  return (
    <Fragment>
      <Box
        onClick={handleDropdownOpen}
        sx={{
          ml: 2,
          display: 'flex',
          cursor: 'pointer',
          p: 2,
          borderRadius: '6px',
          transform: 'translateY(0)',
          transition: 'background-color 0.3s ease, transform 0.3s ease',
          '&:hover': {
            backgroundColor: (theme) => hexToRGBA(theme.palette.primary.main, 0.5),
            transform: 'translateY(-2px)',
          },
        }}
      >
        <Badge
          overlap='circular'
          badgeContent={<BadgeContentSpan />}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <Avatar
            alt={auth.user.displayName}
            src={auth.user.avatar ? auth.user.avatar : '/images/avatars/default-avatar.png'}
            onClick={handleDropdownOpen}
            sx={{ width: 28, height: 28 }}
          />
        </Badge>
        <Box sx={{ display: 'flex', ml: 2.5, flexDirection: 'column', alignItems: 'center', marginTop: '2px' }}>
          <Typography sx={{ fontWeight: 500 }}>{firstName}</Typography>
          {/* <Typography variant='body2'>Admin</Typography> */}
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4.75 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ py: 1.75, px: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <Avatar
                alt={auth.user.displayName}
                src={auth.user.avatar ? auth.user.avatar : '/images/avatars/default-avatar.png'}
                sx={{ width: '2.5rem', height: '2.5rem' }}
              />
            </Badge>
            <Box sx={{ display: 'flex', ml: 2.5, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 500 }}>{auth.user.displayName}</Typography>
              {/* <Typography variant='body2'>Admin</Typography> */}
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: (theme) => `${theme.spacing(2)} !important` }} />
        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('/user-profile')}>
          <Box sx={styles}>
            <Icon icon='tabler:user-check' />
            My Profile
          </Box>
        </MenuItemStyled>

        {!currentUser.isLoading && currentUser.currentUser && currentUser.currentUser.userDefinedRols && (
          <>
            <Divider sx={{ my: (theme) => `${theme.spacing(2)} !important` }} />
            Your Rols
            {currentUser.currentUser.userDefinedRols.map((rol, index) => {
              return (
                <MenuItemStyled
                  key={index}
                  sx={{ p: 0 }}
                  onClick={() => {
                    handleSwitchCurrentRol(rol);
                    setAnchorEl(null);
                  }}
                >
                  <Box sx={styles}>
                    <Icon icon='tabler:settings' />
                    {rol}
                  </Box>
                  {rol === settings.currentRole && <>{'<<'}</>}
                </MenuItemStyled>
              );
            })}
          </>
        )}

        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/help-center')}>
          <Box sx={styles}>
            <Icon icon='tabler:lifebuoy' />
            Help
          </Box>
        </MenuItemStyled>
        {/* <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/faq')}>
          <Box sx={styles}>
            <Icon icon='tabler:info-circle' />
            FAQ
          </Box>
        </MenuItemStyled> */}
        {/* <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/pricing')}>
          <Box sx={styles}>
            <Icon icon='tabler:currency-dollar' />
            Pricing
          </Box>
        </MenuItemStyled> */}
        <Divider sx={{ my: (theme) => `${theme.spacing(2)} !important` }} />
        <MenuItemStyled sx={{ p: 0 }} onClick={handleLogout}>
          <Box sx={styles}>
            <Icon icon='tabler:logout' />
            Sign Out
          </Box>
        </MenuItemStyled>
      </Menu>
    </Fragment>
  );
};

export default UserDropdown;
