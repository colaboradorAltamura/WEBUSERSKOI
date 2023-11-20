// formik components

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useEffect, useState } from 'react';
import Icon from 'src/@core/components/icon';
import Loader from 'src/@core/components/loader';
import {
  USERS_SCHEMA,
  getSourceEntityData,
  handleError,
  hasRole,
  parseDateToDateTimeString,
  splitByUppercase,
} from 'src/@core/coreHelper';
import { getEntitySchemaById, getEntitySchemaByName } from 'src/services/entitiesSchemasServices';
import { DynamicComponentTypes, IDynamicInlineComponent, IForm } from 'src/types/dynamics';
import { EntitySchemaTypes, IEntitySchema, IEntitySchemaField, IEntitySchemaWithFields } from 'src/types/entities';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { IconButton, Tooltip, capitalize } from '@mui/material';
import { useRouter } from 'next/router';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { IUser } from 'src/types/users';
import DynamicFormSidebar from './DynamicFormSidebar';
import { createEntityDataBySchema, listEntityDataBySchema, schemaToForm } from './helpers';
import CustomAvatar from 'src/@core/components/mui/avatar';

import { getInitials } from 'src/@core/utils/get-initials';

import { useTranslation } from 'react-i18next';
import { useDynamics } from 'src/hooks/useDynamics';
import _ from 'lodash';

interface PropsType {
  customEditRoute?: (itemId: string) => string;
  useCmsRoutes?: boolean;
  parentEntitySchema?: IEntitySchema | null;
  parentEntityData?: any;

  schemaName: string;

  initialValues?: any;
  onSchemaFetched?: (form: any) => Promise<any>;

  inlineComponents?: IDynamicInlineComponent[];
}

interface CellType {
  row: any;
}

const DynamicSchemaLayoutList = ({
  customEditRoute,
  useCmsRoutes,
  parentEntitySchema,
  parentEntityData,

  schemaName,

  onSchemaFetched,
}: PropsType) => {
  // ** Hooks
  const router = useRouter();
  const currentUser = useCurrentUser();
  const dynamics = useDynamics();
  const { t } = useTranslation();

  const queryAction = router.query['action'] as string;

  // ** State
  const [entitySchema, setEntitySchema] = useState<IEntitySchema | null>(null);
  const [entitySchemaFields, setEntitySchemaFields] = useState<IEntitySchemaField[]>([]);

  const [entityRelationshipTargetSchema, setEntityRelationshipTargetSchema] = useState<IEntitySchema | null>(null);
  const [entityRelationshipTargetSchemaFields, setEntityRelationshipTargetSchemaFields] = useState<
    IEntitySchemaField[]
  >([]);

  const [isUserEntitySchema, setIsUserEntitySchema] = useState<boolean>(false);
  const [userEntitySchema, setUserEntitySchema] = useState<IEntitySchema | null>(null);
  const [userEntitySchemaFields, setUserEntitySchemaFields] = useState<IEntitySchemaField[]>([]);

  const [entitiesData, setEntitiesData] = useState<any[]>([]);

  const [loadingSchema, setLoadingSchema] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 });
  const [addSidebarOpen, setAddSidebarOpen] = useState<boolean>(queryAction === 'create' ? true : false);
  const [toggleData, setToggleData] = useState<boolean>(false);
  const [addNewEntityForm, setAddNewEntityForm] = useState<IForm | undefined>();

  const [columns, setColumns] = useState<GridColDef[]>([]);

  const toggleAddDrawer = () => setAddSidebarOpen(!addSidebarOpen);

  // ** Effects
  useEffect(() => {
    if (!schemaName) return;

    const doAsync = async () => {
      try {
        if (dynamics.isLoadingSchemas || !dynamics.entitySchemas || !dynamics.entitySchemasFields) return null;

        const schema = dynamics.entitySchemas.find((schema) => {
          return schema.name === schemaName;
        });
        if (!schema) throw new Error('Missing schemaName: ' + schemaName);
        const schemaFields = dynamics.entitySchemasFields.filter((field) => {
          return field.schemaId === schema.id;
        });

        // Fetch Schema
        // const entitySchemaResponse = (await getEntitySchemaByName(schemaName)) as IEntitySchemaWithFields;
        const entitySchemaResponse: IEntitySchemaWithFields = { ...schema, fields: schemaFields };

        if (onSchemaFetched) onSchemaFetched(entitySchemaResponse);

        setEntitySchema(entitySchemaResponse);
        setEntitySchemaFields(
          entitySchemaResponse.fields.sort((a, b) => {
            return a.order - b.order;
          })
        );
        console.log('Schema fetched OK', schemaName);

        // si el schema es de tipo relacion, entonces busco el schema 'target'
        // eg: usersProducts, buscaria schema products para mostrar en la tabla
        if (
          (entitySchemaResponse.schemaType === EntitySchemaTypes.RELATIONSHIP_ENTITY ||
            entitySchemaResponse.schemaType === EntitySchemaTypes.COMPANY_EMPLOYEES_ENTITY) &&
          entitySchemaResponse.relationshipTargetSchemaId
        ) {
          // Fetch target entity schema
          // const entityRelationshipTargetSchemaResponse = (await getEntitySchemaById(
          //   entitySchemaResponse.relationshipTargetSchemaId
          // )) as IEntitySchemaWithFields;

          if (!dynamics.entitySchemas || !dynamics.entitySchemasFields)
            throw new Error('dynamic entitySchemas not found');

          const entityRelationshipTargetSchemaResponse = dynamics.entitySchemas.find((schema) => {
            return schema.id === entitySchemaResponse.relationshipTargetSchemaId;
          });
          if (!entityRelationshipTargetSchemaResponse)
            throw new Error('Missing schemaId: ' + entitySchemaResponse.relationshipTargetSchemaId);

          const entityRelationshipTargetSchemaResponseFields = dynamics.entitySchemasFields.filter((field) => {
            return field.schemaId === entityRelationshipTargetSchemaResponse.id;
          });

          setEntityRelationshipTargetSchema(entityRelationshipTargetSchemaResponse);
          setEntityRelationshipTargetSchemaFields(entityRelationshipTargetSchemaResponseFields);

          if (entitySchemaResponse.schemaType === EntitySchemaTypes.COMPANY_EMPLOYEES_ENTITY) {
            const usersSchemaResponse = dynamics.entitySchemas.find((schema) => {
              return schema.name === USERS_SCHEMA.name;
            });
            if (!usersSchemaResponse) throw new Error('Missing schemaName: ' + schemaName);
            const usersSchemaResponseFields = dynamics.entitySchemasFields.filter((field) => {
              return field.schemaId === usersSchemaResponse.id;
            });

            setUserEntitySchema(usersSchemaResponse);
            setUserEntitySchemaFields(usersSchemaResponseFields);
          }
        } else if (entitySchemaResponse.schemaType === EntitySchemaTypes.RELATIONSHIP_USER2USER_ENTITY) {
          // relationshipSourceSchemaId?: string;
          // relationshipTargetSchemaId?: string;

          // relationshipSourceRequiredRols?: string[];
          // relationshipTargetRequiredRols?: string[];

          // fixedRoleId?: string;

          const currentEntityIsSource = user2UserUserIsSource();

          if (currentEntityIsSource && entitySchemaResponse.relationshipTargetSchemaId) {
            // Fetch target entity schema
            // const entityRelationshipTargetSchemaResponse = (await getEntitySchemaById(
            //   entitySchemaResponse.relationshipTargetSchemaId
            // )) as IEntitySchemaWithFields;

            if (!dynamics.entitySchemas || !dynamics.entitySchemasFields)
              throw new Error('dynamic entitySchemas not found');

            const entityRelationshipTargetSchemaResponse = dynamics.entitySchemas.find((schema) => {
              return schema.id === entitySchemaResponse.relationshipTargetSchemaId;
            });
            if (!entityRelationshipTargetSchemaResponse)
              throw new Error('Missing schemaId: ' + entitySchemaResponse.relationshipTargetSchemaId);

            const entityRelationshipTargetSchemaResponseFields = dynamics.entitySchemasFields.filter((field) => {
              return field.schemaId === entityRelationshipTargetSchemaResponse.id;
            });

            setEntityRelationshipTargetSchema(entityRelationshipTargetSchemaResponse);
            setEntityRelationshipTargetSchemaFields(entityRelationshipTargetSchemaResponseFields);
          } else if (entitySchemaResponse.relationshipSourceSchemaId) {
            // Fetch target entity schema
            // const entityRelationshipSourceSchemaResponse = (await getEntitySchemaById(
            //   entitySchemaResponse.relationshipSourceSchemaId
            // )) as IEntitySchemaWithFields;

            if (!dynamics.entitySchemas || !dynamics.entitySchemasFields)
              throw new Error('dynamic entitySchemas not found');

            const entityRelationshipSourceSchemaResponse = dynamics.entitySchemas.find((schema) => {
              return schema.id === entitySchemaResponse.relationshipSourceSchemaId;
            });
            if (!entityRelationshipSourceSchemaResponse)
              throw new Error('Missing schemaId: ' + entitySchemaResponse.relationshipSourceSchemaId);

            const entityRelationshipSourceSchemaResponseFields = dynamics.entitySchemasFields.filter((field) => {
              return field.schemaId === entityRelationshipSourceSchemaResponse.id;
            });

            setEntityRelationshipTargetSchema(entityRelationshipSourceSchemaResponse);
            setEntityRelationshipTargetSchemaFields(entityRelationshipSourceSchemaResponseFields);
          }
        }
        // si el schema es de tipo users, entonces busco el schema 'users' para adicional esos campos al esquema original
        // le saco el userId y dejo mergeados los 2 schemas.
        // eg: patients (que tiene un field que es userId)
        else if (entitySchemaResponse.schemaType === EntitySchemaTypes.USER_ENTITY) {
          // Fetch target entity schema
          // const usersSchemaResponse = (await getEntitySchemaByName(USERS_SCHEMA.name)) as IEntitySchemaWithFields;

          if (!dynamics.entitySchemas || !dynamics.entitySchemasFields)
            throw new Error('dynamic entitySchemas not found');

          const usersSchemaResponse = dynamics.entitySchemas.find((schema) => {
            return schema.name === USERS_SCHEMA.name;
          });
          if (!usersSchemaResponse) throw new Error('Missing schemaName: ' + schemaName);
          const usersSchemaResponseFields = dynamics.entitySchemasFields.filter((field) => {
            return field.schemaId === usersSchemaResponse.id;
          });

          setIsUserEntitySchema(true);

          setUserEntitySchema(usersSchemaResponse);
          setUserEntitySchemaFields(usersSchemaResponseFields);
        }

        setLoadingSchema(false);
      } catch (e: any) {
        handleError(e);
        setLoadingSchema(false);
      }
    };

    doAsync();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaName, dynamics.isLoadingSchemas]);

  // Fetch schema.collectionName
  useEffect(() => {
    const doAsync = async () => {
      try {
        if (!entitySchema || !entitySchemaFields || currentUser.isLoading) return;

        setLoadingData(true);

        if (!currentUser.currentUser) throw new Error('Missing currentUser.currentUser');

        const data: any[] = await listEntityDataBySchema(
          currentUser.currentUser,
          entitySchema,
          entitySchemaFields,

          parentEntitySchema,
          parentEntityData
        );

        setEntitiesData(data);
        setLoadingData(false);
      } catch (e: any) {
        setLoadingData(false);
        handleError(e);
      }
    };

    doAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entitySchema, entitySchemaFields, toggleData, currentUser.isLoading]);

  const renderUser = (user: IUser) => {
    const { firstName, lastName, email, avatarUrl } = user;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {avatarUrl && <CustomAvatar src={avatarUrl} sx={{ mr: 2.5, width: 38, height: 38 }} />}

        {!avatarUrl && (
          <CustomAvatar
            skin='light'
            color={'primary'}
            sx={{
              mr: 2.5,
              width: 38,
              height: 38,
              fontWeight: 500,
              fontSize: (theme) => theme.typography.body1.fontSize,
            }}
          >
            {getInitials((firstName + ' ' + lastName).toUpperCase())}
          </CustomAvatar>
        )}

        <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          <Typography
            noWrap
            // component={Link}
            // href='/apps/user/view/account'
            sx={{
              fontWeight: 500,
              textDecoration: 'none',
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
              textTransform: 'capitalize',
            }}
          >
            {firstName + ' ' + lastName}
          </Typography>
          <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
            {email}
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderAddress = (row: any, field: IEntitySchemaField) => {
    if (!row || !row[field.name] || !row[field.name].addressString) return null;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          <Typography
            noWrap
            // component={Link}
            // href='/apps/user/view/account'
            sx={{
              fontWeight: 500,
              textDecoration: 'none',
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
              textTransform: 'capitalize',
            }}
          >
            {row[field.name].addressString}
          </Typography>
        </Box>
      </Box>
    );
  };

  const updateColumnsData = () => {
    // TODO - aca podria jugar con una coleccion de 'layouts' donde defina las cols a mostrar
    // TODO - Los layouts podrian definir si se usan tablas o cards, y las cards que prop usar para cada campo en caso de
    // TODO - incluso las cards podrian ser de estructuras template o creadas por el usuario (designer)
    // TODO - Tmb podria jugar con campos virtuales que puedan ser funciones a lo excel o estáticos
    const columnsData: GridColDef[] = [];

    // icons col
    columnsData.push({
      flex: 0.1,
      minWidth: 110,
      field: 'icons',
      headerName: '',

      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View Content'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary' }}
              onClick={() => {
                const theId = row['@sourceId'] ? row['@sourceId'] : row.id;
                if (customEditRoute) {
                  router.push(customEditRoute(`${theId}`));
                } else if (useCmsRoutes) {
                  router.push(`/cms/content/${schemaName}/${theId}`);
                } else {
                  router.push(`/${schemaName}/${theId}`);
                }
              }}
            >
              <Icon icon='tabler:eye' />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    });

    // id col
    columnsData.push({
      flex: 0.2,
      minWidth: 110,
      field: 'id',
      headerName: 'id',

      renderCell: ({ row }: CellType) => (
        <Typography
          onClick={() => {
            if (customEditRoute) {
              router.push(customEditRoute(`${row.id}`));
            } else if (useCmsRoutes) {
              router.push(`/cms/content/${schemaName}/${row.id}`);
            } else {
              router.push(`/${schemaName}/${row.id}`);
            }
          }}
          noWrap
          sx={{
            fontWeight: 500,
            textDecoration: 'none',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
            cursor: 'pointer',
          }}
        >
          {row.id}
        </Typography>
      ),
    });

    let tableFields = entitySchemaFields;

    // si la entidad que estoy mostrando es una relacion, entonces uso los fields del target schema de esa relacion como campos de la tabla
    if (
      entitySchema &&
      (entitySchema.schemaType === EntitySchemaTypes.RELATIONSHIP_ENTITY ||
        entitySchema.schemaType === EntitySchemaTypes.COMPANY_EMPLOYEES_ENTITY) &&
      entityRelationshipTargetSchemaFields
    ) {
      tableFields = entityRelationshipTargetSchemaFields;
    }

    // si la entidad que estoy mostrando es un usuario, entonces mezclo los fields
    // if (isUserEntitySchema) {
    //   tableFields = [...userEntitySchemaFields, ...entitySchemaFields].filter((field) => {
    //     // saco el field userId
    //     return field.name !== 'userId';
    //   });
    // }

    // const user2UserUserIsSource()

    tableFields
      .filter((field) => {
        // filtro los de tipo relacion porque ?
        return field.fieldType !== DynamicComponentTypes.RELATIONSHIP;
      })
      .filter((field) => {
        if (entitySchema?.schemaType !== EntitySchemaTypes.RELATIONSHIP_USER2USER_ENTITY) return true;

        if (field.fieldType !== DynamicComponentTypes.USER) return true;

        const targetField = getUser2UserField();

        if (field.id !== targetField?.id) return true;

        return false;
      })
      .sort((a, b) => {
        return a.order - b.order;
      })
      .forEach((field) => {
        columnsData.push({
          flex: 0.2,
          minWidth: 110,
          field: field.name,
          headerName: splitByUppercase(field.label),

          renderCell: ({ row }: CellType) => {
            let rowText = row[field.name];

            if (field.fieldType === DynamicComponentTypes.USER) {
              const dependencyObj = getSourceEntityData({ obj: row, key: field.name });

              if (!dependencyObj) return null;

              return renderUser(dependencyObj as IUser);
            }
            if (field.fieldType === DynamicComponentTypes.ADDRESS) {
              return renderAddress(row, field);
            }
            if (
              field.fieldType === DynamicComponentTypes.FORM_MULTI_SELECT_ASYNC ||
              field.fieldType === DynamicComponentTypes.FORM_SELECT_ASYNC
            ) {
              const dependencyObj = getSourceEntityData({ obj: row, key: field.name });

              if (
                dependencyObj &&
                field.relationshipSchemaLabelPropName &&
                dependencyObj[field.relationshipSchemaLabelPropName]
              ) {
                rowText = dependencyObj[field.relationshipSchemaLabelPropName];
              }
            } else if (field.fieldType === DynamicComponentTypes.FORM_DATE && rowText) {
              rowText = parseDateToDateTimeString(rowText);
            } else if (field.fieldType === DynamicComponentTypes.FILE_UPLOADER) {
              rowText = '';
            }

            return (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{rowText}</Typography>
                </Box>
              </Box>
            );
          },
        });
      });

    setColumns(columnsData);
  };

  const user2UserUserIsSource = () => {
    let currentEntityIsSource = true;
    // Si es un User2User quiere decir que estoy consultando desde uno de los 2,
    // tengo que identificar si desde el que estoy consultando es source o target

    const parentEntityUserData = parentEntityData as IUser;

    if (
      entitySchema &&
      entitySchema.relationshipTargetRequiredRols &&
      entitySchema.relationshipSourceSchemaId &&
      parentEntityUserData
    ) {
      if (parentEntityUserData.userDefinedRols) {
        // si tiene un rol de los requeridos en el target entonces NO es source
        entitySchema.relationshipTargetRequiredRols.forEach((targetRequiredRole) => {
          if (hasRole(parentEntityUserData.userDefinedRols, targetRequiredRole)) {
            currentEntityIsSource = false;
          }
        });
      }
    }

    return currentEntityIsSource;
  };

  const getUser2UserField = () => {
    if (!entitySchema) return null;

    const currentUserIsSource = user2UserUserIsSource();

    if (currentUserIsSource) {
      // si es source, entonces escondo del esquema la prop del source y le pongo como valor inicial el id del parent
      const sourceField = entitySchemaFields.find((field) => {
        return field.relationshipSchemaId === entitySchema.relationshipSourceSchemaId;
      });

      return sourceField;
    } else {
      // si es source, entonces escondo del esquema la prop del source y le pongo como valor inicial el id del parent
      const targetField = entitySchemaFields.find((field) => {
        return field.relationshipSchemaId === entitySchema.relationshipTargetSchemaId;
      });

      return targetField;
    }
  };

  // build and set add form
  useEffect(() => {
    const doAsync = async () => {
      try {
        if (loadingSchema || !entitySchema || !entitySchemaFields) return;

        updateColumnsData();

        let theForm = null;

        if (entitySchema.schemaType === EntitySchemaTypes.COMPANY_EMPLOYEES_ENTITY && userEntitySchema) {
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
          const theUserForm = schemaToForm(userEntitySchema, userEntitySchemaFields, null, dynamics, true);

          if (!theUserForm.steps[0].title) {
            theUserForm.steps[0].title = 'User';
            theUserForm.steps[0].iconName = 'tabler:user';
          }

          if (theEntityForm.steps.length && !theEntityForm.steps[0].title) {
            theEntityForm.steps[0].title = capitalize(entitySchema.name);
            theEntityForm.steps[0].iconName = 'tabler:code';
          }

          theEntityForm.steps = [...theUserForm.steps];
          theForm = theEntityForm;
        }
        // isUserEntitySchema = EntitySchemaTypes.USER_ENTITY
        else if (isUserEntitySchema && userEntitySchema) {
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
          const theUserForm = schemaToForm(userEntitySchema, userEntitySchemaFields, null, dynamics, true);

          if (!theUserForm.steps[0].title) {
            theUserForm.steps[0].title = 'User';
            theUserForm.steps[0].iconName = 'tabler:user';
          }

          if (theEntityForm.steps.length && !theEntityForm.steps[0].title) {
            theEntityForm.steps[0].title = capitalize(entitySchema.name);
            theEntityForm.steps[0].iconName = 'tabler:code';
          }

          theEntityForm.steps = [...theUserForm.steps, ...theEntityForm.steps];
          theForm = theEntityForm;
        } else if (entitySchema.schemaType === EntitySchemaTypes.RELATIONSHIP_USER2USER_ENTITY) {
          const currentUserIsSource = user2UserUserIsSource();

          if (currentUserIsSource) {
            // si es source, entonces escondo del esquema la prop del source y le pongo como valor inicial el id del parent
            const sourceField = entitySchemaFields.find((field) => {
              return field.relationshipSchemaId === entitySchema.relationshipSourceSchemaId;
            });

            if (sourceField) {
              sourceField.enableHidden = true;
              sourceField.hidden_create = true;
            }
          } else {
            // si es source, entonces escondo del esquema la prop del source y le pongo como valor inicial el id del parent
            const targetField = entitySchemaFields.find((field) => {
              return field.relationshipSchemaId === entitySchema.relationshipTargetSchemaId;
            });

            if (targetField) {
              targetField.enableHidden = true;
              targetField.hidden_create = true;
            }
          }
          theForm = schemaToForm(entitySchema, entitySchemaFields, null, dynamics, true);
        } else {
          theForm = schemaToForm(entitySchema, entitySchemaFields, null, dynamics, true);
        }

        setAddNewEntityForm(theForm);
      } catch (e: any) {
        handleError(e);
      }
    };

    doAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingSchema, entitySchema, entitySchemaFields]);

  const fillWithDeps = async (formData: any) => {
    const newFormData = _.cloneDeep(formData);

    entitySchemaFields.forEach((field) => {
      // si no es una relacion o si tengo un valor, no hago nada
      if (field.fieldType !== DynamicComponentTypes.RELATIONSHIP || newFormData[field.name]) return;

      // dado que no tengo valor en una propiedad que es de tipo relacion, veo si el padre tiene un field que sea de ese tipo de relacion

      const parentEntitySchemaFields = dynamics.entitySchemasFields?.filter((allField) => {
        return parentEntitySchema?.id === allField.schemaId;
      });
      if (!parentEntitySchemaFields) return;

      const parentFieldRelatedToMissingSchema = parentEntitySchemaFields.find((parentField) => {
        return parentField.relationshipSchemaId === field.relationshipSchemaId;
      });

      if (!parentFieldRelatedToMissingSchema) return;

      const parentDataValue = parentEntityData[parentFieldRelatedToMissingSchema.name];
      newFormData[field.name] = parentDataValue;
    });

    return newFormData;
  };

  const handleOnSubmit = async (formData: any) => {
    try {
      setLoadingData(true);

      if (
        entitySchema?.schemaType === EntitySchemaTypes.RELATIONSHIP_ENTITY ||
        entitySchema?.schemaType === EntitySchemaTypes.ONE_TO_MANY_ENTITY
      ) {
        const sourceRelationshipField = entitySchemaFields.find((field) => {
          return field.relationshipSchemaId === entitySchema.relationshipSourceSchemaId;
        });

        if (!sourceRelationshipField) throw new Error('Missing field ' + entitySchema.relationshipSourceSchemaId);

        // userId = :id
        formData[sourceRelationshipField.name] = parentEntityData.id;
      }

      if (entitySchema?.schemaType === EntitySchemaTypes.RELATIONSHIP_USER2USER_ENTITY && parentEntityData) {
        const userField = getUser2UserField();

        if (userField) {
          formData[userField.name] = parentEntityData.id;
        }
      }

      if (!entitySchema || !currentUser.currentUser) throw new Error('Missing entitySchema/currentUser.currentUser');

      const newFormData = await fillWithDeps(formData);

      await createEntityDataBySchema(
        currentUser.currentUser,
        entitySchema,
        entitySchemaFields,
        newFormData,
        parentEntitySchema,
        parentEntityData
      );

      // refresco la tabla
      setToggleData(!toggleData);

      // cierro sidebar
      setAddSidebarOpen(false);

      // apago loading
      setLoadingData(false);
    } catch (e) {
      setLoadingData(false);
      handleError(e);
    }
  };

  if (!entitySchema || loadingSchema || loadingData) return <Loader />;

  return (
    <>
      <Card>
        <CardHeader
          sx={{ textTransform: 'capitalize' }}
          title={splitByUppercase(entitySchema.name)}
          action={
            <Button onClick={toggleAddDrawer} variant='contained' sx={{ '& svg': { mr: 2 } }}>
              <Icon fontSize='1.125rem' icon='tabler:plus' />
              New
            </Button>
          }
        />
        <DataGrid
          autoHeight
          rows={entitiesData}
          rowHeight={60}
          columns={columns}
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: false,
              },
            },
          }}
          disableRowSelectionOnClick
          pageSizeOptions={[7, 10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
        {!!addSidebarOpen && !!addNewEntityForm && !!entitySchema && (
          <DynamicFormSidebar
            isCreating={true}
            onSubmit={handleOnSubmit}
            title={'Create ' + capitalize(splitByUppercase(entitySchema.name))}
            formId={'create_' + entitySchema.name}
            preloadForm={addNewEntityForm}
            open={addSidebarOpen}
            toggle={toggleAddDrawer}
            onSubmitDone={() => {
              toggleAddDrawer();

              return Promise.resolve();
            }}
          />
        )}
      </Card>
    </>
  );
};

export default DynamicSchemaLayoutList;
