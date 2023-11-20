// ** MUI Imports
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import MuiListSubheader, { ListSubheaderProps } from '@mui/material/ListSubheader';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Types
import { NavSectionTitle } from 'src/@core/layouts/types';
import { Settings } from 'src/@core/context/settingsContext';

// ** Custom Components Imports
import Translations from 'src/layouts/components/Translations';
import CanViewNavSectionTitle from 'src/layouts/components/acl/CanViewNavSectionTitle';

interface Props {
  navHover: boolean;
  settings: Settings;
  item: NavSectionTitle;
  collapsedNavWidth: number;
  navigationBorderWidth: number;
}

// ** Styled Components
const ListSubheader = styled((props: ListSubheaderProps) => <MuiListSubheader component='li' {...props} />)(
  ({ theme }) => ({
    lineHeight: 1,
    display: 'flex',
    position: 'static',
    marginTop: theme.spacing(3.5),
    paddingTop: theme.spacing(1.5),
    backgroundColor: 'transparent',
    paddingBottom: theme.spacing(1.5),
    transition: 'padding-left .25s ease-in-out',
  })
);

const VerticalNavSectionSpace = (props: Props) => {
  // ** Props
  const { item, navHover, settings, collapsedNavWidth, navigationBorderWidth } = props;

  // ** Vars
  const { navCollapsed } = settings;

  return (
    <CanViewNavSectionTitle navTitle={item}>
      <div style={{ marginTop: 10 }}>&nbsp;</div>
    </CanViewNavSectionTitle>
  );
};

export default VerticalNavSectionSpace;
