// ** React Imports
import { Ref, useState, forwardRef, ReactElement, useEffect, ErrorInfo } from 'react';
import Link from 'next/link';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import Fade, { FadeProps } from '@mui/material/Fade';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Avatar from '@mui/material/Avatar';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import Tooltip from '@mui/material/Tooltip';

// ** Tab Content Imports

import DialogTabOneToManySchema from 'src/views/cms/list/createSchemaDialogTabs/DialogTabOneToManySchema';
import DialogTabRelationshipSchema from 'src/views/cms/list/createSchemaDialogTabs/DialogTabRelationshipSchema';
import DialogTabDetails from 'src/views/cms/list/createSchemaDialogTabs/DialogTabDetails';
import DialogTabUserSchemaRelatedRole from 'src/views/cms/list/createSchemaDialogTabs/DialogTabUserSchemaRelatedRole';
import DialogTabSelectOptionsSchema from 'src/views/cms/list/createSchemaDialogTabs/DialogTabSelectOptionsSchema';

import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import Icon from 'src/@core/components/icon';
import Loader from 'src/@core/components/loader';
import {
  CODE_PROP_LABEL,
  CODE_PROP_NAME,
  COUNTRY_CONSTRAINTS_PROP_NAME,
  NAME_PROP_LABEL,
  NAME_PROP_NAME,
  RELATED_STATE_PROP_NAME,
  USERS_SCHEMA,
  USER_PROP_LABEL,
  USER_PROP_NAME,
  handleError,
  singularize,
  splitByUppercase,
} from 'src/@core/coreHelper';

import {
  createEntitySchema,
  createEntitySchemaField,
  createUserDefinedRol,
  listEntitiesSchemas,
  listUserDefinedRols,
  updateEntitySchema,
} from 'src/services/entitiesSchemasServices';

import { EntitySchemaTypes, IEntitySchema, IEntitySchemaField, IUserRol } from 'src/types/entities';
import { DynamicComponentTypes } from 'src/types/dynamics';
import DataModelGraph from 'src/views/cms/DataModelGraph';
import OptionsMenu from 'src/@core/components/option-menu';
import CardSnippet from 'src/@core/components/card-snippet';
import { useDynamics } from 'src/hooks/useDynamics';
import { capitalize } from '@mui/material';
import { dynamicGet } from 'src/services/entitiesDynamicServices';

interface CellType {
  row: IEntitySchema;
}

interface TabLabelProps {
  title: string;
  active: boolean;
  subtitle: string;
  icon: ReactElement;
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const TabLabel = (props: TabLabelProps) => {
  const { icon, title, subtitle, active } = props;

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            ...(active
              ? { color: 'common.white', backgroundColor: 'primary.main' }
              : { backgroundColor: 'action.selected' }),
          }}
        >
          {icon}
        </Avatar>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant='h6'>{title}</Typography>
          <Typography sx={{ textTransform: 'none', color: 'text.disabled', fontWeight: 500 }}>{subtitle}</Typography>
        </Box>
      </Box>
    </div>
  );
};

const tabsArrInitialValue = [
  'detailsTab',
  // 'tab_fields',
  'submitTab',
];

const CMS = () => {
  // ** Hooks
  const router = useRouter();
  const dynamics = useDynamics();

  // ** State
  const [show, setShow] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('detailsTab');

  const [entitySchemas, setEntitySchemas] = useState<IEntitySchema[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [showDataModel, setShowDataModel] = useState<boolean>(false);
  const [dataModelCode, setDataModelCode] = useState<any>(null);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });

  const [submitError, setSubmitError] = useState<any>(null);

  const [toggleData, setToggleData] = useState<boolean>(false);

  const [selectedSchemaType, setSelectedSchemaType] = useState<EntitySchemaTypes>(EntitySchemaTypes.MAIN_ENTITY);
  const [selectedSchemaName, setSelectedSchemaName] = useState<string>('');
  const [selectedRoleName, setSelectedRoleName] = useState<string>('');
  const [relationshipSourceSchema, setRelationshipSourceSchema] = useState<IEntitySchema | null>(null);
  const [relationshipTargetSchema, setRelationshipTargetSchema] = useState<IEntitySchema | null>(null);

  const [isCountryFiltered, setIsCountryFiltered] = useState<boolean>(true);
  const [isStateRelated, setIsStateRelated] = useState<boolean>(true);

  const [tabsArray, setTabsArray] = useState<string[]>(tabsArrInitialValue);

  useEffect(() => {
    const doAsync = async () => {
      try {
        setLoading(true);

        if (!dynamics.entitySchemas) return;

        setEntitySchemas(dynamics.entitySchemas);

        setLoading(false);
      } catch (e) {
        setLoading(false);
        handleError(e);
      }
    };

    doAsync();
  }, [toggleData, dynamics.entitySchemas]);

  useEffect(() => {
    if (selectedSchemaType === EntitySchemaTypes.USER_ENTITY) {
      setTabsArray([
        'detailsTab',
        'tab_userEntityType',
        // 'tab_fields',
        'submitTab',
      ]);
    } else if (selectedSchemaType === EntitySchemaTypes.SELECT_OPTIONS_ENTITY) {
      setTabsArray([
        'detailsTab',
        'tab_selectOptionsEntityType',
        // 'tab_fields',
        'submitTab',
      ]);
    } else if (selectedSchemaType === EntitySchemaTypes.RELATIONSHIP_ENTITY) {
      setTabsArray([
        'detailsTab',
        'tab_relationshipType',
        // 'tab_fields',
        'submitTab',
      ]);
    } else if (selectedSchemaType === EntitySchemaTypes.ONE_TO_MANY_ENTITY) {
      setTabsArray([
        'detailsTab',
        'tab_onToManyType',
        // 'tab_fields',
        'submitTab',
      ]);
    } else {
      setTabsArray([
        'detailsTab',
        // 'tab_fields',
        'submitTab',
      ]);
    }
  }, [selectedSchemaType]);

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 110,
      field: 'icons',
      headerName: '',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View Content'>
            <IconButton
              size='small'
              component={Link}
              sx={{ color: 'text.secondary' }}
              href={`/cms/content/${row.name}`}
            >
              <Icon icon='tabler:eye' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Edit Schema'>
            <IconButton size='small' component={Link} sx={{ color: 'text.secondary' }} href={`/cms/${row.id}`}>
              <Icon icon='tabler:edit' />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'id',
      headerName: 'id',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{row.id}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      flex: 0.35,
      minWidth: 250,
      field: 'name',
      headerName: 'name',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{row.name}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      flex: 0.35,
      minWidth: 250,
      field: 'schemaType',
      headerName: 'schemaType',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{row.schemaType}</Typography>
          </Box>
        </Box>
      ),
    },
  ];

  const createSchema = async () => {
    if (!selectedSchemaName) throw new Error('Missing Schema name');

    const creationSchemaData: IEntitySchema = {
      id: '',
      organizationId: '',
      collectionName: '',
      description: '',
      indexedFilters: [],
      indexedCompoundFilters: [],

      grantedUserDefinedRols_create: [],
      grantedUserDefinedRols_read: [],
      grantedUserDefinedRols_update: [],
      grantedUserDefinedRols_delete: [],

      grantedUserDefinedRols_create_mine: [],
      grantedUserDefinedRols_read_mine: [],
      grantedUserDefinedRols_update_mine: [],
      grantedUserDefinedRols_delete_mine: [],

      grantedUserDefinedRols_create_by_user: [],
      grantedUserDefinedRols_read_by_user: [],
      grantedUserDefinedRols_update_by_user: [],
      grantedUserDefinedRols_delete_by_user: [],

      grantedUserDefinedRols_create_by_company: [],
      grantedUserDefinedRols_read_by_company: [],
      grantedUserDefinedRols_update_by_company: [],
      grantedUserDefinedRols_delete_by_company: [],

      fieldNameUsedAsSchemaLabel: '',

      name: selectedSchemaName,
      schemaType: selectedSchemaType,

      rootSchema:
        selectedSchemaType !== EntitySchemaTypes.ONE_TO_MANY_ENTITY &&
        selectedSchemaType !== EntitySchemaTypes.RELATIONSHIP_ENTITY &&
        selectedSchemaType !== EntitySchemaTypes.RELATIONSHIP_USER2USER_ENTITY &&
        selectedSchemaType !== EntitySchemaTypes.SELECT_OPTIONS_ENTITY,
    };

    if (selectedSchemaType === EntitySchemaTypes.ONE_TO_MANY_ENTITY) {
      creationSchemaData.relationshipSourceSchemaId = relationshipSourceSchema?.id;
    }

    if (selectedSchemaType === EntitySchemaTypes.RELATIONSHIP_ENTITY) {
      creationSchemaData.relationshipSourceSchemaId = relationshipSourceSchema?.id;
      creationSchemaData.relationshipTargetSchemaId = relationshipTargetSchema?.id;

      // algo muy rebuscado para la relacion User2User (eg patientTerapeuts)
      // TODO - estos son campos que idealmente deberian obtenerse dinamicos, aca los dejamos estaticos en el requester por perf
      if (
        relationshipSourceSchema?.schemaType === EntitySchemaTypes.USER_ENTITY &&
        relationshipTargetSchema?.schemaType === EntitySchemaTypes.USER_ENTITY
      ) {
        // cambio el tipo para identificarlo
        creationSchemaData.schemaType = EntitySchemaTypes.RELATIONSHIP_USER2USER_ENTITY;

        if (relationshipSourceSchema.fixedRoleId)
          creationSchemaData.relationshipSourceRequiredRols = [relationshipSourceSchema.fixedRoleId];

        if (relationshipTargetSchema.fixedRoleId)
          creationSchemaData.relationshipTargetRequiredRols = [relationshipTargetSchema.fixedRoleId];
      }
    }

    if (selectedSchemaType === EntitySchemaTypes.MAIN_ENTITY) {
      creationSchemaData.fieldNameUsedAsSchemaLabel = NAME_PROP_NAME;
    }

    if (selectedSchemaType === EntitySchemaTypes.SELECT_OPTIONS_ENTITY) {
      creationSchemaData.fieldNameUsedAsSchemaLabel = NAME_PROP_NAME;
      creationSchemaData.cacheable = true;
      creationSchemaData.prelodeable = true;
      creationSchemaData.grantedAnonymous_read = true;

      // esto no aplica, este flag es para la entidad que se vincula con esta lista de opciones de tipo stateRelated
      // if (isStateRelated) {
      //   creationSchemaData.isStateRelated = true;
      // } else {
      //   creationSchemaData.isStateRelated = false;
      // }
    }

    if (selectedSchemaType === EntitySchemaTypes.USER_ENTITY && !selectedRoleName) {
      throw new Error('Must define a rol for this type of user');
    }

    const createdSchema: any = await createEntitySchema(creationSchemaData);

    return createdSchema;
  };

  const createRole = async (relatedSchemaId: string) => {
    const creationRoleData: IUserRol = {
      id: '',
      organizationId: '',
      name: selectedRoleName,
      // esto marca el rol para que el usuario si o si tenga que crear la entidad esta para crear el usuario,
      // no le permitiria crear un usuario y luego asignarle este rol
      isSchemaRelated: true,
      relatedSchemaId,
    };

    const createdRole: any = await createUserDefinedRol(creationRoleData as IUserRol);

    return createdRole;
  };

  const handleOnSubmit = async () => {
    try {
      setLoading(true);
      setSubmitError(null);

      if (
        selectedSchemaType === EntitySchemaTypes.RELATIONSHIP_ENTITY &&
        (!relationshipSourceSchema || !relationshipTargetSchema)
      ) {
        throw new Error('Source and target schemas are required');
      }

      const createdSchema = await createSchema();

      // TODO MICHEL hacer esto en el back
      try {
        if (selectedSchemaType === EntitySchemaTypes.USER_ENTITY && selectedRoleName) {
          const newRole = await createRole(createdSchema.id);

          await updateEntitySchema(createdSchema.id, { fixedRoleId: newRole.id });
        }
      } catch (e: any) {
        console.log('Error creating role. ' + e.message);

        handleError(e);
      }

      if (selectedSchemaType === EntitySchemaTypes.USER_ENTITY) {
        const fieldBasicData = {
          id: '',
          schemaId: '',
          organizationId: '',
          fieldType: DynamicComponentTypes.USER,
          dimensions_xs: '12',
          dimensions_sm: '12',
          isRequired: false, // LO DEJO EN FALSE PORQUE PARA LA CREACION DE ENTIDADES NO SE SELECCIONA EL USUARIO SINO SE COMPLETAN SUS CAMPOS
          enableHidden: false,
          hidden_create: false,
          hidden_edit: false,
          enableReadOnly: false,
          readOnly_create: false,
          readOnly_edit: false,
          enableConditionalRender: false,
          placeholder: '',
          tooltip: '',

          isSystemField: true,
          enableCustomMask: false,
          textCustomMask: '',
        };

        const nameFieldData: IEntitySchemaField = {
          ...fieldBasicData,
          name: USER_PROP_NAME,
          label: USER_PROP_LABEL,
          order: 1,
        };

        await createEntitySchemaField(createdSchema.id, nameFieldData);
      }

      if (selectedSchemaType === EntitySchemaTypes.ONE_TO_MANY_ENTITY) {
        if (!relationshipSourceSchema) throw new Error('error...');

        const fieldBasicData = {
          id: '',
          schemaId: '',
          organizationId: '',
          fieldType: DynamicComponentTypes.RELATIONSHIP,
          dimensions_xs: '12',
          dimensions_sm: '12',
          isRequired: true,
          enableHidden: true,
          hidden_create: false,
          hidden_edit: false,
          enableReadOnly: true,
          readOnly_create: false,
          readOnly_edit: true,
          enableConditionalRender: false,
          placeholder: '',
          tooltip: '',
          relationshipSchemaLabelPropName: NAME_PROP_NAME,

          isSystemField: true,
          enableCustomMask: false,
          textCustomMask: '',
        };

        // ** SOURCE
        // relationshipSourceSchema.name: users

        let sourceFieldSingularized = singularize(relationshipSourceSchema.name);
        let sourceFieldSingularizedPropId = sourceFieldSingularized + 'Id';

        if (relationshipSourceSchema.schemaType === EntitySchemaTypes.USER_ENTITY) {
          sourceFieldSingularized = 'user';
          sourceFieldSingularizedPropId = 'userId';
        }

        if (relationshipSourceSchema.schemaType === EntitySchemaTypes.COMPANY_ENTITY) {
          sourceFieldSingularized = 'company';
          sourceFieldSingularizedPropId = 'companyId';
        }

        const sourceFieldData: IEntitySchemaField = {
          ...fieldBasicData,
          name: sourceFieldSingularizedPropId,
          label: sourceFieldSingularized,
          order: 1,

          relationshipSchemaId: relationshipSourceSchema.id,
          relationshipSchemaLabelPropName: relationshipSourceSchema.fieldNameUsedAsSchemaLabel,
          relationshipRequiresSimpleParam: relationshipSourceSchema.schemaType === EntitySchemaTypes.MAIN_ENTITY,
          relationshipRequiresUserParam: relationshipSourceSchema.schemaType === EntitySchemaTypes.USER_ENTITY,
          relationshipRequiresCompanyParam: relationshipSourceSchema.schemaType === EntitySchemaTypes.COMPANY_ENTITY,
          relationshipParamPropName: sourceFieldSingularizedPropId,
        };

        await createEntitySchemaField(createdSchema.id, sourceFieldData);
      }

      if (selectedSchemaType === EntitySchemaTypes.RELATIONSHIP_ENTITY) {
        if (!relationshipSourceSchema || !relationshipTargetSchema) throw new Error('error...');

        const fieldBasicData = {
          id: '',
          schemaId: '',
          organizationId: '',
          fieldType: DynamicComponentTypes.RELATIONSHIP,
          dimensions_xs: '12',
          dimensions_sm: '12',
          isRequired: true,
          enableHidden: false,
          hidden_create: false,
          hidden_edit: false,
          enableReadOnly: true,
          readOnly_create: false,
          readOnly_edit: true,
          enableConditionalRender: false,
          placeholder: '',
          tooltip: '',
          relationshipSchemaLabelPropName: NAME_PROP_NAME,

          isSystemField: true,
          enableCustomMask: false,
          textCustomMask: '',
        };

        if (
          relationshipSourceSchema.schemaType === EntitySchemaTypes.USER_ENTITY &&
          relationshipTargetSchema.schemaType === EntitySchemaTypes.USER_ENTITY
        ) {
          // ** SOURCE
          // relationshipSourceSchema.name: patients

          const sourceFieldSingularized = singularize(relationshipSourceSchema.name);
          const sourceFieldSingularizedPropId = sourceFieldSingularized + 'Id';

          const sourceFieldData: IEntitySchemaField = {
            ...fieldBasicData,
            fieldType: DynamicComponentTypes.USER,
            name: sourceFieldSingularizedPropId,
            label: sourceFieldSingularized,
            order: 1,

            relationshipSchemaId: relationshipSourceSchema.id,
            relationshipSchemaLabelPropName: relationshipSourceSchema.fieldNameUsedAsSchemaLabel,
            relationshipRequiresSimpleParam: false,
            relationshipRequiresUserParam: relationshipSourceSchema.schemaType === EntitySchemaTypes.USER_ENTITY,
            relationshipRequiresCompanyParam: false,
            relationshipParamPropName: sourceFieldSingularizedPropId,
          };

          // ** TARGET

          // relationshipTargetSchema.name: terapeuts

          const targetFieldSingularized = singularize(relationshipTargetSchema.name);
          const targetFieldSingularizedPropId = targetFieldSingularized + 'Id';

          const targetFieldData: IEntitySchemaField = {
            ...fieldBasicData,
            fieldType: DynamicComponentTypes.USER,
            name: targetFieldSingularizedPropId,
            label: targetFieldSingularized,
            order: 2,

            relationshipSchemaId: relationshipTargetSchema.id,
            relationshipSchemaLabelPropName: relationshipTargetSchema.fieldNameUsedAsSchemaLabel,
            relationshipRequiresSimpleParam: false,
            relationshipRequiresUserParam: relationshipTargetSchema.schemaType === EntitySchemaTypes.USER_ENTITY,
            relationshipRequiresCompanyParam: false,
            relationshipParamPropName: targetFieldSingularizedPropId,
          };

          await createEntitySchemaField(createdSchema.id, sourceFieldData);
          await createEntitySchemaField(createdSchema.id, targetFieldData);
        } else {
          // ** SOURCE
          // relationshipSourceSchema.name: users

          let sourceFieldSingularized = singularize(relationshipSourceSchema.name);
          let sourceFieldSingularizedPropId = sourceFieldSingularized + 'Id';

          if (relationshipSourceSchema.schemaType === EntitySchemaTypes.USER_ENTITY) {
            sourceFieldSingularized = 'user';
            sourceFieldSingularizedPropId = 'userId';
          }

          if (relationshipSourceSchema.schemaType === EntitySchemaTypes.COMPANY_ENTITY) {
            sourceFieldSingularized = 'company';
            sourceFieldSingularizedPropId = 'companyId';
          }

          const sourceFieldData: IEntitySchemaField = {
            ...fieldBasicData,
            name: sourceFieldSingularizedPropId,
            label: sourceFieldSingularized,
            order: 1,

            relationshipSchemaId: relationshipSourceSchema.id,
            relationshipSchemaLabelPropName: relationshipSourceSchema.fieldNameUsedAsSchemaLabel,
            relationshipRequiresSimpleParam: relationshipSourceSchema.schemaType === EntitySchemaTypes.MAIN_ENTITY,
            relationshipRequiresUserParam: relationshipSourceSchema.schemaType === EntitySchemaTypes.USER_ENTITY,
            relationshipRequiresCompanyParam: relationshipSourceSchema.schemaType === EntitySchemaTypes.COMPANY_ENTITY,
            relationshipParamPropName: sourceFieldSingularizedPropId,
          };

          // ** TARGET

          // relationshipTargetSchema.name: products

          let targetFieldSingularized = singularize(relationshipTargetSchema.name);
          let targetFieldSingularizedPropId = targetFieldSingularized + 'Id';

          if (relationshipTargetSchema.schemaType === EntitySchemaTypes.USER_ENTITY) {
            targetFieldSingularized = 'user';
            targetFieldSingularizedPropId = 'userId';
          }

          if (relationshipTargetSchema.schemaType === EntitySchemaTypes.COMPANY_ENTITY) {
            targetFieldSingularized = 'company';
            targetFieldSingularizedPropId = 'companyId';
          }
          const targetFieldData: IEntitySchemaField = {
            ...fieldBasicData,
            name: targetFieldSingularizedPropId,
            label: targetFieldSingularized,
            order: 2,

            relationshipSchemaId: relationshipTargetSchema.id,
            relationshipSchemaLabelPropName: relationshipTargetSchema.fieldNameUsedAsSchemaLabel,
            relationshipRequiresSimpleParam: relationshipTargetSchema.schemaType === EntitySchemaTypes.MAIN_ENTITY,
            relationshipRequiresUserParam: relationshipTargetSchema.schemaType === EntitySchemaTypes.USER_ENTITY,
            relationshipRequiresCompanyParam: relationshipTargetSchema.schemaType === EntitySchemaTypes.COMPANY_ENTITY,
            relationshipParamPropName: targetFieldSingularizedPropId,
          };

          await createEntitySchemaField(createdSchema.id, sourceFieldData);
          await createEntitySchemaField(createdSchema.id, targetFieldData);
        }
      }

      if (selectedSchemaType === EntitySchemaTypes.SELECT_OPTIONS_ENTITY) {
        const fieldBasicData = {
          id: '',
          schemaId: '',
          organizationId: '',
          fieldType: DynamicComponentTypes.FORM_TEXT,
          dimensions_xs: '12',
          dimensions_sm: '12',
          isRequired: true,
          enableHidden: false,
          hidden_create: false,
          hidden_edit: false,

          enableReadOnly: false,
          readOnly_create: false,
          readOnly_edit: false,

          enableConditionalRender: false,
          placeholder: '',
          tooltip: '',
          enableCustomMask: false,
          textCustomMask: '',
        };

        const codeFieldData: IEntitySchemaField = {
          ...fieldBasicData,
          isSystemField: true,

          name: CODE_PROP_NAME,
          label: CODE_PROP_LABEL,

          order: 1,

          enableReadOnly: true,
          readOnly_create: false,
          readOnly_edit: true,
        };

        const nameFieldData: IEntitySchemaField = {
          ...fieldBasicData,
          isSystemField: true,

          name: NAME_PROP_NAME,
          label: NAME_PROP_LABEL,
          order: 2,

          enableReadOnly: false,
          readOnly_create: false,
          readOnly_edit: false,
        };

        await createEntitySchemaField(createdSchema.id, codeFieldData);
        await createEntitySchemaField(createdSchema.id, nameFieldData);
        if (isCountryFiltered) {
          const countryFilterFieldData: IEntitySchemaField = {
            ...fieldBasicData,
            isSystemField: true,

            name: COUNTRY_CONSTRAINTS_PROP_NAME,
            label: 'Country constraints',
            order: 3,

            fieldType: DynamicComponentTypes.FORM_COUNTRY_PICKER_CONSTRAINTS,
            isRequired: false,
            isCountryOptionFilter: true,
          };

          await createEntitySchemaField(createdSchema.id, countryFilterFieldData);
        }

        if (isStateRelated) {
          const stateRelatedFieldData: IEntitySchemaField = {
            ...fieldBasicData,
            isSystemField: true,

            name: RELATED_STATE_PROP_NAME,
            label: 'Related state',
            order: 4,

            fieldType: DynamicComponentTypes.FORM_RELATED_STATE,
            isRequired: false,
            isRelatedStateOption: true,

            // workflowRules: [
            //   {
            //     name: 'onRelatedStateChange_UpdateGeneralState',

            //     // const _isCreating = boolean;
            //     // const _isUpdating = boolean;
            //     // const _currentValue = updateArgs.itemData[field.name];
            //     // const _updateArgs = updateArgs;
            //     // const _entitySchemaWithFields = entitySchemaWithFields;

            //     ruleScript: `if (_currentValue ===)`,
            //   },
            // ],
          };

          await createEntitySchemaField(createdSchema.id, stateRelatedFieldData);
        }
      }

      if (selectedSchemaType === EntitySchemaTypes.MAIN_ENTITY) {
        const fieldBasicData = {
          id: '',
          schemaId: '',
          organizationId: '',
          fieldType: DynamicComponentTypes.FORM_TEXT,
          dimensions_xs: '12',
          dimensions_sm: '12',
          isRequired: true,
          enableHidden: false,
          hidden_create: false,
          hidden_edit: false,
          enableReadOnly: false,
          readOnly_create: false,
          readOnly_edit: false,
          enableConditionalRender: false,
          placeholder: '',
          tooltip: '',

          isSystemField: true,
          enableCustomMask: false,
          textCustomMask: '',
        };

        const nameFieldData: IEntitySchemaField = {
          ...fieldBasicData,
          name: NAME_PROP_NAME,
          label: NAME_PROP_LABEL,
          order: 1,
        };

        await createEntitySchemaField(createdSchema.id, nameFieldData);
      }

      setToggleData(!toggleData);

      handleClose();

      router.push(`/cms/${createdSchema.id}`);
    } catch (e) {
      setLoading(false);
      setSubmitError(e);
    }
  };

  const nextArrow = 'tabler:arrow-right';
  const previousArrow = 'tabler:arrow-left';

  const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
    top: 0,
    right: 0,
    color: 'grey.500',
    position: 'absolute',
    boxShadow: theme.shadows[2],
    transform: 'translate(10px, -10px)',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: `${theme.palette.background.paper} !important`,
    transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
    '&:hover': {
      transform: 'translate(7px, -5px)',
    },
  }));

  const handleClose = () => {
    setShow(false);
    setActiveTab('detailsTab');
  };

  const renderTabFooter = () => {
    const prevTab = tabsArray[tabsArray.indexOf(activeTab) - 1];
    const nextTab = tabsArray[tabsArray.indexOf(activeTab) + 1];

    return (
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant='tonal'
          color='secondary'
          disabled={activeTab === 'detailsTab'}
          onClick={() => setActiveTab(prevTab)}
          startIcon={<Icon icon={previousArrow} />}
        >
          Previous
        </Button>
        <Button
          variant='contained'
          color={activeTab === 'submitTab' ? 'success' : 'primary'}
          endIcon={<Icon icon={activeTab === 'submitTab' ? 'tabler:check' : nextArrow} />}
          onClick={() => {
            if (activeTab !== 'submitTab') {
              setActiveTab(nextTab);
            } else {
              handleOnSubmit();
            }
          }}
        >
          {activeTab === 'submitTab' ? 'Submit' : 'Next'}
        </Button>
      </Box>
    );
  };

  const handleOnSchemaTypeChange = (schemaType: EntitySchemaTypes) => {
    setSelectedSchemaType(schemaType);
  };

  const handleOnSchemaNameChange = (schemaName: string) => {
    setSelectedSchemaName(schemaName);
  };

  const handleOnRoleNameChange = (roleName: string) => {
    setSelectedRoleName(roleName);
  };

  const handleOnSourceSchemaChange = (sourceSchema: IEntitySchema) => {
    setRelationshipSourceSchema(sourceSchema);
  };

  const handleOnTargetSchemaChange = (targetSchema: IEntitySchema) => {
    setRelationshipTargetSchema(targetSchema);
  };

  const handleOnIsCountryFilteredChange = (val: boolean) => {
    setIsCountryFiltered(val);
  };

  const handleOnIsStateRelatedChange = (val: boolean) => {
    setIsStateRelated(val);
  };

  const handleShowDataModel = async () => {
    if (!dynamics.entitySchemas) {
      alert('waiting for dynamics.entitySchemas');

      return;
    }

    setShowDataModel(!showDataModel);

    if (!dataModelCode) {
      const dataModel = {
        ts: <></>,
        js: <>Do not use JS !</>,
      };

      let schemaTSText = `export enum CMSCollections {`;

      dynamics.entitySchemas?.forEach((schema, index) => {
        let enumName = schema.name.replaceAll('-', '_');

        enumName = splitByUppercase(enumName, '_').toUpperCase();

        let enumVal = `${enumName} = '${schema.name}'`;

        if (!dynamics.entitySchemas) return;

        if (index !== dynamics.entitySchemas.length - 1) enumVal += `,`;

        schemaTSText += `
  ${enumVal}`;
      });
      // ending
      schemaTSText += `
}

`;

      schemaTSText += `export interface IEntity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  state?: number;
  '@schemaId'?: string;
}

`;

      schemaTSText += `export enum UserStatusTypes {
  USER_STATUS_TYPE_ACTIVE = 'active',
  USER_STATUS_TYPE_DEFAULTER = 'defaulter',
  USER_STATUS_TYPE_INACTIVE = 'inactive',
}

`;

      schemaTSText += `export interface IAddressObject {
  formatted_address?: string;
  address_components?: any[];
  geometry?: any;
  html_attributions?: any[];
}

`;

      schemaTSText += `export interface IAddress {
  addressString?: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
  postal_code?: string;
  state?: string;
  streetAndNumber?: string;
  geohash?: string;
  addressObject?: IAddressObject;
}

`;

      schemaTSText += `export interface IUserBasicData {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  state?: number;

  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  appUserStatus: UserStatusTypes;
  countryCode?: string;
  identificationType?: string;
  identificationNumber?: string;
  dirtyAddress?: IAddress;
}

`;

      schemaTSText += `export interface IAttachment {
  downloadURL?: string;
  refPath: string;
  path: string;
  name: string;
  size: string;
  type: string;
  extension: string;
}

`;

      const udrResponse = await listUserDefinedRols();

      schemaTSText += `export enum UserDefinedRols {`;
      udrResponse.items.forEach((udr, index) => {
        let enumVal = `${udr.id.toUpperCase().replaceAll('-', '_')} = '${udr.id}'`;

        if (index !== udrResponse.items.length - 1) enumVal += `,`;

        schemaTSText += `
  ${enumVal}`;
      });

      schemaTSText += `
}

`;

      const selectOptionsDataPromises: Promise<any>[] = [];
      const selectOptionsSchemas = dynamics.entitySchemas?.filter((schema) => {
        return schema.schemaType === EntitySchemaTypes.SELECT_OPTIONS_ENTITY;
      });

      selectOptionsSchemas?.forEach((opSchema) => {
        selectOptionsDataPromises.push(
          new Promise((resolve, reject) => {
            dynamicGet({ params: '/cms/' + opSchema.name })
              .then((data) => {
                resolve({ data, schema: opSchema });
              })
              .catch((e) => {
                reject(e);
              });
          })
        );
      });

      const resuls = await Promise.all(selectOptionsDataPromises);

      dynamics.entitySchemas?.forEach((schema) => {
        const optionsValues = resuls.find((item) => {
          return item.schema.id === schema.id;
        });

        if (schema.schemaType !== EntitySchemaTypes.SELECT_OPTIONS_ENTITY || !optionsValues) {
          return;
        }
        schemaTSText += `export enum ${capitalize(schema.name)} {`;

        optionsValues.data.items.forEach((item: any, index: number) => {
          let enumVal = `${item.id.toUpperCase().replaceAll('-', '_')} = '${item.id}'`;

          if (index !== optionsValues.data.items.length - 1) enumVal += `,`;

          schemaTSText += `
  ${enumVal}`;
        });

        schemaTSText += `
}

`;
      });

      dynamics.entitySchemas?.forEach((schema) => {
        if (schema.name === USERS_SCHEMA.name) return;

        if (schema.schemaType === EntitySchemaTypes.SELECT_OPTIONS_ENTITY) {
          return;
        } else if (
          schema.schemaType === EntitySchemaTypes.USER_ENTITY ||
          schema.schemaType === EntitySchemaTypes.COMPANY_EMPLOYEES_ENTITY
        ) {
          schemaTSText += `export interface I${capitalize(singularize(schema.name))} extends IUserBasicData {`;
        } else {
          schemaTSText += `export interface I${capitalize(singularize(schema.name))} extends IEntity {`;
        }
        dynamics.entitySchemasFields?.forEach((field) => {
          if (field.schemaId !== schema.id) return;

          let fieldText = '';
          let fieldTypeText = 'string';

          if (field.fieldType === DynamicComponentTypes.FORM_NUMBER) fieldTypeText = 'number';
          else if (field.fieldType === DynamicComponentTypes.FORM_BOOLEAN) fieldTypeText = 'boolean';
          else if (field.fieldType === DynamicComponentTypes.FORM_DATE) fieldTypeText = 'Date';
          else if (field.fieldType === DynamicComponentTypes.ADDRESS) fieldTypeText = 'IAddress';
          else if (field.fieldType === DynamicComponentTypes.FORM_GENERIC_ANY) fieldTypeText = 'any';
          else if (
            field.fieldType === DynamicComponentTypes.FORM_MULTI_SELECT ||
            field.fieldType === DynamicComponentTypes.FORM_MULTI_SELECT_ASYNC ||
            field.fieldType === DynamicComponentTypes.FORM_MULTI_SELECT_CREATABLE ||
            field.fieldType === DynamicComponentTypes.FORM_COUNTRY_PICKER_CONSTRAINTS
          ) {
            fieldTypeText = 'string[]';
          } else if (field.fieldType === DynamicComponentTypes.FILE_UPLOADER) fieldTypeText = 'IAttachment';

          if (field.relationshipSchemaId) {
            const relatedSchema = dynamics.entitySchemas?.find((schema) => {
              return schema.id === field.relationshipSchemaId;
            });

            if (relatedSchema && relatedSchema.schemaType === EntitySchemaTypes.SELECT_OPTIONS_ENTITY) {
              if (
                field.fieldType === DynamicComponentTypes.FORM_MULTI_SELECT ||
                field.fieldType === DynamicComponentTypes.FORM_MULTI_SELECT_ASYNC ||
                field.fieldType === DynamicComponentTypes.FORM_MULTI_SELECT_CREATABLE ||
                field.fieldType === DynamicComponentTypes.FORM_COUNTRY_PICKER_CONSTRAINTS
              ) {
                fieldTypeText = `${capitalize(relatedSchema.name)}[]`;
              } else {
                fieldTypeText = `${capitalize(relatedSchema.name)}`;
              }
            }
          }

          if (field.isRequired) fieldText = `${field.name}: ${fieldTypeText};`;
          else fieldText = `${field.name}?: ${fieldTypeText};`;
          schemaTSText += `
  ${fieldText}`;

          if (field.fieldType === DynamicComponentTypes.FILE_UPLOADER) {
            schemaTSText += `
  ${field.name}_isPublic?: boolean;`;
          }
        });

        // ending
        schemaTSText += `
}

`;
      });

      dataModel.ts = (
        <pre className='language-jsx'>
          <code className='language-jsx'>{`${schemaTSText}`}</code>
        </pre>
      );

      setDataModelCode(dataModel);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title='Entities schemas'
          action={
            <>
              <Button
                onClick={() => {
                  setShow(true);
                }}
                variant='contained'
                sx={{ '& svg': { mr: 2 }, mr: 2 }}
              >
                <Icon fontSize='1.125rem' icon='tabler:plus' />
                New
              </Button>
              <Button
                onClick={() => {
                  handleShowDataModel();
                }}
                variant='contained'
                sx={{ '& svg': { mr: 2 } }}
              >
                <Icon fontSize='1.125rem' icon='tabler:code' />
                Show data model
              </Button>
            </>
          }
        />

        {!showDataModel && (
          <DataGrid
            autoHeight
            rows={entitySchemas}
            rowHeight={60}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  id: false,
                },
              },
            }}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[7, 10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        )}
        <Dialog
          fullWidth
          open={show}
          scroll='body'
          maxWidth='md'
          onClose={handleClose}
          onBackdropClick={handleClose}
          TransitionComponent={Transition}
          sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        >
          <DialogContent
            sx={{
              pr: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pl: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(11)} !important`],
              py: (theme) => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
            }}
          >
            <CustomCloseButton onClick={handleClose}>
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h3' sx={{ mb: 3 }}>
                Create Entity Schema
              </Typography>
              {submitError && <Typography sx={{ color: 'red' }}>{submitError.message}</Typography>}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
              <TabContext value={activeTab}>
                <TabList
                  orientation='vertical'
                  onChange={(e, newValue: string) => setActiveTab(newValue)}
                  sx={{
                    border: 0,
                    minWidth: 200,
                    '& .MuiTabs-indicator': { display: 'none' },
                    '& .MuiTabs-flexContainer': {
                      alignItems: 'flex-start',
                      '& .MuiTab-root': {
                        width: '100%',
                        alignItems: 'flex-start',
                      },
                    },
                  }}
                >
                  <Tab
                    disableRipple
                    value='detailsTab'
                    label={
                      <TabLabel
                        title='Details'
                        subtitle='Enter Details'
                        active={activeTab === 'detailsTab'}
                        icon={<Icon icon='tabler:file-description' />}
                      />
                    }
                  />

                  {selectedSchemaType === EntitySchemaTypes.SELECT_OPTIONS_ENTITY && (
                    <Tab
                      disableRipple
                      value='tab_selectOptionsEntityType'
                      label={
                        <TabLabel
                          title='Define options behaviour'
                          icon={<Icon icon='tabler:3d-cube-sphere' />}
                          subtitle='Optional'
                          active={activeTab === 'tab_selectOptionsEntityType'}
                        />
                      }
                    />
                  )}

                  {selectedSchemaType === EntitySchemaTypes.USER_ENTITY && (
                    <Tab
                      disableRipple
                      value='tab_userEntityType'
                      label={
                        <TabLabel
                          title='Define rol'
                          icon={<Icon icon='tabler:3d-cube-sphere' />}
                          subtitle='Optional'
                          active={activeTab === 'tab_userEntityType'}
                        />
                      }
                    />
                  )}
                  {selectedSchemaType === EntitySchemaTypes.RELATIONSHIP_ENTITY && (
                    <Tab
                      disableRipple
                      value='tab_relationshipType'
                      label={
                        <TabLabel
                          title='Define relationship'
                          icon={<Icon icon='tabler:3d-cube-sphere' />}
                          subtitle='Pick from 2 existent schemas'
                          active={activeTab === 'tab_relationshipType'}
                        />
                      }
                    />
                  )}

                  {selectedSchemaType === EntitySchemaTypes.ONE_TO_MANY_ENTITY && (
                    <Tab
                      disableRipple
                      value='tab_onToManyType'
                      label={
                        <TabLabel
                          title='Define relationship'
                          icon={<Icon icon='tabler:3d-cube-sphere' />}
                          subtitle='Pick from source schema'
                          active={activeTab === 'tab_onToManyType'}
                        />
                      }
                    />
                  )}

                  {/* <Tab
                  disableRipple
                  value='tab_fields'
                  label={
                    <TabLabel
                      title='Fields'
                      subtitle='Submit'
                      icon={<Icon icon='tabler:award' />}
                      active={activeTab === 'tab_fields'}
                    />
                  }
                /> */}
                  <Tab
                    disableRipple
                    value='submitTab'
                    label={
                      <TabLabel
                        title='Submit'
                        subtitle='Submit'
                        icon={<Icon icon='tabler:check' />}
                        active={activeTab === 'submitTab'}
                      />
                    }
                  />
                </TabList>
                <TabPanel value='detailsTab' sx={{ flexGrow: 1, p: '0 !important', mt: [6, 0] }}>
                  <DialogTabDetails
                    onSchemaTypeChange={handleOnSchemaTypeChange}
                    onSchemaNameChange={handleOnSchemaNameChange}
                    initialSchemaType={selectedSchemaType}
                    initialSchemaName={selectedSchemaName}
                  />
                  {renderTabFooter()}
                </TabPanel>

                {selectedSchemaType === EntitySchemaTypes.SELECT_OPTIONS_ENTITY && (
                  <TabPanel value='tab_selectOptionsEntityType' sx={{ flexGrow: 1, p: '0 !important', mt: [6, 0] }}>
                    <DialogTabSelectOptionsSchema
                      onIsCountryFilteredChange={handleOnIsCountryFilteredChange}
                      onIsStateRelatedChange={handleOnIsStateRelatedChange}
                      initialIsCountryFiltered={isCountryFiltered}
                      initialIsStateRelated={isStateRelated}
                    />
                    {renderTabFooter()}
                  </TabPanel>
                )}

                {selectedSchemaType === EntitySchemaTypes.USER_ENTITY && (
                  <TabPanel value='tab_userEntityType' sx={{ flexGrow: 1, p: '0 !important', mt: [6, 0] }}>
                    <DialogTabUserSchemaRelatedRole
                      schemaName={selectedSchemaName}
                      onRoleNameChange={handleOnRoleNameChange}
                    />
                    {renderTabFooter()}
                  </TabPanel>
                )}

                {selectedSchemaType === EntitySchemaTypes.ONE_TO_MANY_ENTITY && (
                  <TabPanel value='tab_onToManyType' sx={{ flexGrow: 1, p: '0 !important', mt: [6, 0] }}>
                    <DialogTabOneToManySchema onSourceSchemaChange={handleOnSourceSchemaChange} />
                    {renderTabFooter()}
                  </TabPanel>
                )}

                {selectedSchemaType === EntitySchemaTypes.RELATIONSHIP_ENTITY && (
                  <TabPanel value='tab_relationshipType' sx={{ flexGrow: 1, p: '0 !important', mt: [6, 0] }}>
                    <DialogTabRelationshipSchema
                      onSourceSchemaChange={handleOnSourceSchemaChange}
                      onTargetSchemaChange={handleOnTargetSchemaChange}
                    />
                    {renderTabFooter()}
                  </TabPanel>
                )}
                {/* <TabPanel value='tab_fields' sx={{ flexGrow: 1, p: '0 !important', mt: [6, 0] }}>
                <DialogTabSchemaFields
                  onSourceSchemaChange={handleOnSourceSchemaChange}
                  onTargetSchemaChange={handleOnTargetSchemaChange}
                />
                {renderTabFooter()}
              </TabPanel> */}

                <TabPanel value='submitTab' sx={{ flexGrow: 1, p: '0 !important', mt: [6, 0] }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant='h4' sx={{ mb: 2 }}>
                      Submit 🥳
                    </Typography>
                    {/* <Typography sx={{ mb: 6, color: 'text.secondary' }}>Submit :)</Typography> */}

                    <img width={200} alt='submit-img' src='/images/pages/girl-with-laptop.png' />
                  </Box>
                  {renderTabFooter()}
                </TabPanel>
              </TabContext>
            </Box>
          </DialogContent>
        </Dialog>
      </Card>

      {showDataModel && !dataModelCode && <Loader />}

      {showDataModel && dataModelCode && (
        <CardSnippet
          title='Data model'
          code={{
            tsx: dataModelCode.ts,
            jsx: dataModelCode.js,
          }}
        >
          <Typography sx={{ mb: 4 }}>
            Follow <code>relationships</code> from this view
          </Typography>
          {entitySchemas && <DataModelGraph />}
        </CardSnippet>
      )}
    </>
  );
};

export default CMS;
