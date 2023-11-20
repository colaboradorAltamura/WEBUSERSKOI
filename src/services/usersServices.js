/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable no-console */
import axios from 'axios';

import { getHttpBearerConfig, listArgsToQueryString } from 'src/services/httpServices';
import { getUserWithToken } from 'src/@core/coreHelper';

import { API_URL_USERS } from 'src/configs/appConfig';

import { Collections } from 'src/types/collectionsTypes';
import { subscribeToCollection } from 'src/services/firebaseServices';

const CACHE = [];

export const SERVICE_COLLECTION_NAME = Collections.USERS;

export const listUsers = (args) => {
  let disableCache = null;
  let filters = null;
  if (args) disableCache = args.disableCache;
  if (args) filters = args.filters;

  const qs = listArgsToQueryString({ filters, limit: 100 });

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

      console.log('REQUESTING ', API_URL_USERS);
      axios
        .get(`${API_URL_USERS}${qs}`, config)
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

export const subscribeUsers = ({ onUpdate, onError, filters }) => {
  const qs = listArgsToQueryString({ filters });

  return new Promise((resolve, reject) => {
    const cacheItem = CACHE.find((item) => {
      return item.query === qs;
    });

    // TODO MICHEL - Siempre devuelve dos veces onUpdate, ver como no hacer el segundo onUpdate...
    if (cacheItem) onUpdate(cacheItem.value);

    try {
      const unsub = subscribeToCollection({
        path: SERVICE_COLLECTION_NAME,

        onUpdate: (documents) => {
          listUsers({ disableCache: true, filters })
            .then((results) => {
              const newCacheItem = CACHE.find((item) => {
                return item.query === qs;
              });

              if (!newCacheItem) {
                reject(new Error('No se genero la cache'));

                return;
              }

              onUpdate(newCacheItem.value);
            })
            .catch((e) => {
              reject(e);
            });
        },
        onError: (e) => {
          console.error('Error subscribe:', e);
          onError(new Error(`${SERVICE_COLLECTION_NAME} error: ${e.message}`));
        },
      });

      resolve(unsub);
    } catch (e) {
      reject(e);
    }
  });
};

export const getCurrentUser = () => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_USERS);
      axios
        .get(`${API_URL_USERS}/${uwt.user.uid}`, config)
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

export const getUser = (id) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_USERS);
      axios
        .get(`${API_URL_USERS}/${id}`, config)
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

export const createUser = (itemData) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      axios
        .post(`${API_URL_USERS}`, itemData, config)
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

export const createUserByStaff = (itemData) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      axios
        .post(`${API_URL_USERS}/by-staff`, itemData, config)
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

export const createUserByUser = (itemData) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      axios
        .post(`${API_URL_USERS}/by-user`, itemData, config)
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

export const updateUser = (id, itemData) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      axios
        .patch(`${API_URL_USERS}/${id}`, itemData, config)
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

export const removeUser = (id) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      axios
        .delete(`${API_URL_USERS}/${id}`, config)
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

export const updateUserByStaff = (id, itemData) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      axios
        .patch(`${API_URL_USERS}/by-staff/${id}`, itemData, config)
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

export const signIn = () => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_USERS);
      axios
        .post(`${API_URL_USERS}/sign-in`, {}, config)
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

export const signUp = (itemData) => {
  return new Promise(function (resolve, reject) {
    const config = getHttpBearerConfig();

    axios
      .post(`${API_URL_USERS}/sign-up`, itemData, config)
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
};

export const signUpFederatedAuth = () => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      axios
        .post(`${API_URL_USERS}/sign-up-federated-auth`, {}, config)
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
