import { capitalize } from '@mui/material';
import { CONDITIONAL_RENDER_NON_EMPTY_STRING, USERS_SCHEMA, getSourceEntityData } from 'src/@core/coreHelper';
import { IDynamicsContext, IDynamicsContextVariable } from 'src/context/DynamicsContext';
import {
  dynamicCreate,
  dynamicGet,
  dynamicInvoke,
  dynamicRemove,
  dynamicUpdate,
  invalidateCache,
} from 'src/services/entitiesDynamicServices';
import {
  IDynamicEventDefinition,
  IDynamicEventImplementation,
  DynamicEventTypes,
  IDynamicParam,
  IDynamicQueryFilter,
  IDynamicRequiredVariable,
  IForm,
  DynamicComponentTypes,
  FormStepType,
  IDynamicComponent,
} from 'src/types/dynamics';
import { EntitySchemaTypes, IEntitySchema, IEntitySchemaField, IEntitySchemaFieldGroup } from 'src/types/entities';
import { IUser } from 'src/types/users';

const argsToQueryFilters = (
  payload: any,
  contextVariables: IDynamicsContextVariable[],
  queryFilters?: IDynamicQueryFilter[]
) => {
  const filtersArray: any[] = [];

  // filters: [{ key: 'state', value: 1, operator: '$equal' }],

  queryFilters?.forEach((queryFilter) => {
    let rawData = '';
    if (queryFilter.contextVariableName) {
      const param = contextVariables.find((dynamicVariable) => {
        return dynamicVariable.name === queryFilter.contextVariableName;
      });

      if (queryFilter.prop) rawData = param?.value[queryFilter.prop];
      else rawData = param?.value;
    } else if (queryFilter.prop) {
      const param = payload[queryFilter.prop];
      rawData = param?.value ? param?.value : param;
    }

    if (rawData) {
      filtersArray.push({ key: queryFilter.targetFilterName, value: rawData, operator: queryFilter.filterOperator });
    }
  });

  return filtersArray;
};

export const argsToParamsString = (
  payload: any,
  contextVariables: IDynamicsContextVariable[],
  paramsVariables?: IDynamicParam[]
) => {
  let paramsString = '';

  paramsVariables?.forEach((eventDefinitionParam: IDynamicParam) => {
    if (eventDefinitionParam.contextVariableName) {
      const param = contextVariables.find((dynamicVariable) => {
        return dynamicVariable.name === eventDefinitionParam.contextVariableName;
      });

      if (eventDefinitionParam.prop) paramsString += `/${param?.value[eventDefinitionParam.prop]}`;
      else if (param) paramsString += `/${param?.value}`;
    } else if (eventDefinitionParam.prop) {
      const param = payload[eventDefinitionParam.prop];

      // pequeno fix para los select inputs
      const val = param && param.isOptionField ? param.value : param;

      if (val) paramsString += `/${val}`;
    }
  });

  return paramsString;
};

const buildEventFromDefinition = (
  eventDefinition: IDynamicEventDefinition,
  contextVariables: IDynamicsContextVariable[],
  isCreating: boolean
) => {
  if (eventDefinition.eventType === DynamicEventTypes.HTTP_REQUEST) {
    return {
      name: eventDefinition.name,

      // event: ({ ...args }: { [x: string]: any }) =>
      //   new Promise<any>(() => {
      //     console.log('invoked');
      //   }),

      // event: ({ ...args }: { [x: string]: any }) =>
      event: ({ ...args }) =>
        new Promise<any>((resolve, reject) => {
          if (eventDefinition.http.method === 'get' && !eventDefinition.http.url) {
            dynamicGet({
              params:
                eventDefinition.http.endpoint +
                argsToParamsString(args, contextVariables, eventDefinition.http.paramsVariables),
              filters: argsToQueryFilters(args, contextVariables, eventDefinition.http.queryFilters),
            })
              .then((res) => {
                resolve(res);
              })
              .catch((e) => {
                reject(e);
              });
          } else
            dynamicInvoke({
              params: argsToParamsString(args, contextVariables, eventDefinition.http.paramsVariables),
              filters: argsToQueryFilters(args, contextVariables, eventDefinition.http.queryFilters),
              url: eventDefinition.http.url,
              endpoint: eventDefinition.http.endpoint,
              httpMethod: eventDefinition.http.method,
              isCreating,
              payload: args,
            })
              .then((res) => {
                resolve(res);
              })
              .catch((e) => {
                reject(e);
              });
        }),

      // event: new Promise<any>(() => {
      // }),
    };
  } else throw new Error('Not implemented event type ' + eventDefinition.eventType);

  // return {
  //   name: eventDefinition.name,
  //   event: ({ ...args }: { [x: string]: any }) =>
  //     new Promise<any>(() => {
  //       console.log('invoked');
  //     }),

  // event: ({ ...args }: { [x: string]: any }) =>
  //   new Promise<any>(() => {
  //     console.log('invoked');
  //   }),
  // };
};

export const invokeEvent = async (
  dynamics: IDynamicsContext,
  dynamicEventsDefinitions: IDynamicEventDefinition[],
  eventName: string,
  values: any,

  isCreating: boolean
) => {
  const eventImplementation = dynamics.events.find((ei) => {
    return ei.name === eventName;
  });

  if (eventImplementation) {
    return await eventImplementation.event(values);
  } else if (dynamicEventsDefinitions) {
    const eventDefinition = dynamicEventsDefinitions.find((ed) => {
      return ed.name === eventName;
    });

    if (!eventDefinition) throw new Error('missing context event: ' + eventName);

    const newEvent = buildEventFromDefinition(eventDefinition, dynamics.variables, isCreating);

    // return null;

    return await newEvent.event(values);
  } else {
    throw new Error('missing context event: ' + eventName);
  }
};

// const resolvePromisesSeq = async (tasks: any[]) => {
//   const results = [];
//   for (const task of tasks) {
//     results.push(await task);
//   }

//   return results;
// };

const schemaFieldToFormComponent = (
  field: IEntitySchemaField,
  dynamics: IDynamicsContext | null,
  showCreateNewItem?: boolean | null
) => {
  const specificFormProps: any = {};

  // if (field.name === 'workerId') deebugger;

  const paramsVariables: IDynamicParam[] = [];
  if (field.relationshipRequiresSimpleParam) {
    paramsVariables.push({
      variableAlias: field.relationshipParamPropName ? field.relationshipParamPropName : field.name, // id
      contextVariableName: '', // si esto es vacio se usa el payload
      prop: field.relationshipParamPropName, // id
    });
  }

  if (field.relationshipRequiresUserParam) {
    paramsVariables.push({
      variableAlias: field.relationshipParamPropName ? field.relationshipParamPropName : field.name, // userId
      contextVariableName: '', // si esto es vacio se usa el payload
      prop: field.relationshipParamPropName, // id
    });
  }

  if (field.relationshipRequiresCompanyParam) {
    paramsVariables.push({
      variableAlias: field.relationshipParamPropName ? field.relationshipParamPropName : field.name, // companyId
      contextVariableName: '', // si esto es vacio se usa el payload
      prop: field.relationshipParamPropName, // id
    });
  }

  if (
    field.fieldType === DynamicComponentTypes.FORM_MULTI_SELECT ||
    field.fieldType === DynamicComponentTypes.FORM_MULTI_SELECT_ASYNC ||
    field.fieldType === DynamicComponentTypes.FORM_MULTI_SELECT_CREATABLE ||
    field.fieldType === DynamicComponentTypes.FORM_SELECT_CREATABLE ||
    field.fieldType === DynamicComponentTypes.FORM_SELECT ||
    field.fieldType === DynamicComponentTypes.FORM_SELECT_ASYNC
  ) {
    let endpoint = `/cms/with-id/${field.relationshipSchemaId}`;

    if (dynamics && dynamics.entitySchemas) {
      const schema = dynamics.entitySchemas.find((item) => {
        return item.id === field.relationshipSchemaId;
      });

      if (schema && schema.grantedAnonymous_read) {
        endpoint = `/cms/public/${schema.organizationId}/${schema.name}`;
      } else if (schema) {
        endpoint = `/cms/${schema.name}`;
      }
    }

    // '/:schemaName/by-company/:companyId' siendo companyId lo que apendea desde los paramsVariables
    if (field.relationshipRequiresCompanyParam) {
      endpoint += `/by-company`;
    }

    // /cms/pathologies
    // /cms/pathologyTreatments/:id (pathologyId)
    // /cms/userRelatives/:userId
    // /cms/companyClients/:companyId
    specificFormProps.dataSource = {
      // Seteo este nombre como valor del cache
      schemaId: field.relationshipSchemaId,

      contextVariableName: null,
      event: {
        name: field.name + '_formevent',
        eventType: 'http-request',
        http: {
          method: 'get',
          endpoint,
          paramsVariables,

          queryFilters: [
            {
              contextVariableName: '', // si esto es vacio se usa el payload
              prop: 'text',

              targetFilterName: field.relationshipSchemaLabelPropName,
              filterOperator: '$contains',
            },
          ],
          url: null,
        },
      },
    };

    specificFormProps.optionIdProp = 'id';

    // TODO Michel pedir los valores en el front
    specificFormProps.optionLabelProps = [field.relationshipSchemaLabelPropName];
    specificFormProps.optionLabelPropsSeparator = '';
    specificFormProps.noOptionsText = 'Search by ' + field.relationshipSchemaLabelPropName;

    // sirve para mostrar los botones de 'crear nuevo' en caso de que sea un field que se relaciona con otra tabla y que el usuario tenga permisos para poder hacerlo
    specificFormProps.showCreateNewItem = showCreateNewItem;
  }

  let componentFieldType = field.fieldType;

  if (field.fieldType === DynamicComponentTypes.RELATIONSHIP) {
    componentFieldType = DynamicComponentTypes.FORM_SELECT_ASYNC;

    let endpoint = `/cms/with-id/${field.relationshipSchemaId}/`;

    if (dynamics && dynamics.entitySchemas) {
      const schema = dynamics.entitySchemas.find((item) => {
        return item.id === field.relationshipSchemaId;
      });

      if (schema && schema.grantedAnonymous_read) {
        endpoint = `/cms/public/${schema.organizationId}/${schema.name}`;
      } else if (schema) {
        endpoint = `/cms/${schema.name}`;
      }
    }

    // '/:schemaName/by-company/:companyId' siendo companyId lo que apendea desde los paramsVariables
    if (field.relationshipRequiresCompanyParam) {
      endpoint += `/by-company/`;
    }

    specificFormProps.dataSource = {
      schemaId: field.relationshipSchemaId,

      contextVariableName: null,
      event: {
        name: field.name + '_formevent',
        eventType: 'http-request',
        http: {
          method: 'get',
          endpoint,
          paramsVariables,

          queryFilters: [
            {
              contextVariableName: '', // si esto es vacio se usa el payload
              prop: 'text',

              targetFilterName: field.relationshipSchemaLabelPropName,
              filterOperator: '$contains',
            },
          ],
          url: null,
        },
      },
    };

    specificFormProps.optionIdProp = 'id';

    // TODO Michel pedir los valores en el front
    specificFormProps.optionLabelProps = [field.relationshipSchemaLabelPropName];
    specificFormProps.optionLabelPropsSeparator = '';
    specificFormProps.noOptionsText = 'Search by ' + field.relationshipSchemaLabelPropName;

    // sirve para mostrar los botones de 'crear nuevo' en caso de que sea un field que se relaciona con otra tabla y que el usuario tenga permisos para poder hacerlo
    specificFormProps.showCreateNewItem = showCreateNewItem;
  }

  if (field.fieldType === DynamicComponentTypes.USER) {
    componentFieldType = DynamicComponentTypes.FORM_SELECT_ASYNC;

    let endpoint = `/cms/with-id/${field.relationshipSchemaId}/`;

    if (dynamics && dynamics.entitySchemas) {
      const schema = dynamics.entitySchemas.find((item) => {
        return item.id === field.relationshipSchemaId;
      });

      if (schema && schema.grantedAnonymous_read) {
        endpoint = `/cms/public/${schema.organizationId}/${schema.name}`;
      } else if (schema) {
        endpoint = `/cms/${schema.name}`;
      }
    }

    specificFormProps.dataSource = {
      schemaId: field.relationshipSchemaId,

      contextVariableName: null,
      event: {
        name: field.name + '_formevent',
        eventType: 'http-request',
        http: {
          method: 'get',
          endpoint,
          paramsVariables,

          queryFilters: [
            {
              contextVariableName: '', // si esto es vacio se usa el payload
              prop: 'text',

              targetFilterName: 'firstName',
              filterOperator: '$or',
            },
            {
              contextVariableName: '', // si esto es vacio se usa el payload
              prop: 'text',

              targetFilterName: 'lastName',
              filterOperator: '$or',
            },
            {
              contextVariableName: '', // si esto es vacio se usa el payload
              prop: 'text',

              targetFilterName: 'identificationNumber',
              filterOperator: '$or',
            },
          ],
          url: null,
        },
      },
    };

    specificFormProps.optionIdProp = 'id';

    specificFormProps.optionLabelProps = ['firstName', 'lastName'];
    specificFormProps.optionLabelPropsSeparator = '';
    specificFormProps.noOptionsText = 'Search by name';

    // sirve para mostrar los botones de 'crear nuevo' en caso de que sea un field que se relaciona con otra tabla y que el usuario tenga permisos para poder hacerlo
    specificFormProps.showCreateNewItem = showCreateNewItem;
  }

  return {
    id: field.id,
    name: field.name,
    label: field.label,
    type: componentFieldType,
    placeholder: field.placeholder,
    // errorMsg: 'name is required.',

    dimensions: { xs: field.dimensions_xs, sm: field.dimensions_sm },
    validation: { isRequired: field.isRequired },
    hidden: field.enableHidden ? { create: field.hidden_create, edit: field.hidden_edit } : null,
    readOnly: field.enableReadOnly ? { create: field.readOnly_create, edit: field.readOnly_edit } : null,
    tooltip: field.tooltip,
    // initialValue: field.initial,

    conditionalRender: field.enableConditionalRender
      ? [
          {
            when: field.conditionalRenderWhen,
            is: [field.conditionalRenderIs],
          },
        ]
      : null,

    customMask: field.enableCustomMask ? field.textCustomMask : null,
    componentProps: field.componentProps ? field.componentProps : null,

    enableTextArea: field.enableTextArea ? field.enableTextArea : null,
    enableHtmlEditor: field.enableHtmlEditor ? field.enableHtmlEditor : null,
    textAreaRows: field.textAreaRows ? field.textAreaRows : null,

    ...specificFormProps,
  };
};

export const schemaToForm = (
  entitySchema: IEntitySchema,
  entitySchemaFields: IEntitySchemaField[],
  fieldGroups: IEntitySchemaFieldGroup[] | null,
  dynamics: IDynamicsContext | null,
  showCreateNewItems?: boolean | null
) => {
  const steps: FormStepType[] = [];

  // userProducts: userId, productId
  const filteredFields = entitySchemaFields.filter((field) => {
    // solo me quedo con los fields que son relaciones hacia otra coleccion
    return (
      field.fieldType !== DynamicComponentTypes.RELATIONSHIP ||
      (field.fieldType === DynamicComponentTypes.RELATIONSHIP &&
        field.relationshipSchemaId === entitySchema.relationshipTargetSchemaId)
    );
  });

  const componentsWithoutGroup = filteredFields
    .filter((field) => {
      return !field.fieldGroupId;
    })
    .map((field) => {
      const component = schemaFieldToFormComponent(field, dynamics, showCreateNewItems);

      return component;
    });

  // const componentsWithoutGroups = components.filter((comp)=>{return comp})

  if (componentsWithoutGroup.length) {
    const step1: FormStepType = {
      title: '',
      subTitle: '',
      iconName: '',
      stepName: '@@stepMain@@',

      components: componentsWithoutGroup,
    };
    steps.push(step1);
  }

  filteredFields
    .filter((field) => {
      return field.fieldGroupId;
    })
    .forEach((field) => {
      const fieldGroup = fieldGroups?.find((fg) => {
        return fg.id === field.fieldGroupId;
      });

      if (!fieldGroup) return;

      let fieldStep = steps.find((step) => {
        return step.title === fieldGroup.title;
      });

      if (!fieldStep) {
        fieldStep = {
          title: fieldGroup.title,
          subTitle: fieldGroup.subTitle,
          iconName: fieldGroup.icon,
          stepName: fieldGroup.title, // uso el titulo pq es mi identificador en lugar de id

          components: [],
        };
        steps.push(fieldStep);
      }

      const component = schemaFieldToFormComponent(field, dynamics, showCreateNewItems);

      fieldStep.components.push(component);
    });

  if (steps.length === 0) {
    const step1: FormStepType = {
      title: 'No components for this form',
      subTitle: '',
      iconName: '',
      stepName: '@@stepMain@@',

      components: componentsWithoutGroup,
    };
    steps.push(step1);
  }

  // build and ser add form
  const theForm = {
    id: 'form_' + entitySchema.id,
    // schema: schemas.create,

    requiredVariables: [],
    requiredEvents: [],
    preDefinedEvents: [],

    // preload: [{ ...dataSource1, variableName: dataSource1.variableName }], // puede overradear
    steps,
    postload: [],

    submitEvents: [],
    // submitEvents: [{ name: 'onPatientRelativeSubmit' }],
  };

  return theForm;
};

export const listEntityDataBySchema = async (
  currentUser: IUser,
  entitySchema: IEntitySchema,
  entitySchemaFields: IEntitySchemaField[],

  parentEntitySchema?: IEntitySchema | null,
  parentEntityData?: any | null
) => {
  let data: any[] = [];

  if (
    entitySchema.schemaType === EntitySchemaTypes.MAIN_ENTITY ||
    entitySchema.schemaType === EntitySchemaTypes.SELECT_OPTIONS_ENTITY ||
    entitySchema.schemaType === EntitySchemaTypes.COMPANY_ENTITY ||
    entitySchema.schemaType === EntitySchemaTypes.USER_ENTITY
  ) {
    let endpoint = '/cms/' + entitySchema.name;

    if (entitySchema.grantedAnonymous_read) {
      endpoint = `/cms/public/${entitySchema.organizationId}/${entitySchema.name}`;
    }

    const response = await dynamicGet({ params: endpoint });

    data = response.items;
  }

  if (
    entitySchema.schemaType === EntitySchemaTypes.ONE_TO_MANY_ENTITY ||
    entitySchema.schemaType === EntitySchemaTypes.RELATIONSHIP_ENTITY ||
    entitySchema.schemaType === EntitySchemaTypes.RELATIONSHIP_USER2USER_ENTITY ||
    entitySchema.schemaType === EntitySchemaTypes.COMPANY_EMPLOYEES_ENTITY
  ) {
    const relationshipSourceField = entitySchemaFields.find((field) => {
      return field.relationshipSchemaId === entitySchema.relationshipSourceSchemaId;
    });

    if (!relationshipSourceField) throw new Error('Missing field ' + entitySchema.relationshipSourceSchemaId);

    // eg: userPathologies >> entitySchema.relationshipSourceSchemaId: users
    if (
      entitySchema.relationshipSourceSchemaId === parentEntitySchema?.id ||
      // Si el relationshipSourceSchemaId es users y el parent es de tipo usuario, entonces asumo que es una consulta por este usuario
      (entitySchema.relationshipSourceSchemaId === USERS_SCHEMA.id &&
        parentEntitySchema?.schemaType === EntitySchemaTypes.USER_ENTITY)
    ) {
      if (parentEntitySchema?.schemaType === EntitySchemaTypes.USER_ENTITY) {
        let response = null;
        if (parentEntityData.id === currentUser.id) {
          response = await dynamicGet({
            params: '/cms/' + entitySchema.name + '/mine',
          });
        } else {
          response = await dynamicGet({
            params: '/cms/' + entitySchema.name + '/by-user/' + parentEntityData.id,
          });
        }
        data = response.items;
      } else if (parentEntitySchema?.schemaType === EntitySchemaTypes.COMPANY_ENTITY) {
        const response = await dynamicGet({
          params: '/cms/' + entitySchema.name + '/by-company/' + parentEntityData.id,
        });

        data = response.items;
      } else {
        const response = await dynamicGet({
          params: '/cms/' + entitySchema.name + '/by-prop/' + relationshipSourceField.name + '/' + parentEntityData.id,
        });

        data = response.items;
      }
    } else if (parentEntityData) {
      const response = await dynamicGet({
        params: '/cms/' + entitySchema.name + '/by-prop/' + relationshipSourceField.name + '/' + parentEntityData.id,
      });

      data = response.items;
    } else {
      const response = await dynamicGet({ params: '/cms/' + entitySchema.name });
      data = response.items;
    }

    if (entitySchema.schemaType === EntitySchemaTypes.RELATIONSHIP_USER2USER_ENTITY) {
    }
    // En caso de obtener una coleccion que es una relacion (eg: userProducts), entonces de cada elemento me quedo con el sourceEntity dentro de las deps
    else {
      data = data.map((item) => {
        if (!entitySchema.relationshipTargetSchemaId) return item;

        const relationshipTargetField = entitySchemaFields.find((field) => {
          return field.relationshipSchemaId === entitySchema.relationshipTargetSchemaId;
        });

        if (!relationshipTargetField) return item;

        const sourceEntity = getSourceEntityData({ obj: item, key: relationshipTargetField.name });

        if (sourceEntity) {
          return { ...sourceEntity, '@sourceId': item.id }; // le dejo el id del registro
        }

        return item;
      });
    }
  }

  return data;
};

export const getEntityDataBySchema = async (
  currentUser: IUser,
  entitySchema: IEntitySchema,
  entitySchemaFields: IEntitySchemaField[],
  id: string,
  parentEntitySchema?: IEntitySchema | null,
  parentEntityData?: any | null
) => {
  let data: any = null;
  if (
    entitySchema.schemaType === EntitySchemaTypes.MAIN_ENTITY ||
    entitySchema.schemaType === EntitySchemaTypes.SELECT_OPTIONS_ENTITY ||
    entitySchema.schemaType === EntitySchemaTypes.COMPANY_ENTITY ||
    entitySchema.schemaType === EntitySchemaTypes.USER_ENTITY ||
    entitySchema.schemaType === EntitySchemaTypes.COMPANY_EMPLOYEES_ENTITY
  ) {
    let endpoint = '/cms/' + entitySchema.name + '/' + id;

    if (entitySchema.grantedAnonymous_read) {
      endpoint = `/cms/public/${entitySchema.organizationId}/${entitySchema.name}/${id}`;
    }

    const response = await dynamicGet({ params: endpoint });

    data = response;
  }

  if (
    entitySchema.schemaType === EntitySchemaTypes.ONE_TO_MANY_ENTITY ||
    entitySchema.schemaType === EntitySchemaTypes.RELATIONSHIP_ENTITY ||
    entitySchema.schemaType === EntitySchemaTypes.RELATIONSHIP_USER2USER_ENTITY
  ) {
    const relationshipSourceField = entitySchemaFields.find((field) => {
      return field.relationshipSchemaId === entitySchema.relationshipSourceSchemaId;
    });

    if (!relationshipSourceField) throw new Error('Missing field ' + entitySchema.relationshipSourceSchemaId);

    // eg: userPathologies >> entitySchema.relationshipSourceSchemaId: users
    if (
      entitySchema.relationshipSourceSchemaId === parentEntitySchema?.id ||
      // Si el relationshipSourceSchemaId es users y el parent es de tipo usuario, entonces asumo que es una consulta por este usuario
      (entitySchema.relationshipSourceSchemaId === USERS_SCHEMA.id &&
        parentEntitySchema?.schemaType === EntitySchemaTypes.USER_ENTITY)
    ) {
      if (parentEntitySchema?.schemaType === EntitySchemaTypes.USER_ENTITY) {
        let response = null;
        if (parentEntityData.id === currentUser.id) {
          response = await dynamicGet({
            params: '/cms/' + entitySchema.name + '/mine/' + id,
          });
        } else {
          response = await dynamicGet({
            params: '/cms/' + entitySchema.name + '/by-user/' + parentEntityData.id + '/' + id,
          });
        }

        data = response;
      } else if (parentEntitySchema?.schemaType === EntitySchemaTypes.COMPANY_ENTITY) {
        const response = await dynamicGet({
          params: '/cms/' + entitySchema.name + '/by-company/' + parentEntityData.id + '/' + id,
        });

        data = response;
      } else {
        const response = await dynamicGet({
          params:
            '/cms/' +
            entitySchema.name +
            '/by-prop/' +
            relationshipSourceField.name +
            '/' +
            parentEntityData.id +
            '/' +
            id,
        });

        data = response;
      }
    } else {
      if (parentEntityData) {
        const response = await dynamicGet({
          params:
            '/cms/' +
            entitySchema.name +
            '/by-prop/' +
            relationshipSourceField.name +
            '/' +
            parentEntityData.id +
            '/' +
            id,
        });
        data = response;
      } else {
        const response = await dynamicGet({
          params: '/cms/' + entitySchema.name + '/' + id,
        });
        data = response;
      }
    }
  }

  return data;
};

export const createEntityDataBySchema = async (
  currentUser: IUser,
  entitySchema: IEntitySchema,
  entitySchemaFields: IEntitySchemaField[],
  formData: any,
  parentEntitySchema?: IEntitySchema | null,
  parentEntityData?: any | null
) => {
  let data: any = null;

  if (
    entitySchema.schemaType === EntitySchemaTypes.RELATIONSHIP_ENTITY ||
    entitySchema.schemaType === EntitySchemaTypes.ONE_TO_MANY_ENTITY ||
    entitySchema.schemaType === EntitySchemaTypes.COMPANY_EMPLOYEES_ENTITY
  ) {
    const relationshipSourceField = entitySchemaFields.find((field) => {
      return field.relationshipSchemaId === entitySchema.relationshipSourceSchemaId;
    });

    if (!relationshipSourceField) throw new Error('Missing field ' + entitySchema.relationshipSourceSchemaId);

    // eg: userPathologies >> entitySchema.relationshipSourceSchemaId: users
    if (
      entitySchema.relationshipSourceSchemaId === parentEntitySchema?.id ||
      // Si el relationshipSourceSchemaId es users y el parent es de tipo usuario, entonces asumo que es una consulta por este usuario
      (entitySchema.relationshipSourceSchemaId === USERS_SCHEMA.id &&
        parentEntitySchema?.schemaType === EntitySchemaTypes.USER_ENTITY)
    ) {
      if (parentEntitySchema?.schemaType === EntitySchemaTypes.USER_ENTITY) {
        let response = null;
        if (parentEntityData.id === currentUser.id) {
          response = await dynamicCreate({
            params: '/cms/' + entitySchema.name + '/mine/',
            data: formData,
          });
        } else {
          response = await dynamicCreate({
            params: '/cms/' + entitySchema.name + '/by-user/' + parentEntityData.id,
            data: formData,
          });
        }

        data = response;
      } else if (parentEntitySchema?.schemaType === EntitySchemaTypes.COMPANY_ENTITY) {
        const response = await dynamicCreate({
          params: '/cms/' + entitySchema.name + '/by-company/' + parentEntityData.id,
          data: formData,
        });

        data = response;
      } else {
        // por defecto, la relacion se espera que este en el conotenido
        const response = await dynamicCreate({ params: '/cms/' + entitySchema.name, data: formData });

        data = response;
      }
    } else {
      // por defecto, la relacion se espera que este en el conotenido
      const response = await dynamicCreate({ params: '/cms/' + entitySchema.name, data: formData });

      data = response;
    }
  } else {
    // por defecto (main-entity o select-entity)
    const response = await dynamicCreate({ params: '/cms/' + entitySchema.name, data: formData });

    data = response;
  }

  invalidateCache('/cms/' + entitySchema.name);

  return data;
};

export const updateEntityDataBySchema = async (
  currentUser: IUser,
  entitySchema: IEntitySchema,
  entitySchemaFields: IEntitySchemaField[],
  id: string,
  formData: any,
  parentEntitySchema?: IEntitySchema | null,
  parentEntityData?: any | null
) => {
  let data: any = null;

  if (
    entitySchema.schemaType === EntitySchemaTypes.RELATIONSHIP_ENTITY ||
    entitySchema.schemaType === EntitySchemaTypes.ONE_TO_MANY_ENTITY
  ) {
    const relationshipSourceField = entitySchemaFields.find((field) => {
      return field.relationshipSchemaId === entitySchema.relationshipSourceSchemaId;
    });

    if (!relationshipSourceField) throw new Error('Missing field ' + entitySchema.relationshipSourceSchemaId);

    // eg: userPathologies >> entitySchema.relationshipSourceSchemaId: users
    if (
      entitySchema.relationshipSourceSchemaId === parentEntitySchema?.id ||
      // Si el relationshipSourceSchemaId es users y el parent es de tipo usuario, entonces asumo que es una consulta por este usuario
      (entitySchema.relationshipSourceSchemaId === USERS_SCHEMA.id &&
        parentEntitySchema?.schemaType === EntitySchemaTypes.USER_ENTITY)
    ) {
      if (parentEntitySchema?.schemaType === EntitySchemaTypes.USER_ENTITY) {
        let response = null;
        if (parentEntityData.id === currentUser.id) {
          response = await dynamicUpdate({
            params: '/cms/' + entitySchema.name + '/mine/' + id,
            data: formData,
          });
        } else {
          response = await dynamicUpdate({
            params: '/cms/' + entitySchema.name + '/by-user/' + parentEntityData.id + '/' + id,
            data: formData,
          });
        }

        data = response;
      } else if (parentEntitySchema?.schemaType === EntitySchemaTypes.COMPANY_ENTITY) {
        const response = await dynamicUpdate({
          params: '/cms/' + entitySchema.name + '/by-company/' + parentEntityData.id + '/' + id,
          data: formData,
        });

        data = response;
      } else {
        // por defecto, la relacion se espera que este en el conotenido
        const response = await dynamicUpdate({ params: '/cms/' + entitySchema.name + '/' + id, data: formData });

        data = response;
      }
    } else {
      // por defecto, la relacion se espera que este en el conotenido
      const response = await dynamicUpdate({ params: '/cms/' + entitySchema.name + '/' + id, data: formData });

      data = response;
    }
  } else {
    // por defecto (main-entity o select-entity)
    const response = await dynamicUpdate({ params: '/cms/' + entitySchema.name + '/' + id, data: formData });

    data = response;
  }

  invalidateCache('/cms/' + entitySchema.name);

  return data;
};

export const removeEntityDataBySchema = async (
  currentUser: IUser,
  entitySchema: IEntitySchema,
  entitySchemaFields: IEntitySchemaField[],
  id: string,

  parentEntitySchema?: IEntitySchema | null,
  parentEntityData?: any | null
) => {
  let data: any = null;

  if (
    entitySchema.schemaType === EntitySchemaTypes.RELATIONSHIP_ENTITY ||
    entitySchema.schemaType === EntitySchemaTypes.ONE_TO_MANY_ENTITY
  ) {
    const relationshipSourceField = entitySchemaFields.find((field) => {
      return field.relationshipSchemaId === entitySchema.relationshipSourceSchemaId;
    });

    if (!relationshipSourceField) throw new Error('Missing field ' + entitySchema.relationshipSourceSchemaId);

    // eg: userPathologies >> entitySchema.relationshipSourceSchemaId: users
    if (
      entitySchema.relationshipSourceSchemaId === parentEntitySchema?.id ||
      // Si el relationshipSourceSchemaId es users y el parent es de tipo usuario, entonces asumo que es una consulta por este usuario
      (entitySchema.relationshipSourceSchemaId === USERS_SCHEMA.id &&
        parentEntitySchema?.schemaType === EntitySchemaTypes.USER_ENTITY)
    ) {
      if (parentEntitySchema?.schemaType === EntitySchemaTypes.USER_ENTITY) {
        let response = null;
        if (parentEntityData.id === currentUser.id) {
          response = await dynamicRemove({
            params: '/cms/' + entitySchema.name + '/mine/' + id,
          });
        } else {
          response = await dynamicRemove({
            params: '/cms/' + entitySchema.name + '/by-user/' + parentEntityData.id + '/' + id,
          });
        }

        data = response;
      } else if (parentEntitySchema?.schemaType === EntitySchemaTypes.COMPANY_ENTITY) {
        const response = await dynamicRemove({
          params: '/cms/' + entitySchema.name + '/by-company/' + parentEntityData.id + '/' + id,
        });

        data = response;
      } else {
        // por defecto, la relacion se espera que este en el conotenido
        const response = await dynamicRemove({ params: '/cms/' + entitySchema.name + '/' + id });

        data = response;
      }
    } else {
      // por defecto, la relacion se espera que este en el conotenido
      const response = await dynamicRemove({ params: '/cms/' + entitySchema.name + '/' + id });

      data = response;
    }
  } else {
    // por defecto (main-entity o select-entity)
    const response = await dynamicRemove({ params: '/cms/' + entitySchema.name + '/' + id });

    data = response;
  }

  invalidateCache('/cms/' + entitySchema.name);

  return data;
};

export const restoreEntityDataBySchema = async (
  currentUser: IUser,
  entitySchema: IEntitySchema,
  entitySchemaFields: IEntitySchemaField[],
  id: string,

  parentEntitySchema?: IEntitySchema | null,
  parentEntityData?: any | null
) => {
  let data: any = null;

  if (
    entitySchema.schemaType === EntitySchemaTypes.RELATIONSHIP_ENTITY ||
    entitySchema.schemaType === EntitySchemaTypes.ONE_TO_MANY_ENTITY
  ) {
    const relationshipSourceField = entitySchemaFields.find((field) => {
      return field.relationshipSchemaId === entitySchema.relationshipSourceSchemaId;
    });

    if (!relationshipSourceField) throw new Error('Missing field ' + entitySchema.relationshipSourceSchemaId);

    // eg: userPathologies >> entitySchema.relationshipSourceSchemaId: users
    if (
      entitySchema.relationshipSourceSchemaId === parentEntitySchema?.id ||
      // Si el relationshipSourceSchemaId es users y el parent es de tipo usuario, entonces asumo que es una consulta por este usuario
      (entitySchema.relationshipSourceSchemaId === USERS_SCHEMA.id &&
        parentEntitySchema?.schemaType === EntitySchemaTypes.USER_ENTITY)
    ) {
      if (parentEntitySchema?.schemaType === EntitySchemaTypes.USER_ENTITY) {
        let response = null;
        if (parentEntityData.id === currentUser.id) {
          response = await dynamicUpdate({
            params: '/cms/' + entitySchema.name + '/restore/mine/' + id,
          });
        } else {
          response = await dynamicUpdate({
            params: '/cms/' + entitySchema.name + '/restore/by-user/' + parentEntityData.id + '/' + id,
          });
        }

        data = response;
      } else if (parentEntitySchema?.schemaType === EntitySchemaTypes.COMPANY_ENTITY) {
        const response = await dynamicUpdate({
          params: '/cms/' + entitySchema.name + '/restore/by-company/' + parentEntityData.id + '/' + id,
        });

        data = response;
      } else {
        // por defecto, la relacion se espera que este en el conotenido
        const response = await dynamicUpdate({ params: '/cms/' + entitySchema.name + '/restore/' + id });

        data = response;
      }
    } else {
      // por defecto, la relacion se espera que este en el conotenido
      const response = await dynamicUpdate({ params: '/cms/' + entitySchema.name + '/restore/' + id });

      data = response;
    }
  } else {
    // por defecto (main-entity o select-entity)
    const response = await dynamicUpdate({ params: '/cms/' + entitySchema.name + '/restore/' + id });

    data = response;
  }

  invalidateCache('/cms/' + entitySchema.name);

  return data;
};

export const getEditEntityForm = (
  entitySchema: IEntitySchema,
  entitySchemaFields: IEntitySchemaField[],
  dynamics: any
) => {
  let theForm = null;
  if (entitySchema.schemaType === EntitySchemaTypes.USER_ENTITY) {
    const theEntityForm = schemaToForm(
      entitySchema,
      entitySchemaFields?.filter((field) => {
        // saco el field userId
        return field.name !== 'userId';
      }),
      null,
      dynamics,
      true
    );

    // const usersSchemaResponse = (await getEntitySchemaByName(USERS_SCHEMA.name)) as IEntitySchemaWithFields;

    // Deberia en los fields devolver los del users
    if (!dynamics.entitySchemas || !dynamics.entitySchemasFields) throw new Error('dynamic entitySchemas not found');

    const usersSchemaResponse = dynamics.entitySchemas.find((schema: IEntitySchema) => {
      return schema.name === USERS_SCHEMA.name;
    });
    if (!usersSchemaResponse) throw new Error('Missing schemaName: ' + USERS_SCHEMA.name);

    const usersSchemaResponseFields = dynamics.entitySchemasFields.filter((field: IEntitySchemaField) => {
      return field.schemaId === usersSchemaResponse.id;
    });

    const theUserForm = schemaToForm(usersSchemaResponse, usersSchemaResponseFields, null, dynamics, true);

    if (!theUserForm.steps[0].title) {
      theUserForm.steps[0].title = 'User';
      theUserForm.steps[0].iconName = 'tabler:user';
    }

    if (theEntityForm.steps.length && !theEntityForm.steps[0].title) {
      theEntityForm.steps[0].title = capitalize(entitySchema.name);
      theEntityForm.steps[0].iconName = 'tabler:code';
    }

    // si la entidad no tiene fields propios entonces muestro solo los del usuario en un unico step
    if (!theEntityForm.steps[0].components.length) theEntityForm.steps = [...theUserForm.steps];
    else theEntityForm.steps = [...theUserForm.steps, ...theEntityForm.steps];

    theForm = theEntityForm;
  } else {
    theForm = schemaToForm(entitySchema, entitySchemaFields, null, dynamics, true);
  }

  return theForm;
};

export const processConditionalRender = (components: IDynamicComponent[], values: any) => {
  const arr: IDynamicComponent[] = [];

  components.forEach((component) => {
    if (!component.conditionalRender) arr.push(component);
    else {
      let hidden = true;

      component.conditionalRender.forEach((cr) => {
        if (!hidden || !values) return;

        let fieldValue = values[cr.when];

        if (fieldValue && fieldValue.value) fieldValue = fieldValue.value; // for selects

        if (
          fieldValue &&
          cr.is.find((item) => {
            return item === CONDITIONAL_RENDER_NON_EMPTY_STRING || item === fieldValue;
          })
        ) {
          hidden = false;
        }
      });

      component.hidden = { create: hidden, edit: hidden };
      arr.push(component);
    }
  });

  return arr;
};

export const processPreSubmitValues = (itemValues: any) => {
  if (itemValues) {
    const keys = Object.keys(itemValues);

    keys.forEach((key) => {
      const itemValue = itemValues[key];

      if (Array.isArray(itemValue)) {
        itemValue.forEach((aa, index) => {
          if (!aa || !aa.isOptionField) return;
          itemValue[index] = aa.value;
        });

        itemValues[key] = itemValue;
      } else {
        if (!itemValue || !itemValue.isOptionField) return;

        // es un select async
        itemValues[key] = itemValue.value;
      }
    });
  }

  return itemValues;
};
