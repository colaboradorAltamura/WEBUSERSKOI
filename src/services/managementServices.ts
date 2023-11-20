/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable no-console */
import axios from 'axios';

import { getUserWithToken } from 'src/@core/coreHelper';
import { getHttpBearerConfig } from 'src/services/httpServices';

import { API_URL_ORGANIZATIONS } from 'src/configs/appConfig';

import { IOrganization } from 'src/types/organizations';

// ** User rols
export const getCurrentOrganizaion = (): Promise<IOrganization> => {
  return new Promise<IOrganization>((resolve, reject) => {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ORGANIZATIONS);
      axios
        .get(`${API_URL_ORGANIZATIONS}/mine`, config)
        .then((response) => {
          if (!response || !response.data) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as IOrganization);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const updateCurrentOrganizaion = (data: any) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ORGANIZATIONS);
      axios
        .post(`${API_URL_ORGANIZATIONS}/mine`, data, config)
        .then((response) => {
          if (!response) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as any);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const exportOrganizationConfig = (): Promise<any> => {
  return new Promise<IOrganization>((resolve, reject) => {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ORGANIZATIONS);
      axios
        .post(`${API_URL_ORGANIZATIONS}/export-config`, {}, config)
        .then((response) => {
          if (!response || !response.data) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as any);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};
