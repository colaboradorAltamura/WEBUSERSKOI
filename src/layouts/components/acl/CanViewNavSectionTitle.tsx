// ** React Imports
import { ReactNode, useContext } from 'react';

// ** Types
import { NavSectionTitle } from 'src/@core/layouts/types';
import { useAuth } from 'src/hooks/useAuth';
import { userCan } from './userCan';

interface Props {
  children: ReactNode;
  navTitle?: NavSectionTitle;
}

const CanViewNavSectionTitle = (props: Props) => {
  // ** Props
  const { children, navTitle } = props;

  // ** Hook
  const auth = useAuth();

  if (navTitle && navTitle.auth === false) {
    return <>{children}</>;
  } else {
    const can = userCan(auth, navTitle);

    return can ? <>{children}</> : null;
  }
};

export default CanViewNavSectionTitle;
