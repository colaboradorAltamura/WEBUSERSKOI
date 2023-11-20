// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types';

// ** React Imports
import { useEffect, useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// ** Third Party Imports
import toast from 'react-hot-toast';

// ** Type Imports

import { CardContent, Divider, IconButton, MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Icon from 'src/@core/components/icon';
import Loader from 'src/@core/components/loader';
import CustomTextField from 'src/@core/components/mui/text-field';
import { handleError, hasRole } from 'src/@core/coreHelper';
import {
  createEntitySchemaField,
  createEntitySchemaFieldGroup,
  deleteEntitySchema,
  deleteEntitySchemaField,
  deleteEntitySchemaFieldGroup,
  getEntitySchemaById,
  listEntitySchemaFieldGroups,
  listEntitySchemaFields,
  listUserDefinedRols,
  updateEntitySchema,
  updateEntitySchemaField,
  updateEntitySchemaFieldGroup,
} from 'src/services/entitiesSchemasServices';
import {
  EntitySchemaTypes,
  IEntitySchema,
  IEntitySchemaField,
  IEntitySchemaFieldGroup,
  IUserRol,
} from 'src/types/entities';
import EntitySchemaFieldFormSidebar from 'src/views/cms/EntitySchemaFieldFormSidebar';

// ** React Imports

// ** Next Import

// ** MUI Imports
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';

import FormControlLabel from '@mui/material/FormControlLabel';
import TableContainer from '@mui/material/TableContainer';
import { useRouter } from 'next/router';
import Link from 'next/link';
import EntitySchemaFieldGroupFormSidebar from 'src/views/cms/EntitySchemaFieldGroupFormSidebar';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { AppRols } from 'src/types/appRols';
import _ from 'lodash';
import { DynamicComponentTypes } from 'src/types/dynamics';

// ** Third Party Imports

// ** Types

// ** Demo Components Imports

interface FieldCellType {
  row: IEntitySchemaField;
}

interface FieldGroupCellType {
  row: IEntitySchemaFieldGroup;
}

const CMSItem = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** Hooks
  const router = useRouter();

  const id = router.query.id as string;

  const currentUser = useCurrentUser();

  // ** State
  const [errorFields, setErrorFields] = useState<any>({});

  const [idField, setIdField] = useState<string>('');
  const [schemaTypeField, setSchemaTypeField] = useState<string>('');

  const [nameField, setNameField] = useState<string>('');

  const [descriptionField, setDescriptionField] = useState<string>('');

  const [collectionNameField, setCollectionNameField] = useState<string>('');
  const [fieldNameUsedAsSchemaLabelField, setFieldNameUsedAsSchemaLabelField] = useState<string>('');

  const [bidirectional, setBidirectional] = useState<boolean>(false);
  const [relationshipSourceSchemaIdField, setRelationshipSourceSchemaIdField] = useState<string>('');
  const [relationshipTargetSchemaIdField, setRelationshipTargetSchemaIdField] = useState<string>('');

  const [relationshipSourceRequiredRolsField, setRelationshipSourceRequiredRolsField] = useState<string>('');
  const [relationshipTargetRequiredRolsField, setRelationshipTargetRequiredRolsField] = useState<string>('');

  const [fixedRoleIdField, setFixedRoleIdField] = useState<string>('');

  const [prelodeable, setPrelodeable] = useState<boolean>(false);
  const [cacheable, setCacheable] = useState<boolean>(false);
  const [grantedAnonymous_create, setGrantedAnonymous_create] = useState<boolean>(false);
  const [grantedAnonymous_read, setGrantedAnonymous_read] = useState<boolean>(false);
  const [grantedAnonymous_update, setGrantedAnonymous_update] = useState<boolean>(false);
  const [grantedAnonymous_delete, setGrantedAnonymous_delete] = useState<boolean>(false);

  const [isStateRelated, setIsStateRelated] = useState<boolean>(false);

  const [schemaFields, setSchemaFields] = useState<IEntitySchemaField[]>([]);
  const [schemaFieldGroups, setSchemaFieldGroups] = useState<IEntitySchemaFieldGroup[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });

  const [addFieldOpen, setAddFieldOpen] = useState<boolean>(false);
  const [toggleDataEntityFields, setToggleDataEntityFields] = useState<boolean>(false);

  const [addFieldGroupOpen, setAddFieldGroupOpen] = useState<boolean>(false);
  const [toggleDataEntityFieldGroups, setToggleDataEntityFieldGroups] = useState<boolean>(false);

  const [currentEntitySchema, setCurrentEntitySchema] = useState<IEntitySchema | null>(null);
  const [currentEntitySchemaField, setCurrentEntitySchemaField] = useState<IEntitySchemaField | null>(null);
  const [currentEntitySchemaFieldGroup, setCurrentEntitySchemaFieldGroup] = useState<IEntitySchemaFieldGroup | null>(
    null
  );

  const [selectedCheckbox, setSelectedCheckbox] = useState<string[]>([]);
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState<boolean>(false);

  const [loadingUserDefinedRoles, setLoadingUserDefinedRoles] = useState<boolean>(false);
  const [userDefinedRoles, setUserDefinedRoles] = useState<IUserRol[]>([]);
  const [toggleUserDefinedRols, setToggleUserDefinedRols] = useState<boolean>(false);

  const [indexedCompoundFiltersField, setIndexedCompoundFiltersField] = useState<string>('');

  const toggleAddFieldDrawer = () => setAddFieldOpen(!addFieldOpen);
  const toggleAddFieldGroupDrawer = () => setAddFieldGroupOpen(!addFieldGroupOpen);

  const togglePermission = (id: string) => {
    const arr = selectedCheckbox;
    if (selectedCheckbox.includes(id)) {
      arr.splice(arr.indexOf(id), 1);
      setSelectedCheckbox([...arr]);
    } else {
      arr.push(id);
      setSelectedCheckbox([...arr]);
    }
  };

  // const handleSelectAllCheckbox = () => {
  //   if (isIndeterminateCheckbox) {
  //     setSelectedCheckbox([]);
  //   } else {
  //     userDefinedRoles.forEach((row) => {
  //       const id = row.id.toLowerCase().split(' ').join('-');
  //       togglePermission(`${id}-read`);
  //       togglePermission(`${id}-write`);
  //       togglePermission(`${id}-create`);
  //     });
  //   }
  // };

  const handleDeleteField = async (rowToDelete: IEntitySchemaField) => {
    try {
      if (!currentEntitySchema) throw new Error('missing currentEntitySchema');

      setLoading(true);
      await deleteEntitySchemaField(currentEntitySchema.id, rowToDelete.id);
      setToggleDataEntityFields(!toggleDataEntityFields);
      setLoading(false);
    } catch (e) {
      handleError(e);
      setLoading(false);
    }
  };

  const handleDeleteFieldGroup = async (rowToDelete: IEntitySchemaFieldGroup) => {
    try {
      if (!currentEntitySchema) throw new Error('missing currentEntitySchema');

      setLoading(true);
      await deleteEntitySchemaFieldGroup(currentEntitySchema.id, rowToDelete.id);
      setToggleDataEntityFieldGroups(!toggleDataEntityFieldGroups);
      setLoading(false);
    } catch (e) {
      handleError(e);
      setLoading(false);
    }
  };

  // ** Get Rols
  useEffect(() => {
    const doAsyncGetUserDefinedRols = async () => {
      try {
        setLoadingUserDefinedRoles(true);

        const responseData = await listUserDefinedRols();

        setUserDefinedRoles(responseData.items);

        setLoadingUserDefinedRoles(false);
      } catch (e) {
        setLoadingUserDefinedRoles(false);
        handleError(e);
      }
    };

    doAsyncGetUserDefinedRols();
  }, [id, toggleUserDefinedRols]);

  // ** Get Entity Schema and Entity Schema Fields and Entity Schema Fields Groups
  useEffect(() => {
    const doAsyncGetEntitySchema = async () => {
      try {
        if (!id) {
          toast.error('Missing id', {
            duration: 2000,
          });

          return;
        }

        setLoading(true);

        const responseData = (await getEntitySchemaById(id)) as IEntitySchema;

        setCurrentEntitySchema(responseData);

        setIdField(responseData.id);
        setSchemaTypeField(responseData.schemaType);
        setNameField(responseData.name);
        setCollectionNameField(responseData.collectionName);
        setFieldNameUsedAsSchemaLabelField(responseData.fieldNameUsedAsSchemaLabel);

        setBidirectional(responseData.bidirectional ? responseData.bidirectional : false);
        setRelationshipSourceSchemaIdField(
          responseData.relationshipSourceSchemaId ? responseData.relationshipSourceSchemaId : ''
        );
        setRelationshipTargetSchemaIdField(
          responseData.relationshipTargetSchemaId ? responseData.relationshipTargetSchemaId : ''
        );
        setRelationshipSourceRequiredRolsField(
          responseData.relationshipSourceRequiredRols
            ? responseData.relationshipSourceRequiredRols.reduce((a, b) => {
                return a + ', ' + b;
              })
            : ''
        );

        setRelationshipTargetRequiredRolsField(
          responseData.relationshipTargetRequiredRols
            ? responseData.relationshipTargetRequiredRols.reduce((a, b) => {
                return a + ', ' + b;
              })
            : ''
        );

        setFixedRoleIdField(responseData.fixedRoleId ? responseData.fixedRoleId : '');
        setPrelodeable(responseData.prelodeable ? true : false);
        setCacheable(responseData.cacheable ? true : false);
        setGrantedAnonymous_create(responseData.grantedAnonymous_create ? true : false);
        setGrantedAnonymous_read(responseData.grantedAnonymous_read ? true : false);
        setGrantedAnonymous_update(responseData.grantedAnonymous_update ? true : false);
        setGrantedAnonymous_delete(responseData.grantedAnonymous_delete ? true : false);
        setIsStateRelated(responseData.isStateRelated ? true : false);

        setIndexedCompoundFiltersField(JSON.stringify(responseData.indexedCompoundFilters));

        const responseFields = await listEntitySchemaFields(id);

        const responseFieldGroups = await listEntitySchemaFieldGroups(id);

        const fieldsBasicData = {
          schemaId: '',
          organizationId: '',

          fieldType: DynamicComponentTypes.FORM_TEXT,
          dimensions_xs: '12',
          dimensions_sm: '12',
          isRequired: false,
          enableHidden: true,
          hidden_create: false,
          hidden_edit: false,
          enableReadOnly: true,
          readOnly_create: false,
          readOnly_edit: true,
          enableConditionalRender: false,
          placeholder: '',
          tooltip: '',

          isSystemField: true,
          enableCustomMask: false,
          textCustomMask: '',
        };

        responseFields.items.push({ ...fieldsBasicData, id: 'state', name: 'state', label: 'State', order: 100 });
        responseFields.items.push({
          ...fieldsBasicData,
          id: 'createdAt',
          name: 'createdAt',
          label: 'Created At',
          order: 101,
        });
        responseFields.items.push({
          ...fieldsBasicData,
          id: 'createdBy',
          name: 'createdBy',
          label: 'Created By',
          order: 102,
        });
        responseFields.items.push({
          ...fieldsBasicData,
          id: 'updatedAt',
          name: 'updatedAt',
          label: 'Updated At',
          order: 103,
        });
        responseFields.items.push({
          ...fieldsBasicData,
          id: 'updatedBy',
          name: 'updatedBy',
          label: 'Updated By',
          order: 104,
        });

        setSchemaFields(
          responseFields.items.sort((a, b) => {
            return a.order - b.order;
          })
        );

        setSchemaFieldGroups(
          responseFieldGroups.items.sort((a, b) => {
            return a.order - b.order;
          })
        );

        setLoading(false);
      } catch (e) {
        setLoading(false);
        handleError(e);
      }
    };

    doAsyncGetEntitySchema();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, toggleDataEntityFields, toggleDataEntityFieldGroups]);

  // ** Set selected grants
  useEffect(() => {
    const doAsync = async () => {
      try {
        const selectedGrantsFlatArr: string[] = [];
        if (currentEntitySchema?.grantedUserDefinedRols_create) {
          currentEntitySchema?.grantedUserDefinedRols_create.forEach((rolId) => {
            selectedGrantsFlatArr.push(rolId + CREATE_SUFFIX);
          });
        }

        if (currentEntitySchema?.grantedUserDefinedRols_read) {
          currentEntitySchema?.grantedUserDefinedRols_read.forEach((rolId) => {
            selectedGrantsFlatArr.push(rolId + READ_SUFFIX);
          });
        }

        if (currentEntitySchema?.grantedUserDefinedRols_update) {
          currentEntitySchema?.grantedUserDefinedRols_update.forEach((rolId) => {
            selectedGrantsFlatArr.push(rolId + UPDATE_SUFFIX);
          });
        }

        if (currentEntitySchema?.grantedUserDefinedRols_delete) {
          currentEntitySchema?.grantedUserDefinedRols_delete.forEach((rolId) => {
            selectedGrantsFlatArr.push(rolId + DELETE_SUFFIX);
          });
        }

        if (currentEntitySchema?.grantedUserDefinedRols_create_mine) {
          currentEntitySchema?.grantedUserDefinedRols_create_mine.forEach((rolId) => {
            selectedGrantsFlatArr.push(rolId + CREATE_MINE_SUFFIX);
          });
        }

        if (currentEntitySchema?.grantedUserDefinedRols_read_mine) {
          currentEntitySchema?.grantedUserDefinedRols_read_mine.forEach((rolId) => {
            selectedGrantsFlatArr.push(rolId + READ_MINE_SUFFIX);
          });
        }

        if (currentEntitySchema?.grantedUserDefinedRols_update_mine) {
          currentEntitySchema?.grantedUserDefinedRols_update_mine.forEach((rolId) => {
            selectedGrantsFlatArr.push(rolId + UPDATE_MINE_SUFFIX);
          });
        }

        if (currentEntitySchema?.grantedUserDefinedRols_delete_mine) {
          currentEntitySchema?.grantedUserDefinedRols_delete_mine.forEach((rolId) => {
            selectedGrantsFlatArr.push(rolId + DELETE_MINE_SUFFIX);
          });
        }

        if (currentEntitySchema?.grantedUserDefinedRols_create_by_user) {
          currentEntitySchema?.grantedUserDefinedRols_create_by_user.forEach((rolId) => {
            selectedGrantsFlatArr.push(rolId + CREATE_BY_USER_SUFFIX);
          });
        }

        if (currentEntitySchema?.grantedUserDefinedRols_read_by_user) {
          currentEntitySchema?.grantedUserDefinedRols_read_by_user.forEach((rolId) => {
            selectedGrantsFlatArr.push(rolId + READ_BY_USER_SUFFIX);
          });
        }

        if (currentEntitySchema?.grantedUserDefinedRols_update_by_user) {
          currentEntitySchema?.grantedUserDefinedRols_update_by_user.forEach((rolId) => {
            selectedGrantsFlatArr.push(rolId + UPDATE_BY_USER_SUFFIX);
          });
        }

        if (currentEntitySchema?.grantedUserDefinedRols_delete_by_user) {
          currentEntitySchema?.grantedUserDefinedRols_delete_by_user.forEach((rolId) => {
            selectedGrantsFlatArr.push(rolId + DELETE_BY_USER_SUFFIX);
          });
        }

        if (currentEntitySchema?.grantedUserDefinedRols_create_by_company) {
          currentEntitySchema?.grantedUserDefinedRols_create_by_company.forEach((rolId) => {
            selectedGrantsFlatArr.push(rolId + CREATE_BY_COMPANY_SUFFIX);
          });
        }

        if (currentEntitySchema?.grantedUserDefinedRols_read_by_company) {
          currentEntitySchema?.grantedUserDefinedRols_read_by_company.forEach((rolId) => {
            selectedGrantsFlatArr.push(rolId + READ_BY_COMPANY_SUFFIX);
          });
        }

        if (currentEntitySchema?.grantedUserDefinedRols_update_by_company) {
          currentEntitySchema?.grantedUserDefinedRols_update_by_company.forEach((rolId) => {
            selectedGrantsFlatArr.push(rolId + UPDATE_BY_COMPANY_SUFFIX);
          });
        }

        if (currentEntitySchema?.grantedUserDefinedRols_delete_by_company) {
          currentEntitySchema?.grantedUserDefinedRols_delete_by_company.forEach((rolId) => {
            selectedGrantsFlatArr.push(rolId + DELETE_BY_COMPANY_SUFFIX);
          });
        }

        setSelectedCheckbox(selectedGrantsFlatArr);
      } catch (e) {
        handleError(e);
      }
    };

    doAsync();
  }, [currentEntitySchema]);

  const fieldsColumns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 110,
      sortable: false,
      field: 'icons',
      headerName: '',
      renderCell: ({ row }: FieldCellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Edit'>
              <IconButton
                size='small'
                sx={{ color: 'text.secondary' }}
                onClick={() => {
                  if (
                    row.isSystemField &&
                    currentUser.currentUser &&
                    !hasRole(currentUser.currentUser?.appRols, AppRols.APP_ADMIN)
                  ) {
                    alert('Must be admin');

                    return;
                  }

                  setCurrentEntitySchemaField(row);

                  setAddFieldOpen(true);
                }}
              >
                <Icon icon='tabler:eye' />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },

    {
      flex: 0.2,
      minWidth: 110,
      field: 'id',
      headerName: 'id',
      renderCell: ({ row }: FieldCellType) => (
        <Typography
          onClick={() => {
            if (
              row.isSystemField &&
              currentUser.currentUser &&
              !hasRole(currentUser.currentUser?.appRols, AppRols.APP_ADMIN)
            ) {
              alert('Must be admin');

              return;
            }

            setCurrentEntitySchemaField(row);

            setAddFieldOpen(true);

            // router.push('/cms/' + row.id);
            // fetchAndOpenSidebar(row as IEntitySchema);
            // setInitialValuesEvent(column.action.sidebarEditor?.initialValuesEvent);
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
    },
    {
      flex: 0.35,
      minWidth: 250,
      field: 'name',
      headerName: 'name',
      renderCell: ({ row }: FieldCellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{row.name}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      flex: 0.35,
      field: 'fieldType',
      headerName: 'fieldType',
      renderCell: ({ row }: FieldCellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{row.fieldType}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      flex: 0.1,
      field: 'order',
      headerName: 'order',
      renderCell: ({ row }: FieldCellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{row.order}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: FieldCellType) => {
        if (
          row.isSystemField &&
          currentUser.currentUser &&
          !hasRole(currentUser.currentUser?.appRols, AppRols.APP_ADMIN)
        )
          return <Typography sx={{ fontWeight: 500, color: 'text.disabled' }}>built in</Typography>;

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Delete'>
              <IconButton
                size='small'
                sx={{ color: 'text.danger' }}
                onClick={() => {
                  handleDeleteField(row);
                }}
              >
                <Icon icon='tabler:trash' />
                {row.isSystemField && (
                  <Typography sx={{ fontWeight: 500, color: 'text.disabled' }}>built in</Typography>
                )}
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const fieldGroupsColumns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 110,
      field: 'id',
      headerName: 'id',
      renderCell: ({ row }: FieldGroupCellType) => (
        <Typography
          onClick={() => {
            setCurrentEntitySchemaFieldGroup(row);

            setAddFieldGroupOpen(true);
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
    },
    {
      flex: 0.35,
      minWidth: 250,
      field: 'title',
      headerName: 'title',
      renderCell: ({ row }: FieldGroupCellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{row.title}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      flex: 0.1,
      field: 'order',
      headerName: 'order',
      renderCell: ({ row }: FieldGroupCellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{row.order}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: FieldGroupCellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete'>
            <IconButton
              size='small'
              sx={{ color: 'text.danger' }}
              onClick={() => {
                handleDeleteFieldGroup(row);
              }}
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleSave = async () => {
    try {
      if (!currentEntitySchema) throw new Error('Missing currentEntitySchema');

      if (nameField === '' || nameField.indexOf(' ') !== -1) {
        setErrorFields({ name: true });

        return;
      }

      if (!fieldNameUsedAsSchemaLabelField || fieldNameUsedAsSchemaLabelField.indexOf(' ') !== -1) {
        setErrorFields({ fieldNameUsedAsSchemaLabel: true });

        return;
      }

      setErrorFields({});

      setLoading(true);

      await updateEntitySchema(currentEntitySchema.id, {
        name: nameField,
        fieldNameUsedAsSchemaLabel: fieldNameUsedAsSchemaLabelField,
        cacheable,
        prelodeable,
        grantedAnonymous_create,
        grantedAnonymous_read,
        grantedAnonymous_update,
        grantedAnonymous_delete,
        isStateRelated,
        bidirectional,
      });

      setLoading(false);
    } catch (e) {
      setLoading(false);
      handleError(e);
    }
  };

  const handleRemove = async () => {
    try {
      if (!currentEntitySchema) throw new Error('Missing currentEntitySchema');

      setErrorFields({});

      setLoading(true);

      await deleteEntitySchema(currentEntitySchema.id);

      router.push(`/cms`);

      setLoading(false);
    } catch (e) {
      setLoading(false);
      handleError(e);
    }
  };

  const handleOnSubmitFieldGroup = async (formData: any, isCreating: boolean) => {
    try {
      // NO hacer un set loading pq se re renderiza formik dentro del sidedrawer y pierde el estado y entonces no muestra el error
      // setLoading(true);

      if (isCreating) {
        await createEntitySchemaFieldGroup(id, formData as IEntitySchemaFieldGroup);
      } else await updateEntitySchemaFieldGroup(id, formData.id, formData as IEntitySchemaFieldGroup);

      // cierro el sidedrawer
      toggleAddFieldGroupDrawer();
      // stop del loading
      setLoading(false);

      // refresco la info de la tabla de fields
      setToggleDataEntityFieldGroups(!toggleDataEntityFieldGroups);

      return Promise.resolve();
    } catch (e) {
      // NO hacer un set loading pq se re renderiza formik dentro del sidedrawer y pierde el estado y entonces no muestra el error
      // setLoading(false);
      // handleError(e);

      return Promise.reject(e);
      // return null;
    }
  };

  const handleOnSubmitField = async (formData: any, isCreating: boolean) => {
    try {
      // NO hacer un set loading pq se re renderiza formik dentro del sidedrawer y pierde el estado y entonces no muestra el error
      // setLoading(true);

      if (isCreating) {
        await createEntitySchemaField(id, formData as IEntitySchemaField);

        if (schemaFields.length === 0) {
          // esta prop se usa cuando el field es de tipo select y tiene que mostrar las options.
          // al setearselo, en el comp EntitySchemaFieldFormSidebar se usa esta prop para asignarselo al field que seria de tipo select, lindo quilombo...
          updateEntitySchema(id, { fieldNameUsedAsSchemaLabel: formData.name });
        }
      } else await updateEntitySchemaField(id, formData.id, formData as IEntitySchemaField);

      // cierro el sidedrawer
      toggleAddFieldDrawer();
      // stop del loading
      setLoading(false);

      // refresco la info de la tabla de fields
      setToggleDataEntityFields(!toggleDataEntityFields);

      return Promise.resolve();
    } catch (e) {
      // NO hacer un set loading pq se re renderiza formik dentro del sidedrawer y pierde el estado y entonces no muestra el error
      // setLoading(false);
      // handleError(e);

      return Promise.reject(e);
      // return null;
    }
  };

  const CREATE_SUFFIX = '-@create@';
  const READ_SUFFIX = '-@read@';
  const UPDATE_SUFFIX = '-@update@';
  const DELETE_SUFFIX = '-@delete@';

  const CREATE_MINE_SUFFIX = '-@create-mine@';
  const READ_MINE_SUFFIX = '-@read-mine@';
  const UPDATE_MINE_SUFFIX = '-@update-mine@';
  const DELETE_MINE_SUFFIX = '-@delete-mine@';

  const CREATE_BY_USER_SUFFIX = '-@create-by-user@';
  const READ_BY_USER_SUFFIX = '-@read-by-user@';
  const UPDATE_BY_USER_SUFFIX = '-@update-by-user@';
  const DELETE_BY_USER_SUFFIX = '-@delete-by-user@';

  const CREATE_BY_COMPANY_SUFFIX = '-@create-by-company@';
  const READ_BY_COMPANY_SUFFIX = '-@read-by-company@';
  const UPDATE_BY_COMPANY_SUFFIX = '-@update-by-company@';
  const DELETE_BY_COMPANY_SUFFIX = '-@delete-by-company@';

  const handleSaveGrants = async () => {
    try {
      const createArr: string[] = [];
      const readArr: string[] = [];
      const updateArr: string[] = [];
      const deleteArr: string[] = [];

      const createMineArr: string[] = [];
      const readMineArr: string[] = [];
      const updateMineArr: string[] = [];
      const deleteMineArr: string[] = [];

      const createByUserArr: string[] = [];
      const readByUserArr: string[] = [];
      const updateByUserArr: string[] = [];
      const deleteByUserArr: string[] = [];

      const createByCompanyArr: string[] = [];
      const readByCompanyArr: string[] = [];
      const updateByCompanyArr: string[] = [];
      const deleteByCompanyArr: string[] = [];

      selectedCheckbox.forEach((selectedItem) => {
        if (selectedItem.endsWith(CREATE_SUFFIX)) createArr.push(selectedItem.replaceAll(CREATE_SUFFIX, ''));
        if (selectedItem.endsWith(READ_SUFFIX)) readArr.push(selectedItem.replaceAll(READ_SUFFIX, ''));
        if (selectedItem.endsWith(UPDATE_SUFFIX)) updateArr.push(selectedItem.replaceAll(UPDATE_SUFFIX, ''));
        if (selectedItem.endsWith(DELETE_SUFFIX)) deleteArr.push(selectedItem.replaceAll(DELETE_SUFFIX, ''));

        if (selectedItem.endsWith(CREATE_MINE_SUFFIX))
          createMineArr.push(selectedItem.replaceAll(CREATE_MINE_SUFFIX, ''));
        if (selectedItem.endsWith(READ_MINE_SUFFIX)) readMineArr.push(selectedItem.replaceAll(READ_MINE_SUFFIX, ''));
        if (selectedItem.endsWith(UPDATE_MINE_SUFFIX))
          updateMineArr.push(selectedItem.replaceAll(UPDATE_MINE_SUFFIX, ''));
        if (selectedItem.endsWith(DELETE_MINE_SUFFIX))
          deleteMineArr.push(selectedItem.replaceAll(DELETE_MINE_SUFFIX, ''));

        if (selectedItem.endsWith(CREATE_BY_USER_SUFFIX))
          createByUserArr.push(selectedItem.replaceAll(CREATE_BY_USER_SUFFIX, ''));
        if (selectedItem.endsWith(READ_BY_USER_SUFFIX))
          readByUserArr.push(selectedItem.replaceAll(READ_BY_USER_SUFFIX, ''));
        if (selectedItem.endsWith(UPDATE_BY_USER_SUFFIX))
          updateByUserArr.push(selectedItem.replaceAll(UPDATE_BY_USER_SUFFIX, ''));
        if (selectedItem.endsWith(DELETE_BY_USER_SUFFIX))
          deleteByUserArr.push(selectedItem.replaceAll(DELETE_BY_USER_SUFFIX, ''));

        if (selectedItem.endsWith(CREATE_BY_COMPANY_SUFFIX))
          createByCompanyArr.push(selectedItem.replaceAll(CREATE_BY_COMPANY_SUFFIX, ''));
        if (selectedItem.endsWith(READ_BY_COMPANY_SUFFIX))
          readByCompanyArr.push(selectedItem.replaceAll(READ_BY_COMPANY_SUFFIX, ''));
        if (selectedItem.endsWith(UPDATE_BY_COMPANY_SUFFIX))
          updateByCompanyArr.push(selectedItem.replaceAll(UPDATE_BY_COMPANY_SUFFIX, ''));
        if (selectedItem.endsWith(DELETE_BY_COMPANY_SUFFIX))
          deleteByCompanyArr.push(selectedItem.replaceAll(DELETE_BY_COMPANY_SUFFIX, ''));
      });

      setLoading(true);

      await updateEntitySchema(id, {
        grantedUserDefinedRols_create: createArr,
        grantedUserDefinedRols_read: readArr,
        grantedUserDefinedRols_update: updateArr,
        grantedUserDefinedRols_delete: deleteArr,

        grantedUserDefinedRols_create_mine: createMineArr,
        grantedUserDefinedRols_read_mine: readMineArr,
        grantedUserDefinedRols_update_mine: updateMineArr,
        grantedUserDefinedRols_delete_mine: deleteMineArr,

        grantedUserDefinedRols_create_by_user: createByUserArr,
        grantedUserDefinedRols_read_by_user: readByUserArr,
        grantedUserDefinedRols_update_by_user: updateByUserArr,
        grantedUserDefinedRols_delete_by_user: deleteByUserArr,

        grantedUserDefinedRols_create_by_company: createByCompanyArr,
        grantedUserDefinedRols_read_by_company: readByCompanyArr,
        grantedUserDefinedRols_update_by_company: updateByCompanyArr,
        grantedUserDefinedRols_delete_by_company: deleteByCompanyArr,
      });

      setLoading(false);
    } catch (e) {
      setLoading(false);
      handleError(e);
    }
  };

  const handleSaveIndexedFilters = async () => {
    try {
      setLoading(true);
      const indexedCompoundFilters = JSON.parse(indexedCompoundFiltersField);
      await updateEntitySchema(id, {
        indexedCompoundFilters,
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      handleError(e);
    }
  };

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  if (!id) {
    console.error('missing args', router);
    router.push('/500');
  }

  if (loading || currentUser.isLoading) return <Loader />;

  return (
    <>
      {/* ** Schema ** */}
      {currentEntitySchema && (
        <Card style={{ marginBottom: 30 }}>
          <CardHeader
            title={
              <>
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <IconButton
                    size='small'
                    sx={{ color: 'text.secondary' }}
                    onClick={() => {
                      router.push(`/cms/content/${currentEntitySchema.name}`);
                    }}
                  >
                    <Icon icon='tabler:eye' />
                  </IconButton>
                  <Typography sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                    {currentEntitySchema.name}
                  </Typography>
                </Box>
              </>
            }
            action={
              <>
                <Button onClick={handleSave} variant='contained' sx={{ '& svg': { mr: 2 }, mr: 2 }}>
                  <Icon fontSize='1.125rem' icon='tabler:edit' />
                  Save changes
                </Button>
                <Button onClick={handleRemove} color='error' variant='contained' sx={{ '& svg': { mr: 2 } }}>
                  <Icon fontSize='1.125rem' icon='tabler:alert-square' />
                  remove
                </Button>
              </>
            }
          />

          <CardContent>
            <CustomTextField
              sx={{ mb: 4 }}
              required={true}
              fullWidth
              name={'id'}
              type='text'
              label={'Id'}
              placeholder={'eg: xxx'}
              error={errorFields['id']}
              helperText={errorFields['id'] ? 'Invalid id' : ''}
              value={idField}
              onChange={(event) => {
                setIdField(event.target.value);
              }}
              disabled={true}
            />
            <CustomTextField
              select
              sx={{ mb: 4 }}
              required={true}
              fullWidth
              name={'schemaType'}
              type='select'
              label={'Schema Type'}
              placeholder={'eg: xxx'}
              error={errorFields['schemaType']}
              helperText={errorFields['schemaType'] ? 'Invalid schemaType' : ''}
              value={schemaTypeField}
              onChange={(event) => {
                setIdField(event.target.value);
              }}
              disabled={true}
            >
              {[
                { label: EntitySchemaTypes.MAIN_ENTITY, value: EntitySchemaTypes.MAIN_ENTITY },
                { label: EntitySchemaTypes.USER_ENTITY, value: EntitySchemaTypes.USER_ENTITY },
                { label: EntitySchemaTypes.RELATIONSHIP_ENTITY, value: EntitySchemaTypes.RELATIONSHIP_ENTITY },
                { label: EntitySchemaTypes.USER_ENTITY, value: EntitySchemaTypes.USER_ENTITY },
                {
                  label: EntitySchemaTypes.RELATIONSHIP_USER2USER_ENTITY,
                  value: EntitySchemaTypes.RELATIONSHIP_USER2USER_ENTITY,
                },
                { label: EntitySchemaTypes.SELECT_OPTIONS_ENTITY, value: EntitySchemaTypes.SELECT_OPTIONS_ENTITY },
                { label: EntitySchemaTypes.COMPANY_ENTITY, value: EntitySchemaTypes.COMPANY_ENTITY },
                { label: EntitySchemaTypes.ONE_TO_MANY_ENTITY, value: EntitySchemaTypes.ONE_TO_MANY_ENTITY },
              ].map((op, index) => {
                return (
                  <MenuItem key={index} value={op.value}>
                    {/* <em>None</em> */}
                    {op.label}
                  </MenuItem>
                );
              })}
            </CustomTextField>
            <CustomTextField
              sx={{ mb: 4 }}
              required={true}
              fullWidth
              name={'name'}
              type='text'
              label={'Name'}
              placeholder={'eg: users'}
              error={errorFields['name']}
              helperText={errorFields['name'] ? 'Invalid name' : 'Replace spaces with underscores. Use plurals'}
              value={nameField}
              onChange={(event) => {
                setNameField(event.target.value);
              }}
              disabled={false}
            />
            {/*
            <CustomTextField
              sx={{ mb: 4 }}
              required={true}
              fullWidth
              name={'collectionName'}
              type='text'
              label={'Collection Name'}
              placeholder={'eg: users'}
              error={errorFields['collectionName']}
              helperText={
                errorFields['collectionName']
                  ? 'Invalid collectionName'
                  : 'Replace spaces with underscores. Use plurals'
              }
              value={collectionNameField}
              onChange={(event) => {
                setCollectionNameField(event.target.value);
              }}
              disabled={true}
            /> */}
            <CustomTextField
              sx={{ mb: 4 }}
              required={true}
              fullWidth
              name={'description'}
              type='text'
              label={'Description'}
              placeholder={''}
              error={errorFields['description']}
              value={descriptionField}
              onChange={(event) => {
                setDescriptionField(event.target.value);
              }}
              disabled={false}
            />
            <Divider sx={{ mb: 4 }} />
            <h4>Advanced</h4>
            <CustomTextField
              sx={{ mb: 4 }}
              required={true}
              fullWidth
              name={'fieldNameUsedAsSchemaLabel'}
              type='text'
              label={'Main Field name (Display name)'}
              placeholder={'eg: name'}
              error={errorFields['fieldNameUsedAsSchemaLabel']}
              value={fieldNameUsedAsSchemaLabelField}
              onChange={(event) => {
                setFieldNameUsedAsSchemaLabelField(event.target.value);
              }}
              helperText={
                'Defines the prop for when an instance of this schema is shown as a dependency from other schema'
              }
            />
            <CustomTextField
              sx={{ mb: 4 }}
              required={false}
              fullWidth
              name={'relationshipSourceSchemaId'}
              type='text'
              label={'Relationship > Source schema Id'}
              error={errorFields['relationshipSourceSchemaId']}
              value={relationshipSourceSchemaIdField}
              disabled={true}
            />
            <CustomTextField
              sx={{ mb: 4 }}
              required={false}
              fullWidth
              name={'relationshipTargetSchemaId'}
              type='text'
              label={'Relationship > Target schema Id'}
              error={errorFields['relationshipTargetSchemaId']}
              value={relationshipTargetSchemaIdField}
              disabled={true}
            />

            <FormControlLabel
              label={'Relationship > Bidirectional'}
              control={
                <Checkbox
                  checked={bidirectional}
                  onChange={(event) => {
                    setBidirectional(event.target.checked);
                  }}
                />
              }
            />

            <CustomTextField
              sx={{ mb: 4 }}
              required={false}
              fullWidth
              name={'relationshipSourceRequiredRols'}
              type='text'
              label={'Relationship > Source Required rols'}
              error={errorFields['relationshipSourceRequiredRols']}
              value={relationshipSourceRequiredRolsField}
              disabled={true}
              helperText={'If its a user2user schema, this will define the required rol for the first field'}
            />
            <CustomTextField
              sx={{ mb: 4 }}
              required={false}
              fullWidth
              name={'relationshipTargetRequiredRols'}
              type='text'
              label={'Relationship > target Required rols'}
              error={errorFields['relationshipTargetRequiredRols']}
              value={relationshipTargetRequiredRolsField}
              disabled={true}
              helperText={'If its a user2user schema, this will define the required rol for the second field'}
            />
            <CustomTextField
              sx={{ mb: 4 }}
              required={false}
              fullWidth
              name={'fixedRoleId'}
              type='text'
              label={'Fixed Role Id'}
              error={errorFields['fixedRoleId']}
              value={fixedRoleIdField}
              disabled={true}
              helperText={'If its a user entity, this will be the role related to every instance of this schema'}
            />

            <FormControlLabel
              label={'Prelodeable'}
              control={
                <Checkbox
                  checked={prelodeable}
                  onChange={(event) => {
                    setPrelodeable(event.target.checked);
                  }}
                />
              }
            />
            <FormControlLabel
              label={'Cacheable'}
              control={
                <Checkbox
                  checked={cacheable}
                  onChange={(event) => {
                    setCacheable(event.target.checked);
                  }}
                />
              }
            />
            <Divider sx={{ mb: 4 }} />
            <h4>Anonymous access</h4>
            <FormControlLabel
              label={'GrantedAnonymous_create'}
              control={
                <Checkbox
                  checked={grantedAnonymous_create}
                  onChange={(event) => {
                    setGrantedAnonymous_create(event.target.checked);
                  }}
                />
              }
            />
            <FormControlLabel
              label={'GrantedAnonymous_read'}
              control={
                <Checkbox
                  checked={grantedAnonymous_read}
                  onChange={(event) => {
                    setGrantedAnonymous_read(event.target.checked);
                  }}
                />
              }
            />
            <FormControlLabel
              label={'GrantedAnonymous_update'}
              control={
                <Checkbox
                  checked={grantedAnonymous_update}
                  onChange={(event) => {
                    setGrantedAnonymous_update(event.target.checked);
                  }}
                />
              }
            />
            <FormControlLabel
              label={'GrantedAnonymous_delete'}
              control={
                <Checkbox
                  checked={grantedAnonymous_delete}
                  onChange={(event) => {
                    setGrantedAnonymous_delete(event.target.checked);
                  }}
                />
              }
            />

            <Divider sx={{ mb: 4 }} />
            <h4>State behaviour</h4>
            <FormControlLabel
              label={'is State Related'}
              control={
                <Checkbox
                  checked={isStateRelated}
                  onChange={(event) => {
                    setIsStateRelated(event.target.checked);
                  }}
                />
              }
            />
          </CardContent>
        </Card>
      )}

      {/* ** Schema Fields ** */}
      <Card style={{ marginBottom: 30 }}>
        <CardHeader
          title={<Typography sx={{ textTransform: 'capitalize' }}>Fields</Typography>}
          action={
            <Button
              onClick={() => {
                setCurrentEntitySchemaField(null);
                toggleAddFieldDrawer();
              }}
              variant='contained'
              sx={{ '& svg': { mr: 2 } }}
            >
              <Icon fontSize='1.125rem' icon='tabler:plus' />
              New
            </Button>
          }
        />

        <DataGrid
          autoHeight
          rows={schemaFields}
          rowHeight={60}
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: false,
              },
            },
          }}
          columns={fieldsColumns}
          disableRowSelectionOnClick
          pageSizeOptions={[7, 10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />

        {currentEntitySchema && schemaFieldGroups && !!addFieldOpen && (
          <EntitySchemaFieldFormSidebar
            entitySchema={currentEntitySchema}
            entitySchemaFieldGroups={schemaFieldGroups}
            entitySchemaFieldToEdit={currentEntitySchemaField}
            onSubmit={handleOnSubmitField}
            open={addFieldOpen}
            toggle={toggleAddFieldDrawer}
            currentFieldsLen={schemaFields.length}
          />
        )}
      </Card>

      {/* ** User Defined Rols ** */}
      <Card style={{ marginBottom: 30 }}>
        <CardHeader
          title={<Typography sx={{ textTransform: 'capitalize' }}>Grants</Typography>}
          action={
            <Button
              onClick={() => {
                handleSaveGrants();
              }}
              variant='contained'
              sx={{ '& svg': { mr: 2 } }}
            >
              <Icon fontSize='1.125rem' icon='tabler:edit' />
              Save changes
            </Button>
          }
        />

        {loadingUserDefinedRoles && <Loader />}
        {!loadingUserDefinedRoles && (
          <TableContainer style={{ marginLeft: 30, marginRight: 30 }}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ pl: '0 !important' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        whiteSpace: 'nowrap',
                        alignItems: 'center',
                        textTransform: 'capitalize',
                        '& svg': { ml: 1, cursor: 'pointer' },
                        color: (theme) => theme.palette.text.secondary,
                        fontSize: (theme) => theme.typography.h6.fontSize,
                      }}
                    >
                      Active rols
                      <Tooltip placement='top' title='To create new rols go to Rols menu'>
                        <Box sx={{ display: 'flex' }}>
                          <Icon icon='tabler:info-circle' fontSize='1.25rem' />
                        </Box>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell colSpan={3}>
                    {/* <FormControlLabel
                      label='Select All'
                      sx={{ '& .MuiTypography-root': { textTransform: 'capitalize', color: 'text.secondary' } }}
                      control={
                        <Checkbox
                          size='small'
                          onChange={handleSelectAllCheckbox}
                          indeterminate={isIndeterminateCheckbox}
                          checked={selectedCheckbox.length === userDefinedRoles.length * 3}
                        />
                      }
                    /> */}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userDefinedRoles.map((rol: IUserRol, index: number) => {
                  // const id = rol.id.toLowerCase().split(' ').join('-');
                  const id = rol.id.split(' ').join('-');

                  return (
                    <TableRow key={index} sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          fontSize: (theme) => theme.typography.h6.fontSize,
                        }}
                      >
                        {rol.name}
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Read'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}${READ_SUFFIX}`}
                              onChange={() => togglePermission(`${id}${READ_SUFFIX}`)}
                              checked={selectedCheckbox.includes(`${id}${READ_SUFFIX}`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Write'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}${UPDATE_SUFFIX}`}
                              onChange={() => togglePermission(`${id}${UPDATE_SUFFIX}`)}
                              checked={selectedCheckbox.includes(`${id}${UPDATE_SUFFIX}`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Create'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}${CREATE_SUFFIX}`}
                              onChange={() => togglePermission(`${id}${CREATE_SUFFIX}`)}
                              checked={selectedCheckbox.includes(`${id}${CREATE_SUFFIX}`)}
                            />
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <FormControlLabel
                          label='Delete'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}${DELETE_SUFFIX}`}
                              onChange={() => togglePermission(`${id}${DELETE_SUFFIX}`)}
                              checked={selectedCheckbox.includes(`${id}${DELETE_SUFFIX}`)}
                            />
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <FormControlLabel
                          label='Create Mine'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}${CREATE_MINE_SUFFIX}`}
                              onChange={() => togglePermission(`${id}${CREATE_MINE_SUFFIX}`)}
                              checked={selectedCheckbox.includes(`${id}${CREATE_MINE_SUFFIX}`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Read Mine'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}${READ_MINE_SUFFIX}`}
                              onChange={() => togglePermission(`${id}${READ_MINE_SUFFIX}`)}
                              checked={selectedCheckbox.includes(`${id}${READ_MINE_SUFFIX}`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Update Mine'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}${UPDATE_MINE_SUFFIX}`}
                              onChange={() => togglePermission(`${id}${UPDATE_MINE_SUFFIX}`)}
                              checked={selectedCheckbox.includes(`${id}${UPDATE_MINE_SUFFIX}`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Delete Mine'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}${DELETE_MINE_SUFFIX}`}
                              onChange={() => togglePermission(`${id}${DELETE_MINE_SUFFIX}`)}
                              checked={selectedCheckbox.includes(`${id}${DELETE_MINE_SUFFIX}`)}
                            />
                          }
                        />
                      </TableCell>

                      {/* asd */}
                      <TableCell>
                        <FormControlLabel
                          label='Create By User'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}${CREATE_BY_USER_SUFFIX}`}
                              onChange={() => togglePermission(`${id}${CREATE_BY_USER_SUFFIX}`)}
                              checked={selectedCheckbox.includes(`${id}${CREATE_BY_USER_SUFFIX}`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Read By User'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}${READ_BY_USER_SUFFIX}`}
                              onChange={() => togglePermission(`${id}${READ_BY_USER_SUFFIX}`)}
                              checked={selectedCheckbox.includes(`${id}${READ_BY_USER_SUFFIX}`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Update By User'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}${UPDATE_BY_USER_SUFFIX}`}
                              onChange={() => togglePermission(`${id}${UPDATE_BY_USER_SUFFIX}`)}
                              checked={selectedCheckbox.includes(`${id}${UPDATE_BY_USER_SUFFIX}`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Delete By User'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}${DELETE_BY_USER_SUFFIX}`}
                              onChange={() => togglePermission(`${id}${DELETE_BY_USER_SUFFIX}`)}
                              checked={selectedCheckbox.includes(`${id}${DELETE_BY_USER_SUFFIX}`)}
                            />
                          }
                        />
                      </TableCell>

                      {/* asd */}
                      <TableCell>
                        <FormControlLabel
                          label='Create By Company'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}${CREATE_BY_COMPANY_SUFFIX}`}
                              onChange={() => togglePermission(`${id}${CREATE_BY_COMPANY_SUFFIX}`)}
                              checked={selectedCheckbox.includes(`${id}${CREATE_BY_COMPANY_SUFFIX}`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Read By Company'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}${READ_BY_COMPANY_SUFFIX}`}
                              onChange={() => togglePermission(`${id}${READ_BY_COMPANY_SUFFIX}`)}
                              checked={selectedCheckbox.includes(`${id}${READ_BY_COMPANY_SUFFIX}`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Update By Company'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}${UPDATE_BY_COMPANY_SUFFIX}`}
                              onChange={() => togglePermission(`${id}${UPDATE_BY_COMPANY_SUFFIX}`)}
                              checked={selectedCheckbox.includes(`${id}${UPDATE_BY_COMPANY_SUFFIX}`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Delete By Company'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}${DELETE_BY_COMPANY_SUFFIX}`}
                              onChange={() => togglePermission(`${id}${DELETE_BY_COMPANY_SUFFIX}`)}
                              checked={selectedCheckbox.includes(`${id}${DELETE_BY_COMPANY_SUFFIX}`)}
                            />
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* ** Schema Field Groups ** */}
      <Card style={{ marginBottom: 30 }}>
        <CardHeader
          title={<Typography sx={{ textTransform: 'capitalize' }}>Field groups</Typography>}
          action={
            <Button
              onClick={() => {
                setCurrentEntitySchemaFieldGroup(null);
                toggleAddFieldGroupDrawer();
              }}
              variant='contained'
              sx={{ '& svg': { mr: 2 } }}
            >
              <Icon fontSize='1.125rem' icon='tabler:plus' />
              New
            </Button>
          }
        />

        <DataGrid
          autoHeight
          rows={schemaFieldGroups}
          rowHeight={60}
          columns={fieldGroupsColumns}
          disableRowSelectionOnClick
          pageSizeOptions={[7, 10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />

        {!!addFieldGroupOpen && (
          <EntitySchemaFieldGroupFormSidebar
            entitySchemaFieldGroupToEdit={currentEntitySchemaFieldGroup}
            onSubmit={handleOnSubmitFieldGroup}
            open={addFieldGroupOpen}
            toggle={toggleAddFieldGroupDrawer}
            currentFieldGroupsLen={schemaFieldGroups.length}
          />
        )}
      </Card>

      <Card style={{ marginBottom: 30 }}>
        <CardHeader
          title={<Typography sx={{ textTransform: 'capitalize' }}>Indexed Compound filters</Typography>}
          action={
            <>
              <Button onClick={handleSaveIndexedFilters} variant='contained' sx={{ '& svg': { mr: 2 }, mr: 2 }}>
                <Icon fontSize='1.125rem' icon='tabler:edit' />
                Save changes
              </Button>
            </>
          }
        />
        <CardContent>
          <CustomTextField
            sx={{ mb: 4 }}
            required={false}
            fullWidth
            multiline={true}
            name={'indexedCompoundFilters'}
            type='text'
            label={'Indexed Compound Filters'}
            error={errorFields['indexedCompoundFilters']}
            value={indexedCompoundFiltersField}
            onChange={(event) => {
              setIndexedCompoundFiltersField(event.target.value);
            }}
          />
        </CardContent>
      </Card>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  return {
    props: {
      id: params?.id,

      // tab: params?.tab,
    },
  };
};

export default CMSItem;
