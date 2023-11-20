/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable no-console */
import axios from 'axios';

import { getHttpBearerConfig, listArgsToQueryString } from 'src/services/httpServices';
import { getUserWithToken } from 'src/@core/coreHelper';

import {
  API_URL_ENTITIES_SCHEMAS,
  API_URL_ENTITY_SCHEMA_FIELDS,
  API_URL_ENTITY_SCHEMA_FIELD_GROUPS,
  API_URL_ORGANIZATION_USER_DEFINED_ROLS,
  API_URL_USER_ROLS,
} from 'src/configs/appConfig';

import { Collections } from 'src/types/collectionsTypes';
import { subscribeToCollection } from 'src/services/firebaseServices';

export const SERVICE_COLLECTION_NAME = Collections.SCHEMAS;

import { IEntitySchema, IEntitySchemaField, IEntitySchemaFieldGroup, IUserRol } from 'src/types/entities';

export type UserRolsResponseType = {
  items: any[];
  hasMore: boolean;
  total: number;
};

export type UserDefinedRolsResponseType = {
  items: IUserRol[];
  hasMore: boolean;
  total: number;
};

export type EntitiesSchemasResponseType = {
  items: IEntitySchema[];
  hasMore: boolean;
  total: number;
};

export type EntitySchemaFieldsResponseType = {
  items: IEntitySchemaField[];
  hasMore: boolean;
  total: number;
};

export type EntitySchemaFieldGroupResponseType = {
  items: IEntitySchemaFieldGroup[];
  hasMore: boolean;
  total: number;
};

// ** Schema Field Groups
export const listEntitySchemaFieldGroups = (
  schemaId: string,
  filters?: any
): Promise<EntitySchemaFieldGroupResponseType> => {
  const qs = listArgsToQueryString({ filters });

  return new Promise<EntitySchemaFieldGroupResponseType>((resolve, reject) => {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      const url = API_URL_ENTITY_SCHEMA_FIELD_GROUPS?.replace(':id', schemaId);
      console.log('REQUESTING ', url);
      axios
        .get(`${url}${qs}`, config)
        .then((response) => {
          if (!response || !response.data) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as EntitySchemaFieldGroupResponseType);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const createEntitySchemaFieldGroup = (schemaId: string, data: IEntitySchemaFieldGroup): Promise<any> => {
  return new Promise<EntitySchemaFieldsResponseType>((resolve, reject) => {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      const url = API_URL_ENTITY_SCHEMA_FIELD_GROUPS?.replace(':id', schemaId);
      console.log('REQUESTING ', url);
      axios
        .post(`${url}`, data, config)
        .then((response) => {
          if (!response || !response.data) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as EntitySchemaFieldsResponseType);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const updateEntitySchemaFieldGroup = (
  schemaId: string,
  fieldGroupId: string,
  data: IEntitySchemaFieldGroup
): Promise<any> => {
  return new Promise<EntitySchemaFieldsResponseType>((resolve, reject) => {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      const url = API_URL_ENTITY_SCHEMA_FIELD_GROUPS?.replace(':id', schemaId) + '/' + fieldGroupId;

      console.log('REQUESTING ', url);

      axios
        .patch(`${url}`, data, config)
        .then((response) => {
          if (!response || !response.data) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as EntitySchemaFieldsResponseType);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const deleteEntitySchemaFieldGroup = (schemaId: string, fieldGroupId: string): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      const url = API_URL_ENTITY_SCHEMA_FIELD_GROUPS?.replace(':id', schemaId) + '/' + fieldGroupId;

      console.log('REQUESTING ', url);

      axios
        .delete(`${url}`, config)
        .then((response) => {
          if (!response) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(null);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

// ** Schema Fields
export const listAllEntitySchemasFields = (filters?: any): Promise<EntitySchemaFieldsResponseType> => {
  const qs = listArgsToQueryString({ filters });

  return new Promise<EntitySchemaFieldsResponseType>((resolve, reject) => {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      const url = API_URL_ENTITY_SCHEMA_FIELDS?.replace(':id', 'all');
      console.log('REQUESTING ', url);
      axios
        .get(`${url}${qs}`, config)
        .then((response) => {
          if (!response || !response.data) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as EntitySchemaFieldsResponseType);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const listEntitySchemaFields = (schemaId: string, filters?: any): Promise<EntitySchemaFieldsResponseType> => {
  const qs = listArgsToQueryString({ filters });

  return new Promise<EntitySchemaFieldsResponseType>((resolve, reject) => {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      const url = API_URL_ENTITY_SCHEMA_FIELDS?.replace(':id', schemaId);
      console.log('REQUESTING ', url);
      axios
        .get(`${url}${qs}`, config)
        .then((response) => {
          if (!response || !response.data) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as EntitySchemaFieldsResponseType);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const createEntitySchemaField = (schemaId: string, data: IEntitySchemaField): Promise<any> => {
  return new Promise<EntitySchemaFieldsResponseType>((resolve, reject) => {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      const url = API_URL_ENTITY_SCHEMA_FIELDS?.replace(':id', schemaId);
      console.log('REQUESTING ', url);
      axios
        .post(`${url}`, data, config)
        .then((response) => {
          if (!response || !response.data) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as EntitySchemaFieldsResponseType);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const updateEntitySchemaField = (schemaId: string, fieldId: string, data: IEntitySchemaField): Promise<any> => {
  return new Promise<EntitySchemaFieldsResponseType>((resolve, reject) => {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      const url = API_URL_ENTITY_SCHEMA_FIELDS?.replace(':id', schemaId) + '/' + fieldId;

      console.log('REQUESTING ', url);

      axios
        .patch(`${url}`, data, config)
        .then((response) => {
          if (!response || !response.data) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as EntitySchemaFieldsResponseType);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const deleteEntitySchemaField = (schemaId: string, fieldId: string): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      const url = API_URL_ENTITY_SCHEMA_FIELDS?.replace(':id', schemaId) + '/' + fieldId;

      console.log('REQUESTING ', url);

      axios
        .delete(`${url}`, config)
        .then((response) => {
          if (!response) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(null);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

// ** Schemas
export const listEntitiesSchemas = (args?: any): Promise<EntitiesSchemasResponseType> => {
  let filters = null;

  if (args) filters = args.filters;

  const qs = listArgsToQueryString({ filters });

  return new Promise<EntitiesSchemasResponseType>((resolve, reject) => {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ENTITIES_SCHEMAS);
      axios
        .get(`${API_URL_ENTITIES_SCHEMAS}${qs}`, config)
        .then((response) => {
          if (!response || !response.data) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as EntitiesSchemasResponseType);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const getEntitySchemaById = (id: string) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ENTITIES_SCHEMAS);
      axios
        .get(`${API_URL_ENTITIES_SCHEMAS}/${id}`, config)
        .then((response) => {
          if (!response) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as IEntitySchema);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const getEntitySchemaByName = (schemaName: string) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ENTITIES_SCHEMAS);
      axios
        .get(`${API_URL_ENTITIES_SCHEMAS}/by-name/${schemaName}`, config)
        .then((response) => {
          if (!response) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as IEntitySchema);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const createEntitySchema = (data: any) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ENTITIES_SCHEMAS);
      axios
        .post(`${API_URL_ENTITIES_SCHEMAS}`, data, config)
        .then((response) => {
          if (!response) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as IEntitySchema);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const updateEntitySchema = (id: string, data: any) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ENTITIES_SCHEMAS);
      axios
        .patch(`${API_URL_ENTITIES_SCHEMAS}/${id}`, data, config)
        .then((response) => {
          if (!response) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as IEntitySchema);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const deleteEntitySchema = (id: string) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ENTITIES_SCHEMAS);
      axios
        .delete(`${API_URL_ENTITIES_SCHEMAS}/${id}`, config)
        .then((response) => {
          if (!response) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as IEntitySchema);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

// ** User defined rols
export const listUserDefinedRols = (args?: any): Promise<UserDefinedRolsResponseType> => {
  let filters = null;

  if (args) filters = args.filters;

  const qs = listArgsToQueryString({ filters });

  return new Promise<UserDefinedRolsResponseType>((resolve, reject) => {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ORGANIZATION_USER_DEFINED_ROLS);
      axios
        .get(`${API_URL_ORGANIZATION_USER_DEFINED_ROLS}/${qs}`, config)
        .then((response) => {
          if (!response || !response.data) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as UserDefinedRolsResponseType);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const createUserDefinedRol = (data: IUserRol) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ORGANIZATION_USER_DEFINED_ROLS);
      axios
        .post(`${API_URL_ORGANIZATION_USER_DEFINED_ROLS}`, data, config)
        .then((response) => {
          if (!response) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as IUserRol);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const updateUserDefinedRol = (id: string, data: IUserRol) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ORGANIZATION_USER_DEFINED_ROLS);
      axios
        .patch(`${API_URL_ORGANIZATION_USER_DEFINED_ROLS}/${id}`, data, config)
        .then((response) => {
          if (!response) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as IUserRol);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const deleteUserDefinedRol = (id: string) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_ORGANIZATION_USER_DEFINED_ROLS);
      axios
        .delete(`${API_URL_ORGANIZATION_USER_DEFINED_ROLS}/${id}`, config)
        .then((response) => {
          if (!response) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as IUserRol);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

// ** User rols
export const listUserRols = (userId: string, args?: any): Promise<UserRolsResponseType> => {
  let filters = null;

  if (args) filters = args.filters;

  const qs = listArgsToQueryString({ filters });

  return new Promise<UserRolsResponseType>((resolve, reject) => {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_USER_ROLS);
      axios
        .get(`${API_URL_USER_ROLS}/by-user/${userId}${qs}`, config)
        .then((response) => {
          if (!response || !response.data) {
            console.error('Invalid response');
            throw new Error('Invalid response');
          }

          resolve(response.data as UserRolsResponseType);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

export const createUserRole = (userId: string, data: any) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_USER_ROLS);
      axios
        .post(`${API_URL_USER_ROLS}/by-user/${userId}`, data, config)
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

export const upsertUserRole = (userId: string, data: any) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_USER_ROLS);
      axios
        .post(`${API_URL_USER_ROLS}/by-user/${userId}/upsert`, data, config)
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

export const removeUserRole = (userId: string, id: string) => {
  return new Promise(function (resolve, reject) {
    getUserWithToken().then((uwt: any) => {
      const config = getHttpBearerConfig(uwt ? uwt.token : null);

      console.log('REQUESTING ', API_URL_USER_ROLS);
      axios
        .delete(`${API_URL_USER_ROLS}/by-user/${userId}/${id}`, config)
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
