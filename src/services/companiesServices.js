/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable no-console */
import axios from 'axios';

import { getUserWithToken } from 'src/@core/coreHelper';
import { getHttpBearerConfig, listArgsToQueryString } from 'src/services/httpServices';

import { API_URL_COMPANIES } from 'src/configs/appConfig';

import { Collections } from 'src/types/collectionsTypes';

export const SERVICE_COLLECTION_NAME = Collections.COMPANIES;

export const listGrantedCompanies = (args) => {
  let filters = null;

  if (args) filters = args.filters;

  const qs = listArgsToQueryString({ filters });

  return new Promise((resolve, reject) => {
    getUserWithToken().then((uwt) => {
      if (!uwt.token) resolve(null);
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_COMPANIES);
      axios
        .get(`${API_URL_COMPANIES}/granted${qs}`, config)
        .then((response) => {
          if (!response || !response.data) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const createCompanyByUser = (userId, itemData) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      axios
        .post(`${API_URL_COMPANIES}/by-user/${userId}`, itemData, config)
        .then((response) => {
          if (!response) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }
          resolve(response.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const switchCompany = ({ companyId }) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      const itemData = {};

      axios
        .post(`${API_URL_COMPANIES}/switch-company/${companyId}`, itemData, config)

        .then((response) => {
          if (!response) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};
