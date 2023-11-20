/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import axios from 'axios';

import { getUserWithToken } from 'src/@core/coreHelper';
import { getHttpBearerConfig, listArgsToQueryString } from 'src/services/httpServices';

import { API_URL } from 'src/configs/appConfig';

let CACHE = []; // uri, value:

export const invalidateCache = (params) => {
  const uri = `${API_URL}${params}`;

  CACHE = CACHE.filter((item) => {
    return item.uri !== uri;
  });
};

export const dynamicInvoke = ({ params, filters, url, endpoint, httpMethod, isCreating, payload }) => {
  const qs = listArgsToQueryString({ filters });

  // const url = `${API_URL}${params}${qs}`;

  let finalUrl = '';
  if (endpoint) {
    finalUrl = `${API_URL}${endpoint}${params}${qs}`;
  } else {
    finalUrl = `${url}${params}${qs}`;
  }

  return new Promise((resolve, reject) => {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING DYNAMIC INVOKE:' + finalUrl);
      let axiosInvoker = null;

      if (httpMethod === 'get') {
        axiosInvoker = axios.get(finalUrl, config);
      }
      if (httpMethod === 'post') {
        axiosInvoker = axios.post(finalUrl, payload, config);
      }
      if (httpMethod === 'put') {
        axiosInvoker = axios.put(finalUrl, payload, config);
      }

      // .get(`${API_URL_TASKS}${qs}`, config)
      axiosInvoker
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

export const dynamicGet = (args) => {
  const { params, filters, useCache, disableCache, limit, offset } = args;

  const qs = listArgsToQueryString({ filters, limit, offset });

  const uri = `${API_URL}${params}`;

  const url = `${uri}${qs}`;

  return new Promise((resolve, reject) => {
    if (!disableCache) {
      const cacheItem = CACHE.find((item) => {
        return uri === item.uri;
      });

      if (cacheItem) {
        console.log('Returning cached item for uri: ' + uri);

        resolve(cacheItem.value);

        return;
      }
    }

    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING DYNAMIC GET: ' + url);
      axios
        .get(url, config)

        // .get(`${API_URL_TASKS}${qs}`, config)
        .then((response) => {
          if (!response || !response) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          if (useCache) {
            const cacheData = { uri, value: response.data };

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

export const dynamicCreate = (args) => {
  const { params, filters, data } = args;

  const qs = listArgsToQueryString({ filters });

  const url = `${API_URL}${params}${qs}`;

  return new Promise((resolve, reject) => {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', url);
      axios
        .post(url, data, config)

        // .get(`${API_URL_TASKS}${qs}`, config)
        .then((response) => {
          if (!response || !response) {
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

export const dynamicUpdate = (args) => {
  const { params, filters, data } = args;

  const qs = listArgsToQueryString({ filters });

  const url = `${API_URL}${params}${qs}`;

  return new Promise((resolve, reject) => {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', url);
      axios
        .patch(url, data, config)

        // .get(`${API_URL_TASKS}${qs}`, config)
        .then((response) => {
          if (!response || !response) {
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

export const dynamicRemove = (args) => {
  const { params, filters } = args;

  const qs = listArgsToQueryString({ filters });

  const url = `${API_URL}${params}${qs}`;

  return new Promise((resolve, reject) => {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', url);
      axios
        .delete(url, config)

        // .get(`${API_URL_TASKS}${qs}`, config)
        .then((response) => {
          if (!response || !response) {
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

// export const fetchCachedSchemasData = () => {
//   const url = `${API_URL}/cms/cacheable-entities-data`;

//   return new Promise((resolve, reject) => {
//     getUserWithToken().then((uwt) => {
//       const config = getHttpBearerConfig(uwt ? uwt.token : null);

//       console.log('REQUESTING ', url);
//       axios
//         .get(url, config)

//         // .get(`${API_URL_TASKS}${qs}`, config)
//         .then((response) => {
//           if (!response || !response) {
//             console.error('Invalid response');
//             throw new Error('Invalid response');
//           }

//           resolve(response.data);
//         })
//         .catch((e) => {
//           reject(e);
//         });
//     });
//   });
// };
