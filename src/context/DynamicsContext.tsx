// ** React Imports
import { ReactNode, createContext, useEffect, useState } from 'react';
import { DEFAULT_ORGANIZATION_ID } from 'src/configs/appConfig';

// ** Next Import
// import { useRouter } from 'next/router';

import { useAuth } from 'src/hooks/useAuth';
import { dynamicGet } from 'src/services/entitiesDynamicServices';
import { listAllEntitySchemasFields, listEntitiesSchemas } from 'src/services/entitiesSchemasServices';

import { IDynamicEventImplementation } from 'src/types/dynamics';
import { EntitySchemaTypes, IEntitySchema, IEntitySchemaField } from 'src/types/entities';

import { useRouter } from 'next/router';
import DynamicFormSidebar from 'src/views/components/dynamics/DynamicFormSidebar';
import { USERS_SCHEMA } from 'src/@core/coreHelper';

export type IDynamicsContextVariable = {
  name: string;
  value: any;
};

export type IDynamicsContextRefreshVariableFlag = {
  name: string;
  refreshDataToggle: boolean;
};

export type IDynamicsContext = {
  events: IDynamicEventImplementation[];
  variables: IDynamicsContextVariable[];
  refreshVariablesFlags: IDynamicsContextRefreshVariableFlag[];

  addEvent: (event: IDynamicEventImplementation) => void;
  addVariable: (variable: IDynamicsContextVariable) => void;

  getVariableByName: (name: string) => IDynamicsContextVariable | undefined | null;
  getEventByName: (name: string) => IDynamicEventImplementation | undefined | null;

  refreshVariableDataToggle: (name: string) => void;

  isLoadingSchemas: boolean;
  entitySchemas: IEntitySchema[] | null;
  entitySchemasFields: IEntitySchemaField[] | null;
  invalidateEntitySchemasCache: () => void;

  openDyamicForm: (props: any) => void;
  closeDyamicForm: () => void;
};

// ** Defaults
const defaultProvider: IDynamicsContext = {
  events: [],
  variables: [],
  refreshVariablesFlags: [],

  addEvent: () => null,
  addVariable: () => null,
  getVariableByName: () => null,
  getEventByName: () => null,

  refreshVariableDataToggle: () => null,

  isLoadingSchemas: false,
  entitySchemas: null,
  entitySchemasFields: null,

  invalidateEntitySchemasCache: () => null,

  openDyamicForm: (props: any) => null,
  closeDyamicForm: () => null,
};

const DynamicsContext = createContext(defaultProvider);

type PropsType = {
  children: ReactNode;
};

const DynamicsProvider = ({ children }: PropsType) => {
  // ** Hooks
  const auth = useAuth();
  const router = useRouter();

  // ** States

  const [events, setEvents] = useState<IDynamicEventImplementation[]>([]);
  const [variables, setVariables] = useState<IDynamicsContextVariable[]>([]);
  const [refreshVariablesFlags, setRefreshVariablesFlags] = useState<IDynamicsContextRefreshVariableFlag[]>([]);

  const [isLoadingSchemas, setIsLoadingSchemas] = useState<boolean>(false);
  const [fetchedPrivateSchemas, setFetchedPrivateSchemas] = useState<boolean>(false);

  const [entitySchemas, setEntitySchemas] = useState<IEntitySchema[] | null>(null);
  const [entitySchemasFields, setEntitySchemasFields] = useState<IEntitySchemaField[] | null>(null);

  const [dynamicFormProps, setDynamicFormProps] = useState<any>({ open: false });

  const toggleDynamicForm = () => {
    closeDyamicForm();
  };
  const openDyamicForm = (props: any) => {
    setDynamicFormProps({ ...props, open: true, toggle: toggleDynamicForm });
  };

  const closeDyamicForm = () => {
    setDynamicFormProps({ open: false });
  };

  const invalidateEntitySchemasCache = () => {
    setEntitySchemas(null);
    setEntitySchemasFields(null);
  };

  // solo se ejecuta la primera vez
  useEffect(() => {
    const doAsync = async () => {
      try {
        // anonimamente deberia poder consultar todo
        // if (!auth.authStatusReported || !auth.isAuthenticated || !auth.user) return;

        // TODO mejor manera de identificar los que no quieren la cache
        if (
          !auth.authStatusReported ||
          router.asPath.startsWith('/login') ||
          router.asPath.startsWith('/register') ||
          router.asPath.startsWith('/forgot-password')
        ) {
          setEntitySchemas(null);
          setEntitySchemasFields(null);

          return;
        }

        if (isLoadingSchemas || (fetchedPrivateSchemas && entitySchemas && entitySchemasFields)) return;

        setIsLoadingSchemas(true);

        if (auth.isAuthenticated) {
          setFetchedPrivateSchemas(true);
        }

        listEntitiesSchemas()
          .then((schemasResponse) => {
            setEntitySchemas(schemasResponse.items);

            schemasResponse.items.forEach((entitySchema) => {
              if (!entitySchema.cacheable) return;

              const url = entitySchema.grantedAnonymous_read
                ? '/cms/public/' + DEFAULT_ORGANIZATION_ID + '/' + entitySchema.name
                : '/cms/' + entitySchema.name;

              // if (entitySchema.grantedAnonymous_read || (auth.isAuthenticated && auth.user)) {
              // console.log('Fetch cacheable entity: ' + entitySchema.name);
              // Por ahora no hago la pre cache
              // dynamicGet({ params: url, useCache: true })
              //   .then((result) => {
              //     // const auxArray = [...cacheableEntitiesData];
              //     // auxArray.push({ entitySchemaId: entitySchema.id, fetchResult: result });
              //     // setCacheableEntitiesData(auxArray);
              //   })
              //   .catch((e) => {
              //     console.error('Error in dynamics context (schemas):', e);
              //   });
              // }
            });
          })
          .catch((e) => {
            console.error('Error in dynamics context (schemas):', e);
          });

        listAllEntitySchemasFields()
          .then((fieldsResponse) => {
            setEntitySchemasFields(fieldsResponse.items);
          })
          .catch((e) => {
            console.error('Error in dynamics context (fields):', e);
          });
      } catch (e) {
        setIsLoadingSchemas(false);
      }
    };
    doAsync();
  }, [auth.user, auth.authStatusReported, auth.isAuthenticated, router.asPath]);

  // Cuando se ejecutan los dos requests de obtencion de schemas y fields entonces quiere decir que termino de cargar
  useEffect(() => {
    if (!entitySchemas || !entitySchemasFields) return;

    // const userFields = entitySchemasFields.filter((field) => {
    //   return field.schemaId === USERS_SCHEMA.id;
    // });

    // entitySchemas.forEach((schema) => {
    //   if (schema.schemaType !== EntitySchemaTypes.USER_ENTITY) return;

    // const employeeFields = entitySchemasFields
    //   .filter((item) => {
    //     return item.schemaId === 'enlite_companyEmployees';
    //   })
    //   .map((item) => {
    //     return item.name;
    //   });
    // const workerFields = entitySchemasFields
    //   .filter((item) => {
    //     return item.schemaId === 'jhfaSVDkkU3Qpbwql6gw';
    //   })
    //   .map((item) => {
    //     return item.name;
    //   });

    // userFields.forEach((field) => {
    //   entitySchemasFields.push({ ...field, schemaId: schema.id });
    // });
    // });

    // setEntitySchemasFields(entitySchemasFields);

    setIsLoadingSchemas(false);
  }, [entitySchemas, entitySchemasFields]);

  const addEvent = (event: IDynamicEventImplementation) => {
    const existentEventIndex = events.findIndex((item) => {
      return item.name === event.name;
    });
    if (existentEventIndex !== -1) {
      events[existentEventIndex] = event;
    } else {
      events.push(event);
    }

    setEvents(events);
  };

  const addVariable = (variable: IDynamicsContextVariable) => {
    const existentVariableIndex = variables.findIndex((item) => {
      return item.name === variable.name;
    });
    if (existentVariableIndex !== -1) {
      variables[existentVariableIndex] = { ...variable };
    } else {
      variables.push(variable);
    }

    setVariables([...variables]);
  };

  const getVariableByName = (name: string) => {
    return variables.find((item) => {
      return item.name === name;
    });
  };

  const getEventByName = (name: string) => {
    return events.find((item) => {
      return item.name === name;
    });
  };

  const refreshVariableDataToggle = (name: string) => {
    const flagIndex = refreshVariablesFlags.findIndex((item) => {
      return item.name === name;
    });

    if (flagIndex === -1) setRefreshVariablesFlags([...refreshVariablesFlags, { name, refreshDataToggle: true }]);
    else {
      refreshVariablesFlags[flagIndex].refreshDataToggle = !refreshVariablesFlags[flagIndex].refreshDataToggle;
      setRefreshVariablesFlags([...refreshVariablesFlags]);
    }
  };

  const values = {
    events,
    variables,
    refreshVariablesFlags,

    addEvent,
    addVariable,

    getVariableByName,
    getEventByName,

    refreshVariableDataToggle,

    isLoadingSchemas,
    entitySchemas,
    entitySchemasFields,
    invalidateEntitySchemasCache,

    openDyamicForm,
    closeDyamicForm,
  };

  return (
    <DynamicsContext.Provider value={values}>
      <>
        {children}
        {dynamicFormProps.open && (
          <DynamicFormSidebar
            {...dynamicFormProps}
            // isCreating={false}
            // onSubmit={handleOnEditSubmit}
            // title={'Edit ' + entitySchema?.name}
            // formId={'Edit_' + entitySchema?.name}
            // initialValues={entityData}
            // preloadForm={editEntityForm}
            // open={editSidebarOpen}
            // toggle={toggleEditDrawer}
            // onSubmitDone={() => {
            //   toggleEditDrawer();

            //   return Promise.resolve();
            // }}
          />
        )}
      </>
    </DynamicsContext.Provider>
  );
};

export { DynamicsContext, DynamicsProvider };
