// ** Next Import
import Link from 'next/link';

// ** MUI Imports
import Box from '@mui/material/Box';
import { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

const StyledCompanyName = styled(Link)(({ theme }) => ({
  fontWeight: 500,
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`,
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.text.secondary} !important`,
  '&:hover': {
    color: `${theme.palette.primary.main} !important`,
  },
}));

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2, display: 'flex', color: 'text.secondary' }}>
        {`© ${new Date().getFullYear()}, Made with `}
        <Box component='span' sx={{ mx: 1, color: 'error.main' }}>
          ❤️
        </Box>
        {`by`}
        <Typography sx={{ ml: 1 }} target='_blank' href='https://koiventures.tech' component={StyledCompanyName}>
          Koi Ventures
        </Typography>
      </Typography>
      {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          <Typography target='_blank' component={LinkStyled} href='https://koiventures.tech'>
            Support
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FooterContent;