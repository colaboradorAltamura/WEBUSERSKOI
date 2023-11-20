import { AuthValuesType } from 'src/context/types';
import { AppRols } from 'src/types/appRols';

export const userCan = (auth: AuthValuesType, menuProp: any) => {
  // el menu no requiere nada, es publico
  if (menuProp && menuProp.auth === false) return true;

  // el usuario es admin
  if (auth.user && auth.user.appRols && auth.user.appRols.includes(AppRols.APP_ADMIN)) return true;

  // el menu no requiere nada
  if (!menuProp || (!menuProp.appRols && !menuProp.orgRols && !menuProp.udRols)) return true;

  // DENIED: el usuario no esta autenticado
  if (!auth.user) return false;

  let allowed =
    menuProp.appRols &&
    menuProp.appRols.find((item: string) => {
      return auth.user?.appRols?.includes(item);
    });

  if (allowed) return true;

  allowed =
    menuProp.orgRols &&
    menuProp.orgRols.find((item: string) => {
      return auth.user?.orgRols?.includes(item);
    });

  if (allowed) return true;

  allowed =
    menuProp.udRols &&
    menuProp.udRols.find((item: string) => {
      return auth.user?.userDefinedRols?.includes(item);
    });

  if (allowed) return true;

  return false;
};
