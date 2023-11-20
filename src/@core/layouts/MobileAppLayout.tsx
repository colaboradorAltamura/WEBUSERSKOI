// ** React Imports
import { useState } from 'react';

// ** MUI Imports
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig';

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types';

// ** Components
import AppBar from './components/vertical/appBar';
import Customizer from 'src/@core/components/customizer';
import Navigation from './components/vertical/navigation';
import Footer from './components/shared-components/footer';
import ScrollToTop from 'src/@core/components/scroll-to-top';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';

const VerticalLayoutWrapper = styled('div')({
  height: '100%',
  display: 'flex',
});

const MainContentWrapper = styled(Box)<BoxProps>({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
});

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

const MobileAppLayout = (props: LayoutProps) => {
  // ** Hooks
  const router = useRouter();
  const theme = useTheme();

  // ** Props
  const { hidden, settings, children, scrollToTop, footerProps, contentHeightFixed, verticalLayoutProps } = props;

  // ** Vars
  const { skin, navHidden, contentWidth } = settings;
  const navigationBorderWidth = skin === 'bordered' ? 1 : 0;
  const { navigationSize, disableCustomizer, collapsedNavigationSize, mode } = themeConfig;
  const navWidth = navigationSize;
  const collapsedNavWidth = collapsedNavigationSize;

  // ** States
  const [navVisible, setNavVisible] = useState<boolean>(false);

  // ** Toggle Functions
  const toggleNavVisibility = () => setNavVisible(!navVisible);

  const renderFooterItem = (label: string, icon: string, route: string | null) => {
    const isSelected = route ? router.asPath.toLowerCase().startsWith(route.toLowerCase()) : false;

    let color = theme.palette.text.disabled;
    if (isSelected) color = theme.palette.primary.main;

    return (
      <Box
        sx={{ display: 'flex', alignItems: 'center', verticalAlign: 'center' }}
        onClick={() => {
          if (route) router.push(route);
          else toggleNavVisibility();
        }}
      >
        <div
          style={{
            marginLeft: 'auto',
            // display: 'flex',
            marginRight: 'auto',
            flex: 'auto',
          }}
        >
          <Icon
            // color={color}
            icon={icon}
            fontSize={20}
            style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
          />
          <Typography variant='body2' sx={{ color }}>
            {label}
          </Typography>
        </div>
      </Box>
    );
  };
  const renderFooter = (props: any) => {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        {renderFooterItem('Cobrar', 'tabler:report-money', '/debtCollections')}
        {renderFooterItem('Pagos', 'tabler:report-search', '/cms/payments')}
        {renderFooterItem('Menu', 'tabler:menu', null)}
      </Box>
    );
  };

  return (
    <>
      <VerticalLayoutWrapper className='layout-wrapper'>
        {/* Navigation Menu */}
        {navHidden && !(navHidden && settings.lastLayout === 'horizontal') ? null : (
          <Navigation
            navWidth={navWidth}
            navVisible={navVisible}
            setNavVisible={setNavVisible}
            collapsedNavWidth={collapsedNavWidth}
            toggleNavVisibility={toggleNavVisibility}
            navigationBorderWidth={navigationBorderWidth}
            navMenuContent={verticalLayoutProps.navMenu.content}
            navMenuBranding={verticalLayoutProps.navMenu.branding}
            menuLockedIcon={verticalLayoutProps.navMenu.lockedIcon}
            verticalNavItems={verticalLayoutProps.navMenu.navItems}
            navMenuProps={verticalLayoutProps.navMenu.componentProps}
            menuUnlockedIcon={verticalLayoutProps.navMenu.unlockedIcon}
            afterNavMenuContent={verticalLayoutProps.navMenu.afterContent}
            beforeNavMenuContent={verticalLayoutProps.navMenu.beforeContent}
            {...props}
          />
        )}
        <MainContentWrapper
          className='layout-content-wrapper'
          sx={{ ...(contentHeightFixed && { maxHeight: '100vh' }) }}
        >
          {/* Content */}
          <ContentWrapper
            className='layout-page-content'
            sx={{
              ...(contentHeightFixed && {
                overflow: 'hidden',
                '& > :first-of-type': { height: '100%' },
              }),
              ...(contentWidth === 'boxed' && {
                mx: 'auto',
                '@media (min-width:1440px)': { maxWidth: 1440 },
                '@media (min-width:1200px)': { maxWidth: '100%' },
              }),
            }}
          >
            {children}
          </ContentWrapper>

          {/* Footer Component */}
          <Footer footerStyles={footerProps?.sx} footerContent={renderFooter} {...props} />
        </MainContentWrapper>
      </VerticalLayoutWrapper>

      {/* Scroll to top button */}
    </>
  );
};

export default MobileAppLayout;
