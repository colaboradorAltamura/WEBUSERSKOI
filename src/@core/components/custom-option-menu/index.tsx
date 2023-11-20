// ** React Imports
import { MouseEvent, useState, ReactNode } from 'react';

// ** Next Import
import Link from 'next/link';

// ** MUI Imports
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Type Imports
import { OptionType, OptionMenuItemType } from './types';
import { OptionsMenuCustomType } from './types';

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings';
import { Typography } from '@mui/material';

const MenuItemWrapper = ({ children, option }: { children: ReactNode; option: OptionMenuItemType }) => {
  if (option.href) {
    return (
      <Box
        component={Link}
        href={option.href}
        {...option.linkProps}
        sx={{
          px: 4,
          py: 1.5,
          width: '100%',
          display: 'flex',
          color: 'inherit',
          alignItems: 'center',
          textDecoration: 'none',
        }}
      >
        {children}
      </Box>
    );
  } else {
    return <>{children}</>;
  }
};

const OptionsMenuCustom = (props: OptionsMenuCustomType) => {
  // ** Props
  const { options, menuProps, leftAlignMenu, iconButtonProps, label, imagen } = props;

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // ** Hook & Var
  const { settings } = useSettings();
  const { direction } = settings;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton aria-haspopup='true' sx={{ m: 2, borderRadius: '10%' }} onClick={handleClick} {...iconButtonProps}>
        <img style={{ borderRadius: '20%' }} width='25px' alt={label} src={imagen} />

        <Typography sx={{ mt: 1, ml: 2 }}>{label}</Typography>
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        onClose={handleClose}
        open={Boolean(anchorEl)}
        {...(!leftAlignMenu && {
          anchorOrigin: { vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' },
          transformOrigin: { vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' },
        })}
        {...menuProps}
      >
        {options.map((option: OptionType, index: number) => {
          if (typeof option === 'string') {
            return (
              <MenuItem key={index} onClick={handleClose}>
                {option}
              </MenuItem>
            );
          } else if ('divider' in option) {
            return option.divider && <Divider key={index} {...option.dividerProps} />;
          } else {
            return (
              <MenuItem
                key={index}
                {...option.menuItemProps}
                {...(option.href && { sx: { p: 0 } })}
                onClick={(e) => {
                  handleClose();
                  option.menuItemProps && option.menuItemProps.onClick ? option.menuItemProps.onClick(e) : null;
                }}
              >
                <MenuItemWrapper option={option}>
                  {option.icon ? option.icon : null}
                  {option.text}
                </MenuItemWrapper>
              </MenuItem>
            );
          }
        })}
      </Menu>
    </>
  );
};

export default OptionsMenuCustom;
