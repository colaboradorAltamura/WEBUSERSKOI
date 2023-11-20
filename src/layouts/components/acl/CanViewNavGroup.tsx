// ** React Imports
import { ReactNode, useContext } from 'react';

// ** Types
import { NavGroup, NavLink } from 'src/@core/layouts/types';

import { userCan } from './userCan';
import { useAuth } from 'src/hooks/useAuth';

interface Props {
  navGroup?: NavGroup;
  children: ReactNode;
}

const CanViewNavGroup = (props: Props) => {
  // ** Props
  const { children, navGroup } = props;

  // ** Hooks
  const auth = useAuth();

  const checkForVisibleChild = (arr: NavLink[] | NavGroup[]): boolean => {
    return arr.some((i: NavGroup) => {
      if (i.children) {
        return checkForVisibleChild(i.children);
      } else {
        const can = userCan(auth, i);

        return can;
      }
    });
  };

  const canViewMenuGroup = (item: NavGroup) => {
    const hasAnyVisibleChild = item.children && checkForVisibleChild(item.children);

    if (!(item.action && item.subject)) {
      return hasAnyVisibleChild;
    }

    const can = userCan(auth, item);

    return can && hasAnyVisibleChild;
  };

  if (navGroup && navGroup.auth === false) {
    return <>{children}</>;
  } else {
    return navGroup && canViewMenuGroup(navGroup) ? <>{children}</> : null;
  }
};

export default CanViewNavGroup;
