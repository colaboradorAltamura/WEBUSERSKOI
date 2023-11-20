/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable no-console */
import axios from 'axios';

import { getHttpBearerConfig, listArgsToQueryString } from 'src/services/httpServices';
import { getUserWithToken } from 'src/@core/coreHelper';

import { API_URL_ENTITY_RELATIONSHIPS } from 'src/configs/appConfig';

import { Collections } from 'src/types/collectionsTypes';

export const SERVICE_COLLECTION_NAME = Collections.ENTITY_RELATIONSHIPS;

export const listRelationshipsByAnonymous = (args) => {
  let filters = null;

  if (args) filters = args.filters;

  const qs = listArgsToQueryString({ filters });

  return new Promise((resolve, reject) => {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ENTITY_RELATIONSHIPS);
      axios
        .get(`${API_URL_ENTITY_RELATIONSHIPS}/anonymous/${args.entityId}${qs}`, config)
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

export const listRelationshipsByUser = (args) => {
  let filters = null;

  if (args) filters = args.filters;

  const qs = listArgsToQueryString({ filters });

  return new Promise((resolve, reject) => {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ENTITY_RELATIONSHIPS);
      axios
        .get(`${API_URL_ENTITY_RELATIONSHIPS}/user-relationship/${args.userId}${qs}`, config)
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

export const listRelationshipsByCompany = (args) => {
  let filters = null;

  if (args) filters = args.filters;

  const qs = listArgsToQueryString({ filters });

  return new Promise((resolve, reject) => {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ENTITY_RELATIONSHIPS);
      axios
        .get(`${API_URL_ENTITY_RELATIONSHIPS}/company-relationship/${args.companyId}${qs}`, config)
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

export const getRelationshipByUserByTarget = ({ userId, id }) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ENTITY_RELATIONSHIPS);
      axios
        .get(`${API_URL_ENTITY_RELATIONSHIPS}/user-relationship/${userId}/by-target/${id}`, config)
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

export const getRelationshipByUserByAcquirer = ({ userId, id }) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ENTITY_RELATIONSHIPS);
      axios
        .get(`${API_URL_ENTITY_RELATIONSHIPS}/user-relationship/${userId}/by-acquirer/${id}`, config)
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

export const getRelationshipByCompany = ({ companyId, id }) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ENTITY_RELATIONSHIPS);
      axios
        .get(`${API_URL_ENTITY_RELATIONSHIPS}/compnay-relationship/${companyId}/${id}`, config)
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

export const getRelationshipByCompanyByTarget = ({ companyId, id }) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ENTITY_RELATIONSHIPS);
      axios
        .get(`${API_URL_ENTITY_RELATIONSHIPS}/company-relationship/${companyId}/by-target/${id}`, config)
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

export const getRelationshipByCompanyByAcquirer = ({ companyId, id }) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ENTITY_RELATIONSHIPS);
      axios
        .get(`${API_URL_ENTITY_RELATIONSHIPS}/company-relationship/${companyId}/by-acquirer/${id}`, config)
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

export const createRelationshipByUser = ({ userId, itemData }) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      axios
        .post(`${API_URL_ENTITY_RELATIONSHIPS}/user-relationship/${userId}`, itemData, config)
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

export const createRelationshipByCompany = ({ companyId, itemData }) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      axios
        .post(`${API_URL_ENTITY_RELATIONSHIPS}/company-relationship/${companyId}`, itemData, config)
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

export const updateRelationshipByUser = ({ userId, id, itemData }) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      axios
        .patch(`${API_URL_ENTITY_RELATIONSHIPS}/user-relationship/${userId}/${id}`, itemData, config)
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

export const updateRelationshipByCompany = ({ companyId, id, itemData }) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      axios
        .patch(`${API_URL_ENTITY_RELATIONSHIPS}/company-relationship/${companyId}/${id}`, itemData, config)
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
