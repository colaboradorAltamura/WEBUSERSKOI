import { authRef } from 'src/configs/firebase';
import { EntitySchemaTypes, IEntitySchema, IUserRol } from 'src/types/entities';
import Swal from 'sweetalert2';

const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const monthLongNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const DAY_OF_WEEK_SHORT_NAMES = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
export const DAY_OF_WEEK_LONG_NAMES = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

export const FORM_OPTIONS_PRELOAD_SUFFIX = 'PreloadOptions';
export const CONDITIONAL_RENDER_NON_EMPTY_STRING = '*';

export const DISTANCE_OPTIONS = [
  { label: '1 km', value: '1', raw: null },
  { label: '5 km', value: '5', raw: null },
  { label: '10 km', value: '10', raw: null },
  { label: '20 km', value: '20', raw: null },
  { label: '50 km', value: '50', raw: null },
];

const deg2rad = (deg: any) => {
  return deg * (Math.PI / 180);
};

export const getDistanceFromLatLonInKm = (lat1: any, lon1: any, lat2: any, lon2: any) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km

  return d;
};

export const calculateAge = (date: any) => {
  const today = new Date();
  const birthDateFormated = new Date(date);

  if (birthDateFormated.getDate()) {
    //if a valid date
    let age = today.getFullYear() - birthDateFormated.getFullYear();
    if (age > 0) {
      if (birthDateFormated.getMonth() > today.getMonth() || birthDateFormated.getDay() > today.getDay()) age--;
    } else {
      age = today.getMonth() - birthDateFormated.getMonth();

      return `${age} ${age > 1 ? 'months' : 'month'}`;
    }

    return `${age} ${age > 1 ? 'years' : 'year'}`;
  }

  return '-';
};

export const getUserWithToken = function () {
  return new Promise((resolve, reject) => {
    authRef.onAuthStateChanged((user) => {
      if (!user) resolve(null);
      else
        user
          .getIdToken()
          .then((token) => {
            resolve({ token, user });
          })
          .catch((e) => {
            reject(e);
          });
    });
  });
};

export const refreshUserToken = () => {
  return authRef?.currentUser?.getIdToken(true);
};

export const createNestedObject = function (base: any, names: any, value: any) {
  const namesAux = [...names];

  // If a value is given, remove the last name and keep it for later:
  const lastName = arguments.length === 3 ? namesAux.pop() : false;

  // Walk the hierarchy, creating new objects where needed.
  // If the lastName was removed, then the last object is not set yet:
  for (let i = 0; i < namesAux.length; i++) {
    base = base[namesAux[i]] = base[namesAux[i]] || {};
  }

  // If a value was given, set it to the last name:
  if (lastName) base = base[lastName] = value;

  // Return the last object in the hierarchy:
  return base;
};

export const toDateObject = function (dirtyDate: any) {
  if (!dirtyDate) return null;

  if (dirtyDate instanceof Date) return dirtyDate;

  if (dirtyDate._seconds) return new Date(dirtyDate._seconds * 1000);
  else if (typeof dirtyDate === 'string') return new Date(dirtyDate);

  return null;
};

export const dateToShortString = function (date: any) {
  if (!date) return '';

  return date.toLocaleDateString('en-GB');
};

export const parseDateToShortString = function (date: any) {
  const dateObj = toDateObject(date);

  if (!dateObj) return '';

  return dateToShortString(dateObj);
};

export const parseDateToDateTimeString = function (date: any) {
  const dateObj = toDateObject(date);

  if (!dateObj) return '';

  const dateString = dateToShortString(dateObj);

  return `${dateString} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

export const parseDateToTimeString = function (date: any) {
  const dateObj = toDateObject(date);

  if (!dateObj) return '';

  return `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
};
export const getDayOfWeekShortName = function (date: any) {
  return DAY_OF_WEEK_SHORT_NAMES[date.getUTCDay()];
};

export const getMonthShortName = function (date: any) {
  return monthShortNames[date.getUTCMonth()];
};

export const getMonthLongName = function (date: any) {
  return monthLongNames[date.getUTCMonth()];
};

export const MULTIPLE_RELATIONSHIP_SUFFIX = '_SOURCE_ENTITIES';
export const RELATIONSHIPS_PROP_NAME = '@dependencies';

// eg: obj: { userId: 'bla', otherProps: '', userId_SOURCE_ENTITIES: [{ id: 'bla' } ]}, key: 'userId'
export const getSourceEntityData = function ({ obj, key }: any) {
  if (!obj) return null;

  const objPropValue = obj[key];

  if (!objPropValue) return null;

  const objPropList = obj[RELATIONSHIPS_PROP_NAME]
    ? obj[RELATIONSHIPS_PROP_NAME][key + MULTIPLE_RELATIONSHIP_SUFFIX]
    : null;

  if (!objPropList) return null;

  if (Array.isArray(objPropValue)) {
    return objPropList.filter((item: any) => {
      return objPropValue.find((item2) => {
        return item2 === item.id;
      });
    });
  } else {
    return objPropList.find((item: any) => {
      return item.id === objPropValue;
    });
  }
};

export const setSourceEntityData = function ({ obj, key, dependencyValue }: any) {
  if (!obj || !dependencyValue || !key || !obj[key]) return;

  let dependenciesObj = obj[RELATIONSHIPS_PROP_NAME];
  if (!dependenciesObj) {
    obj[RELATIONSHIPS_PROP_NAME] = {};

    dependenciesObj = obj[RELATIONSHIPS_PROP_NAME];
  }

  const depsObjPropList = dependenciesObj ? dependenciesObj[key + MULTIPLE_RELATIONSHIP_SUFFIX] : null;

  // if (Array.isArray(obj[key])) {
  if (depsObjPropList) {
    depsObjPropList.push(dependencyValue);
  } else {
    dependenciesObj[key + MULTIPLE_RELATIONSHIP_SUFFIX] = [dependencyValue];
  }
};

export const getErrorData = (error: any) => {
  let code = null;
  let message = error.message;

  if (error.isAxiosError && error.response && error.response.data && error.response.data.message)
    message = error.response.data.message;

  if (error.isAxiosError && error.response && error.response.data && error.response.data.code)
    code = error.response.data.code;

  if (!code && error.isAxiosError && error.response && error.response.status) code = `HTTP${error.response.status}`;

  return { code, message };
};

export const handleError = function (error: any) {
  // eslint-disable-next-line no-console
  console.error(error);

  const newSwal = Swal.mixin({
    customClass: {
      confirmButton: 'button button-success',
      cancelButton: 'button button-error',
    },
    buttonsStyling: false,
  });

  const { code, message } = getErrorData(error);

  let title = 'Error';

  if (code) title = `Error (HTTP${code})`;

  newSwal.fire(title, message, 'error');
};

export const BACK_ROUTE_KEYWORD = 'back';

export const resolveWithConfirmation = ({ title, message, confirmButtonLabel, cancelButtonLabel }: any) => {
  return new Promise((resolve, reject) => {
    const newSwal = Swal.mixin({
      customClass: {
        confirmButton: 'button button-success',
        cancelButton: 'button button-error',
      },
      buttonsStyling: false,
    });

    newSwal
      .fire({
        title,
        text: message,
        showCancelButton: true,
        confirmButtonText: confirmButtonLabel,
        cancelButtonText: cancelButtonLabel,
        reverseButtons: true,

        // allowOutsideClick: () => !Swal.isLoading(),
        allowOutsideClick: false,
      })
      .then((result) => {
        const confirmed = result && result.isConfirmed;
        Swal.close();
        resolve({ confirmed });
      })

      .catch((e) => {
        reject(e);
      });
  });
};

export const showCustomLoading = () => {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve) => {
    const newSwal = Swal.mixin({
      customClass: {
        confirmButton: 'button button-success',
        cancelButton: 'button button-error',
      },
      buttonsStyling: false,
    });

    newSwal.fire({
      title: 'Loading',
      allowEscapeKey: false,
      allowOutsideClick: false,

      // timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        resolve(null);
      },
    });
  });
};

export const closeCustomLoading = () => {
  Swal.close();
};

export const enumValuesToArray = (enumType: any) => {
  return Object.keys(enumType).filter((item) => {
    return isNaN(Number(item));
  });
};

export const getFirstNameFromString = (str: any) => {
  if (!str || !str.length) return '';

  return str.split(' ')[0].trimEnd();
};

export const formatMoney = function (amountArg: any, decimalCount = 2, decimal = ',', thousands = '.') {
  try {
    let amount = amountArg;

    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? '-' : '';

    const parsedInt = parseInt((amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)));
    const ii = parsedInt.toString();
    const jj = ii.length > 3 ? ii.length % 3 : 0;

    return (
      negativeSign +
      (jj ? ii.substring(0, jj) + thousands : '') +
      ii.substring(jj).replace(/(\d{3})(?=\d)/g, `$1${thousands}`) +
      (decimalCount
        ? decimal +
          Math.abs(amount - parsedInt)
            .toFixed(decimalCount)
            .slice(2)
        : '')
    );
  } catch (e) {
    throw e;
  }
};

export const roundTwoDecimals = (num: any) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const shortenCompanyValuation = (valuation: any, noCurrency: any) => {
  if (!valuation) return valuation;

  let valuationRawText = '';

  if (valuation < 1000000) valuationRawText = `${roundTwoDecimals(valuation) / 1000} K`;
  else valuationRawText = `${roundTwoDecimals(valuation) / 1000000} M`;

  if (noCurrency) return valuationRawText;

  return `${valuationRawText}`;
};

export const loadScript = (url: any, callback: any) => {
  const script = document.createElement('script') as any;
  script.type = 'text/javascript';

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
};

export const loadStylesheet = (scriptToAppend: any) => {
  const script = document.createElement('link') as any;
  document.body.appendChild(script);
  script.async = true;
  script.href = scriptToAppend;
  script.rel = 'stylesheet';
};

export const analyticsTag = function (data: any) {
  const win: any = window;
  win.dataLayer = win.dataLayer || [];

  win.dataLayer.push(data);
};

/**
 * Capitalizes first letters of words in string.
 * @param {string} str String to be modified
 * @param {boolean=false} lower Whether all other letters should be lowercased
 * @return {string}
 * @usage
 *   capitalize('fix this string');     // -> 'Fix This String'
 *   capitalize('javaSCrIPT');          // -> 'JavaSCrIPT'
 *   capitalize('javaSCrIPT', true);    // -> 'Javascript'
 */
export const capitalize = (str: any, lower = false) => {
  if (!str) return '';

  return (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match: any) => match.toUpperCase());
};
export const hasRole = (rolsList: string[], rol: string) => {
  return rolsList.indexOf(rol) > -1;
};

export const singularize = (word: string) => {
  const endings: any = {
    ves: 've',
    ies: 'y',
    i: 'us',
    zes: 'ze',
    ses: 's',
    es: 'e',
    s: '',
  };

  return word.replace(new RegExp(`(${Object.keys(endings).join('|')})$`), (r) => endings[r]);
};

export const splitByUppercase = (text: string, splitter?: string) => {
  if (!splitter) splitter = ' ';

  return text.split(/(?=[A-Z])/).reduce((partA, partB) => {
    return partA + splitter + partB;
  });
};
export const USERS_SCHEMA: IEntitySchema = {
  id: 'users',
  organizationId: '',
  name: 'users',
  collectionName: 'users',
  rootSchema: true,

  description: '',

  indexedFilters: [],
  indexedCompoundFilters: [],
  grantedUserDefinedRols_create: [],
  grantedUserDefinedRols_read: [],
  grantedUserDefinedRols_update: [],
  grantedUserDefinedRols_delete: [],

  grantedUserDefinedRols_create_mine: [],
  grantedUserDefinedRols_read_mine: [],
  grantedUserDefinedRols_update_mine: [],
  grantedUserDefinedRols_delete_mine: [],

  grantedUserDefinedRols_create_by_user: [],
  grantedUserDefinedRols_read_by_user: [],
  grantedUserDefinedRols_update_by_user: [],
  grantedUserDefinedRols_delete_by_user: [],

  grantedUserDefinedRols_create_by_company: [],
  grantedUserDefinedRols_read_by_company: [],
  grantedUserDefinedRols_update_by_company: [],
  grantedUserDefinedRols_delete_by_company: [],

  schemaType: EntitySchemaTypes.USER_ENTITY,

  fieldNameUsedAsSchemaLabel: 'firstName',
};

export const COMPANIES_SCHEMA: IEntitySchema = {
  id: 'companies',
  organizationId: '',
  name: 'companies',
  collectionName: 'companies',
  rootSchema: true,

  description: '',

  indexedFilters: [],
  indexedCompoundFilters: [],
  grantedUserDefinedRols_create: [],
  grantedUserDefinedRols_read: [],
  grantedUserDefinedRols_update: [],
  grantedUserDefinedRols_delete: [],

  grantedUserDefinedRols_create_mine: [],
  grantedUserDefinedRols_read_mine: [],
  grantedUserDefinedRols_update_mine: [],
  grantedUserDefinedRols_delete_mine: [],

  grantedUserDefinedRols_create_by_user: [],
  grantedUserDefinedRols_read_by_user: [],
  grantedUserDefinedRols_update_by_user: [],
  grantedUserDefinedRols_delete_by_user: [],

  grantedUserDefinedRols_create_by_company: [],
  grantedUserDefinedRols_read_by_company: [],
  grantedUserDefinedRols_update_by_company: [],
  grantedUserDefinedRols_delete_by_company: [],

  schemaType: EntitySchemaTypes.COMPANY_ENTITY,

  fieldNameUsedAsSchemaLabel: 'name',
};

export const CODE_PROP_NAME = 'code';
export const CODE_PROP_LABEL = 'Code';

export const NAME_PROP_NAME = 'name';
export const NAME_PROP_LABEL = 'Name';

export const USER_PROP_NAME = 'userId';
export const USER_PROP_LABEL = 'User';

export const COUNTRY_CONSTRAINTS_PROP_NAME = 'countryConstraints';
export const RELATED_STATE_PROP_NAME = 'relatedState';

export const getUDRoleLabel = (udRols: IUserRol[], selectedRoleId: string) => {
  const udRole = udRols.find((udRol) => {
    return udRol.id === selectedRoleId;
  });

  if (udRole) return udRole.name;

  return selectedRoleId;
};

export const COUNTRIES = [
  {
    name: 'Argentina',
    value: 'ar',
    img: 'https://flagicons.lipis.dev/flags/4x3/ar.svg',
  },
  {
    name: 'Brasil',
    value: 'br',
    img: 'https://flagicons.lipis.dev/flags/4x3/br.svg',
  },
];

/*
import { nameof } from "./some-relative-import";
interface SomeInterface {
   someProperty: number;
 }
// with types
 console.log(nameof<SomeInterface>("someProperty")); // "someProperty"
// with values
const myVar: SomeInterface = { someProperty: 5 };
console.log(nameof(myVar, "someProperty")); // "someProperty"
*/
export function nameof<TObject>(obj: TObject, key: keyof TObject): string;
export function nameof<TObject>(key: keyof TObject): string;
export function nameof(key1: any, key2?: any): any {
  return key2 ?? key1;
}
