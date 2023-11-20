/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable no-console */
import axios from 'axios';

import { getHttpBearerConfig, listArgsToQueryString } from 'src/services/httpServices';
import { getUserWithToken } from 'src/@core/coreHelper';

import { API_URL_PATIENTS } from 'src/configs/appConfig';

import { Collections } from 'src/types/collectionsTypes';

const CACHE = [];

export const SERVICE_COLLECTION_NAME = Collections.PATIENTS;

export const listPatients = (args) => {
  let disableCache = null;
  let filters = null;
  if (args) disableCache = args.disableCache;
  if (args) filters = args.filters;

  const qs = listArgsToQueryString({ filters });

  return new Promise((resolve, reject) => {
    if (!disableCache) {
      const cacheItem = CACHE.find((item) => {
        return JSON.stringify(qs) === JSON.stringify(item.query);
      });
      if (cacheItem) {
        resolve(cacheItem.value);

        return;
      }
    }

    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_PATIENTS);
      axios
        .get(`${API_URL_PATIENTS}${qs}`, config)
        .then((response) => {
          if (!response || !response.data) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          const cacheItemIndex = CACHE.findIndex((item) => {
            return JSON.stringify(qs) === JSON.stringify(item.query);
          });

          const cacheData = { query: qs, value: response.data };
          if (cacheItemIndex >= 0) {
            CACHE[cacheItemIndex] = cacheData;
          } else {
            CACHE.push(cacheData);
          }

          resolve(response.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const getPatient = (id) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_PATIENTS);
      axios
        .get(`${API_URL_PATIENTS}/${id}`, config)
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

export const createPatient = (itemData) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      axios
        .post(`${API_URL_PATIENTS}`, itemData, config)
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

export const updatePatient = (id, itemData) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      axios
        .patch(`${API_URL_PATIENTS}/${id}`, itemData, config)
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

export const removePatient = (id) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      axios
        .delete(`${API_URL_PATIENTS}/${id}`, config)
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
