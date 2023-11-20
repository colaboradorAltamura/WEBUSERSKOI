/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable no-console */
import axios from 'axios';

import { getHttpBearerConfig, listArgsToQueryString } from 'src/services/httpServices';
import { getUserWithToken } from 'src/@core/coreHelper';

import { API_URL_USERS } from 'src/configs/appConfig';

export const updateUserPassword = (uId, password) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt.token);

      axios
        .post(`${API_URL_USERS}/set-user-pw`, { uId, password }, config)
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
