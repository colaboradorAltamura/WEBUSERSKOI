// ** React Imports
import { ReactNode } from 'react';

// ** Types
import { NavLink } from 'src/@core/layouts/types';
import { useAuth } from 'src/hooks/useAuth';
import { userCan } from './userCan';

interface Props {
  navLink?: NavLink;
  children: ReactNode;
}

const CanViewNavLink = (props: Props) => {
  // ** Props
  const { children, navLink } = props;

  // ** Hooks
  const auth = useAuth();

  const can = userCan(auth, navLink);

  return can ? <>{children}</> : null;
};

export default CanViewNavLink;
