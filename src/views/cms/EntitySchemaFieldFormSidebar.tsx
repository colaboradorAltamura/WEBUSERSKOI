// ** React Imports
import { Fragment, useEffect, useState } from 'react';

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// formik components
import { Form, Formik, useFormikContext } from 'formik';

import {
  handleError,
  getErrorData,
  capitalize,
  splitByUppercase,
  setSourceEntityData,
  nameof,
  CONDITIONAL_RENDER_NON_EMPTY_STRING,
} from 'src/@core/coreHelper';

import Alert from '@mui/material/Alert';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Types Imports
import Loader from 'src/@core/components/loader';
import { IEntitySchema, IEntitySchemaField, IEntitySchemaFieldGroup } from 'src/types/entities';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import DynamicComponent from '../components/dynamics/DynamicComponent';
import {
  DynamicComponentTypes,
  IDynamicFormSelectComponent,
  IDynamicComponent,
  IDynamicFormComponent,
} from 'src/types/dynamics';
import { useDynamics } from 'src/hooks/useDynamics';
import { processConditionalRender } from 'src/views/components/dynamics/helpers';

interface PropsType {
  open: boolean;
  toggle: () => void;
  onSubmit: (formData: any, isCreating: boolean) => Promise<any>;

  entitySchema: IEntitySchema;
  entitySchemaFieldGroups: IEntitySchemaFieldGroup[];
  entitySchemaFieldToEdit?: IEntitySchemaField | null;
  currentFieldsLen: number;
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between',
}));

const EntitySchemaFieldFormSidebar = ({
  open,
  toggle,
  onSubmit,

  entitySchema,
  entitySchemaFieldGroups,
  entitySchemaFieldToEdit,
  currentFieldsLen,
}: PropsType) => {
  const dynamics = useDynamics();

  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [sidebarTitle, setSidebarTitle] = useState<string | undefined>('');

  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [components, setComponents] = useState<IDynamicComponent[]>([]);

  const [initialValues, setInitialValues] = useState<any>(null);

  const [submitError, setSubmitError] = useState<any>(null);

  // const [activeStep, setActiveStep] = useState<FormStepType>(allSteps[activeStepIndex]);

  useEffect(() => {
    setSubmitError(null);
    if (entitySchemaFieldToEdit) {
      setSidebarTitle('Edit Field');

      setIsCreating(false);
    } else {
      setSidebarTitle('Create Field');
      setIsCreating(true);
    }

    const compsAux: IDynamicComponent[] | IDynamicFormComponent[] = [];

    // ** Name
    compsAux.push({
      id: '',
      name: 'name',
      label: 'Name',
      type: DynamicComponentTypes.FORM_TEXT,
      dimensions: { xs: 12, sm: 12 },

      validation: { isRequired: true },

      tooltip: 'No spaces',
      placeholder: 'eg: firstName',

      onChange: (newValue: any, allValues: any, setFieldValue: any) => {
        if (!newValue) return;
        const labelValue = splitByUppercase(capitalize(newValue));

        setFieldValue('label', labelValue);
      },
    } as IDynamicFormComponent);

    // ** Label
    compsAux.push({
      id: '',
      name: 'label',
      label: 'Label',
      type: DynamicComponentTypes.FORM_TEXT,
      dimensions: { xs: 6, sm: 12 },

      validation: { isRequired: true },
      placeholder: 'eg: First name',
    });

    // ** Order
    compsAux.push({
      id: '',
      name: 'order',
      label: 'Order',
      type: DynamicComponentTypes.FORM_NUMBER,
      dimensions: { xs: 12, sm: 12 },

      validation: { isRequired: true },

      initialValue: currentFieldsLen + 1,

      tooltip: '',
      placeholder: 'eg: 1',
    } as IDynamicFormComponent);

    // ** Field Type
    compsAux.push({
      id: '',
      name: 'fieldType',
      label: 'Field Type',
      type: DynamicComponentTypes.FORM_SELECT,
      dimensions: { xs: 12, sm: 12 },

      validation: { isRequired: true },

      dataSource: {
        fixedOptions: [
          { label: 'Text', value: DynamicComponentTypes.FORM_TEXT, raw: DynamicComponentTypes.FORM_TEXT },
          { label: 'Number', value: DynamicComponentTypes.FORM_NUMBER, raw: DynamicComponentTypes.FORM_NUMBER },
          { label: 'Email', value: DynamicComponentTypes.FORM_EMAIL, raw: DynamicComponentTypes.FORM_EMAIL },
          {
            label: 'Select',
            value: DynamicComponentTypes.FORM_SELECT_ASYNC,
            raw: DynamicComponentTypes.FORM_SELECT_ASYNC,
          },
          {
            label: 'Multi select',
            value: DynamicComponentTypes.FORM_MULTI_SELECT_ASYNC,
            raw: DynamicComponentTypes.FORM_MULTI_SELECT_ASYNC,
          },
          { label: 'Boolean', value: DynamicComponentTypes.FORM_BOOLEAN, raw: DynamicComponentTypes.FORM_BOOLEAN },
          { label: 'Date', value: DynamicComponentTypes.FORM_DATE, raw: DynamicComponentTypes.FORM_DATE },
          { label: 'Relationship', value: DynamicComponentTypes.RELATIONSHIP, raw: DynamicComponentTypes.RELATIONSHIP },
          { label: 'User', value: DynamicComponentTypes.USER, raw: DynamicComponentTypes.USER },
          {
            label: 'Phone number',
            value: DynamicComponentTypes.FORM_PHONE_NUMBER,
            raw: DynamicComponentTypes.FORM_PHONE_NUMBER,
          },

          {
            label: 'Country picker',
            value: DynamicComponentTypes.FORM_COUNTRY_PICKER,
            raw: DynamicComponentTypes.FORM_COUNTRY_PICKER,
          },
          {
            label: 'Country picker constraints',
            value: DynamicComponentTypes.FORM_COUNTRY_PICKER_CONSTRAINTS,
            raw: DynamicComponentTypes.FORM_COUNTRY_PICKER_CONSTRAINTS,
          },
          {
            label: 'Related state',
            value: DynamicComponentTypes.FORM_RELATED_STATE,
            raw: DynamicComponentTypes.FORM_RELATED_STATE,
          },
          {
            label: 'Address',
            value: DynamicComponentTypes.ADDRESS,
            raw: DynamicComponentTypes.ADDRESS,
          },
          {
            label: 'File Uploader',
            value: DynamicComponentTypes.FILE_UPLOADER,
            raw: DynamicComponentTypes.FILE_UPLOADER,
          },
          {
            label: 'Any value',
            value: DynamicComponentTypes.FORM_GENERIC_ANY,
            raw: DynamicComponentTypes.FORM_GENERIC_ANY,
          },
        ],
      },

      tooltip: '',
      initialValue: DynamicComponentTypes.FORM_TEXT,
    } as IDynamicFormComponent);

    // ** DIVIDER COMPONENT ADVANCED START
    compsAux.push({
      id: '',
      name: 'divider_COMPONENT_advanced_START',
      label: '',
      type: DynamicComponentTypes.DIVIDER,
      dimensions: { xs: 12, sm: 12 },
    });

    // ** TITLE "Component specs"
    compsAux.push({
      id: '',
      name: 'component_advanced',
      label: 'Component specs:',
      type: DynamicComponentTypes.TITLE,
      dimensions: { xs: 12, sm: 12 },
    });

    // FORM_TEXT > enableCustomMask
    compsAux.push({
      id: '',
      name: 'enableCustomMask',
      label: 'Custom Mask ?',
      type: DynamicComponentTypes.FORM_BOOLEAN,
      hidden: { edit: false, create: true },
      dimensions: { xs: 12, sm: 12 },

      conditionalRender: [
        {
          when: 'fieldType',
          is: [DynamicComponentTypes.FORM_TEXT],
        },
      ],
    });

    // FORM_TEXT > enableCustomMask > Cleave text field option
    compsAux.push({
      id: '',
      name: 'textCustomMask',
      label: 'Text Custom Mask',
      type: DynamicComponentTypes.FORM_TEXT,
      hidden: { edit: false, create: true },
      dimensions: { xs: 12, sm: 12 },

      conditionalRender: [
        {
          when: 'enableCustomMask',
          is: [true],
        },
      ],
    });

    // --
    // FORM_TEXT > enableHtmlEditor
    compsAux.push({
      id: '',
      name: 'enableHtmlEditor',
      label: 'Enable HTML editor ?',
      type: DynamicComponentTypes.FORM_BOOLEAN,
      hidden: { edit: false, create: true },
      dimensions: { xs: 12, sm: 12 },

      conditionalRender: [
        {
          when: 'fieldType',
          is: [DynamicComponentTypes.FORM_TEXT],
        },
      ],
    });

    // FORM_TEXT > enableTextArea
    compsAux.push({
      id: '',
      name: 'enableTextArea',
      label: 'Enable Text Area ?',
      type: DynamicComponentTypes.FORM_BOOLEAN,
      hidden: { edit: false, create: true },
      dimensions: { xs: 12, sm: 12 },

      conditionalRender: [
        {
          when: 'fieldType',
          is: [DynamicComponentTypes.FORM_TEXT],
        },
      ],
    });

    // FORM_TEXT > textAreaRows
    compsAux.push({
      id: '',
      name: 'textAreaRows',
      label: 'Text Area Rows:',
      type: DynamicComponentTypes.FORM_NUMBER,
      hidden: { edit: false, create: true },
      dimensions: { xs: 12, sm: 12 },
      initialValue: 4,
      conditionalRender: [
        {
          when: 'enableTextArea',
          is: [true],
        },
      ],
    });
    // --

    // FORM_DATE > component props
    compsAux.push({
      id: '',
      name: 'componentProps',
      label: 'Component props',
      type: DynamicComponentTypes.FORM_TEXT,
      hidden: { edit: false, create: true },
      dimensions: { xs: 12, sm: 12 },
      enableTextArea: true,
      textAreaRows: '4',

      conditionalRender: [
        {
          when: 'fieldType',
          is: [DynamicComponentTypes.FORM_DATE],
        },
      ],
    });
    // --

    // FILE_UPLOADER > isPublicDefaultValue
    compsAux.push({
      id: '',
      name: 'isPublicDefaultValue',
      label: 'Is Public Default Value',
      type: DynamicComponentTypes.FORM_BOOLEAN,
      dimensions: { xs: 12, sm: 12 },

      conditionalRender: [
        {
          when: 'fieldType',
          is: [DynamicComponentTypes.FILE_UPLOADER],
        },
      ],
    } as IDynamicFormComponent);

    // FILE_UPLOADER > allowIsPublicSwitch
    compsAux.push({
      id: '',
      name: 'allowIsPublicSwitch',
      label: 'Allow Is Public Switch',
      type: DynamicComponentTypes.FORM_BOOLEAN,
      dimensions: { xs: 12, sm: 12 },

      conditionalRender: [
        {
          when: 'fieldType',
          is: [DynamicComponentTypes.FILE_UPLOADER],
        },
      ],
    } as IDynamicFormComponent);

    // RELATIONSHIP > relationshipSchemaId
    compsAux.push({
      id: '',
      name: 'relationshipSchemaId',
      label: 'Related Schema',
      type: DynamicComponentTypes.FORM_SELECT_ASYNC,
      dimensions: { xs: 12, sm: 12 },

      conditionalRender: [
        {
          when: 'fieldType',
          is: [
            DynamicComponentTypes.RELATIONSHIP,
            DynamicComponentTypes.FORM_SELECT_ASYNC,
            DynamicComponentTypes.FORM_MULTI_SELECT_ASYNC,
          ],
        },
      ],

      dataSource: {
        contextVariableName: null,
        event: {
          name: 'fetchSchemas',
          eventType: 'http-request',
          http: {
            method: 'get',
            endpoint: '/cms/schemas',
            paramsVariables: [],

            // queryFilters: [
            //   {
            //     contextVariableName: '', // si esto es vacio se usa el payload
            //     prop: 'text',

            //     targetFilterName: 'name',
            //     filterOperator: '$contains',
            //   },
            // ],
            url: null,
          },
        },
      },
      onInit: async (values: any, setFieldValue: any) => {
        if (!values.relationshipSchemaId) return;

        const relationshipSchema = dynamics.entitySchemas?.find((item) => {
          return item.id === values.relationshipSchemaId;
        });

        if (!relationshipSchema) return;

        setSourceEntityData({
          obj: values,
          key: nameof<IEntitySchemaField>('relationshipSchemaId'),
          dependencyValue: relationshipSchema,
        });
      },
      onChange: (selectedValue: any, values: any, setFieldValue: any) => {
        if (!selectedValue) return;

        const selectedSchema = selectedValue as IEntitySchema;
        setFieldValue(
          nameof<IEntitySchemaField>('relationshipSchemaLabelPropName'),
          selectedSchema.fieldNameUsedAsSchemaLabel
        );

        if (selectedSchema.isStateRelated) {
          setFieldValue(nameof<IEntitySchemaField>('isRelatedStateOption'), true);
        }
      },
      optionIdProp: 'id',
      optionLabelProps: ['name'],
      optionLabelPropsSeparator: '',
      noOptionsText: 'Search by name',
    } as IDynamicFormComponent);

    // RELATIONSHIP > relationshipSchemaLabelPropName
    compsAux.push({
      id: '',
      name: 'relationshipSchemaLabelPropName',
      label: 'Relationship label prop',
      type: DynamicComponentTypes.FORM_TEXT,
      dimensions: { xs: 12, sm: 12 },

      conditionalRender: [
        {
          when: 'fieldType',
          is: [
            DynamicComponentTypes.RELATIONSHIP,
            DynamicComponentTypes.FORM_SELECT_ASYNC,
            DynamicComponentTypes.FORM_MULTI_SELECT_ASYNC,
          ],
        },
      ],
      placeholder: 'eg: name',
    } as IDynamicFormComponent);

    // RELATIONSHIP > relationshipRequiresSimpleParam
    compsAux.push({
      id: '',
      name: 'relationshipRequiresSimpleParam',
      label: 'Relationship Requires simple param',
      type: DynamicComponentTypes.FORM_BOOLEAN,
      dimensions: { xs: 12, sm: 12 },

      conditionalRender: [
        {
          when: 'fieldType',
          is: [
            DynamicComponentTypes.RELATIONSHIP,
            DynamicComponentTypes.FORM_SELECT_ASYNC,
            DynamicComponentTypes.FORM_MULTI_SELECT_ASYNC,
          ],
        },
      ],
    } as IDynamicFormComponent);

    // RELATIONSHIP > relationshipRequiresUserParam
    compsAux.push({
      id: '',
      name: 'relationshipRequiresUserParam',
      label: 'Relationship Requires user param',
      type: DynamicComponentTypes.FORM_BOOLEAN,
      dimensions: { xs: 12, sm: 12 },

      conditionalRender: [
        {
          when: 'fieldType',
          is: [
            DynamicComponentTypes.RELATIONSHIP,
            DynamicComponentTypes.FORM_SELECT_ASYNC,
            DynamicComponentTypes.FORM_MULTI_SELECT_ASYNC,
          ],
        },
      ],
    } as IDynamicFormComponent);

    // RELATIONSHIP > relationshipRequiresCompanyParam
    compsAux.push({
      id: '',
      name: 'relationshipRequiresCompanyParam',
      label: 'Relationship Requires company param',
      type: DynamicComponentTypes.FORM_BOOLEAN,
      dimensions: { xs: 12, sm: 12 },

      conditionalRender: [
        {
          when: 'fieldType',
          is: [
            DynamicComponentTypes.RELATIONSHIP,
            DynamicComponentTypes.FORM_SELECT_ASYNC,
            DynamicComponentTypes.FORM_MULTI_SELECT_ASYNC,
          ],
        },
      ],
    } as IDynamicFormComponent);

    // RELATIONSHIP > relationshipParamPropName
    compsAux.push({
      id: '',
      name: 'relationshipParamPropName',
      label: 'Relationship Param prop name',
      type: DynamicComponentTypes.FORM_TEXT,
      dimensions: { xs: 12, sm: 12 },

      conditionalRender: [
        {
          when: 'fieldType',
          is: [
            DynamicComponentTypes.RELATIONSHIP,
            DynamicComponentTypes.FORM_SELECT_ASYNC,
            DynamicComponentTypes.FORM_MULTI_SELECT_ASYNC,
          ],
        },
      ],
      placeholder: 'eg: id',
      initialValue: 'id',
    } as IDynamicFormComponent);

    // ** DIVIDER COMPONENT ADVANCED END
    compsAux.push({
      id: '',
      name: 'divider_COMPONENT_advanced_END',
      label: '',
      type: DynamicComponentTypes.DIVIDER,
      dimensions: { xs: 12, sm: 12 },
    });

    // ** Placeholder
    compsAux.push({
      id: '',
      name: 'placeholder',
      label: 'Placeholder',
      type: DynamicComponentTypes.FORM_TEXT,
      dimensions: { xs: 12, sm: 12 },

      validation: { isRequired: false },
      placeholder: 'eg: any help',
    });

    // ** Dimensions (XS/SM)
    compsAux.push({
      id: '',
      name: 'dimensions_xs',
      label: 'Dimensions XS',
      type: DynamicComponentTypes.FORM_NUMBER,
      dimensions: { xs: 6, sm: 6 },

      validation: { isRequired: true },

      initialValue: '12',
    });

    compsAux.push({
      id: '',
      name: 'dimensions_sm',
      label: 'Dimensions SM',
      type: DynamicComponentTypes.FORM_NUMBER,
      dimensions: { xs: 6, sm: 6 },

      validation: { isRequired: true },

      initialValue: '12',
    });

    // ** Tooltip
    compsAux.push({
      id: '',
      name: 'tooltip',
      label: 'Tooltip',
      type: DynamicComponentTypes.FORM_TEXT,
      dimensions: { xs: 12, sm: 12 },
    });

    // ** Is Required
    compsAux.push({
      id: '',
      name: 'isRequired',
      label: 'Is required',
      type: DynamicComponentTypes.FORM_BOOLEAN,
      dimensions: { xs: 6, sm: 6 },
    });

    // ** DIVIDER
    compsAux.push({
      id: '',
      name: 'divider_advanced',
      label: '',
      type: DynamicComponentTypes.DIVIDER,
      dimensions: { xs: 12, sm: 12 },
    });

    // ** title_advanced
    compsAux.push({
      id: '',
      name: 'title_advanced',
      label: 'Advanced',
      type: DynamicComponentTypes.TITLE,
      dimensions: { xs: 12, sm: 12 },
    });

    // ** Hidden
    compsAux.push({
      id: '',
      name: 'enableHidden',
      label: 'Hidden ?',
      type: DynamicComponentTypes.FORM_BOOLEAN,
      dimensions: { xs: 12, sm: 12 },
    });

    compsAux.push({
      id: '',
      name: 'hidden_create',
      label: 'Hidden > When Creating',
      type: DynamicComponentTypes.FORM_BOOLEAN,
      dimensions: { xs: 6, sm: 6 },

      conditionalRender: [
        {
          when: 'enableHidden',
          is: [true],
        },
      ],
    });

    compsAux.push({
      id: '',
      name: 'hidden_edit',
      label: 'Hidden > When Editing',
      type: DynamicComponentTypes.FORM_BOOLEAN,
      dimensions: { xs: 6, sm: 6 },

      conditionalRender: [
        {
          when: 'enableHidden',
          is: [true],
        },
      ],
    });

    // ** DIVIDER
    compsAux.push({
      id: '',
      name: 'divider_readonly',
      label: '',
      type: DynamicComponentTypes.DIVIDER,
      dimensions: { xs: 12, sm: 12 },
    });

    // ** Read only
    compsAux.push({
      id: '',
      name: 'enableReadOnly',
      label: 'Read Only ?',
      type: DynamicComponentTypes.FORM_BOOLEAN,
      dimensions: { xs: 12, sm: 12 },
    });

    compsAux.push({
      id: '',
      name: 'readOnly_create',
      label: 'ReadOnly > When Creating',
      type: DynamicComponentTypes.FORM_BOOLEAN,
      dimensions: { xs: 6, sm: 6 },

      conditionalRender: [
        {
          when: 'enableReadOnly',
          is: [true],
        },
      ],
    });

    compsAux.push({
      id: '',
      name: 'readOnly_edit',
      label: 'ReadOnly > When Editing',
      type: DynamicComponentTypes.FORM_BOOLEAN,
      dimensions: { xs: 6, sm: 6 },

      conditionalRender: [
        {
          when: 'enableReadOnly',
          is: [true],
        },
      ],
    });

    // ** DIVIDER
    compsAux.push({
      id: '',
      name: 'divider_conditionalRender',
      label: '',
      type: DynamicComponentTypes.DIVIDER,
      dimensions: { xs: 12, sm: 12 },
    });

    // ** Conditional render
    compsAux.push({
      id: '',
      name: 'enableConditionalRender',
      label: 'Conditional Render ?',
      type: DynamicComponentTypes.FORM_BOOLEAN,
      dimensions: { xs: 12, sm: 12 },
    });

    compsAux.push({
      id: '',
      name: 'conditionalRenderWhen',
      label: 'ConditionalRender > Inspected Value',
      type: DynamicComponentTypes.FORM_TEXT,
      dimensions: { xs: 12, sm: 12 },

      validation: { isRequired: true },

      tooltip: '',
      placeholder: 'eg: firstName',

      conditionalRender: [
        {
          when: 'enableConditionalRender',
          is: [true],
        },
      ],
    });

    compsAux.push({
      id: '',
      name: 'conditionalRenderIs',
      label: 'ConditionalRender > Values',
      type: DynamicComponentTypes.FORM_SELECT_CREATABLE,
      dimensions: { xs: 12, sm: 12 },

      validation: { isRequired: true },

      dataSource: {
        fixedOptions: [
          // { label: 'Text', value: DynamicComponentTypes.FORM_TEXT },
          // { label: 'Select', value: DynamicComponentTypes.FORM_SELECT },
          // { label: 'Select Creatable', value: DynamicComponentTypes. },
          // { label: 'Boolean', value: DynamicComponentTypes.FORM_BOOLEAN },
        ],
      },

      tooltip: 'Comma separated. "' + CONDITIONAL_RENDER_NON_EMPTY_STRING + '" for non empty value',

      placeholder: 'Eg: "Michel, jon" or "' + CONDITIONAL_RENDER_NON_EMPTY_STRING + '" for non empty value',

      conditionalRender: [
        {
          when: 'enableConditionalRender',
          is: [true],
        },
      ],
    } as IDynamicFormComponent);

    // ** Field Group
    // fieldGroupId
    compsAux.push({
      id: '',
      name: 'fieldGroupId',
      label: 'Field Group',
      type: DynamicComponentTypes.FORM_SELECT,
      dimensions: { xs: 12, sm: 12 },

      validation: { isRequired: false },

      dataSource: {
        fixedOptions: [
          { label: 'None', value: '', raw: null },
          ...entitySchemaFieldGroups.map((fieldGroup) => {
            return { label: fieldGroup.title, value: fieldGroup.id, raw: fieldGroup };
          }),
        ],
      },

      tooltip: '',
      // initialValue: DynamicComponentTypes.FORM_TEXT,

      placeholder: 'eg: First Step',
    } as IDynamicFormComponent);

    // ** isCountryOptionFilter
    compsAux.push({
      id: '',
      name: 'isCountryOptionFilter',
      label: 'Is Country Option Filter ?',
      type: DynamicComponentTypes.FORM_BOOLEAN,
      // readOnly: { edit: true, create: true },
      hidden: { edit: false, create: true },
      dimensions: { xs: 12, sm: 12 },
    });

    // ** isRelatedStateOption
    compsAux.push({
      id: '',
      name: 'isRelatedStateOption',
      label: 'Is Related State Option?',
      type: DynamicComponentTypes.FORM_BOOLEAN,
      // readOnly: { edit: true, create: true },
      hidden: { edit: false, create: true },
      dimensions: { xs: 12, sm: 12 },
      initialValue: false,
      conditionalRender: [
        {
          when: 'fieldType',
          is: [DynamicComponentTypes.FORM_SELECT_ASYNC],
        },
      ],
    });

    // ** isSystemField
    // compsAux.push({
    //   id: '',
    //   name: 'isSystemField',
    //   label: 'Is System Field ?',
    //   type: DynamicComponentTypes.FORM_BOOLEAN,
    //   // readOnly: { edit: true, create: true },
    //   hidden: { edit: false, create: true },
    //   dimensions: { xs: 12, sm: 12 },
    // });

    setComponents(compsAux);

    updateInitialValues(compsAux, entitySchemaFieldToEdit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entitySchemaFieldToEdit]);

  const handleClose = () => {
    toggle();
  };

  const handleBack = () => {
    setActiveStepIndex((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    setActiveStepIndex((prevActiveStep) => prevActiveStep + 1);
  };

  // const isLastStep = activeStepIndex === allSteps.length - 1;
  // const isFirstStep = activeStepIndex === 0;
  const isLastStep = true;
  const isFirstStep = true;

  if (loadingSubmit) return <Loader />;

  const updateInitialValues = (
    components: IDynamicComponent[],
    entitySchemaFieldInitialValues?: IEntitySchemaField | null
  ) => {
    const mixedInitialValues: any = entitySchemaFieldInitialValues ? { ...entitySchemaFieldInitialValues } : {};
    components.forEach((component) => {
      const formComp = component as IDynamicFormComponent;

      if (mixedInitialValues[component.name]) return;

      if (formComp.initialValue) {
        mixedInitialValues[component.name] = formComp.initialValue;
      } else {
        if (component.type === DynamicComponentTypes.FORM_BOOLEAN) mixedInitialValues[component.name] = false;
        else mixedInitialValues[component.name] = '';
      }
    });

    setInitialValues(mixedInitialValues);
  };

  const handleSubmit = async (values: any, actions: any) => {
    try {
      setSubmitError(null);

      actions.setSubmitting(true);

      // clono para no modificar el original del form
      const itemValues = { ...values };

      const keys = Object.keys(itemValues);

      keys.forEach((key) => {
        const itemValue = itemValues[key];

        if (!itemValue.isOptionField) return;

        // es un select async
        itemValues[key] = itemValue.value;
      });

      await onSubmit(itemValues, isCreating);

      actions.setSubmitting(false);

      // actions.resetForm();
    } catch (e) {
      setSubmitError(e);
      actions.setSubmitting(false);

      // handleError(e);
    }
  };

  const renderedNewValues = (values: any) => {
    return null;
  };

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>{sidebarTitle}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: (theme) => `rgba(${theme.palette.customColors.main}, 0.16)`,
            },
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: (theme) => theme.spacing(0, 6, 6) }}>
        {open && (
          <>
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              validationSchema={null}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, isSubmitting }) => (
                <Form id={'entitySchemaField'} autoComplete='off'>
                  {renderedNewValues(values)}
                  <Grid container spacing={5}>
                    {!!submitError && (
                      <Grid item xs={12}>
                        <Alert severity='error'>{getErrorData(submitError).message}</Alert>
                      </Grid>
                    )}
                    {/* <Grid item xs={12}>
                      <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Entity Field
                      </Typography>
                    </Grid> */}
                    {/* {getStepContent(activeStep)} */}

                    <Fragment key={'step' + activeStepIndex}>
                      {processConditionalRender(components, values).map((component, index) => {
                        if ((component.hidden?.create && isCreating) || (component.hidden?.edit && !isCreating))
                          return null;

                        let xs = 12;
                        let sm = 6;

                        if (component.dimensions && component.dimensions.xs) xs = component.dimensions.xs;
                        if (component.dimensions && component.dimensions.sm) sm = component.dimensions.sm;

                        return (
                          <Grid key={index} item xs={xs} sm={sm}>
                            {/* <DynamicFormComponent component={component} /> */}
                            <DynamicComponent component={component} isCreating={isCreating} />
                          </Grid>
                        );
                      })}
                    </Fragment>

                    <Grid
                      item
                      xs={12}
                      sx={{ display: 'flex', justifyContent: isFirstStep ? 'right' : 'space-between' }}
                    >
                      {!isFirstStep && (
                        <Button variant='tonal' color='secondary' disabled={activeStepIndex === 0} onClick={handleBack}>
                          Back
                        </Button>
                      )}

                      {isLastStep && (
                        <Button variant='contained' type={'submit'} disabled={isSubmitting}>
                          Submit
                        </Button>
                      )}

                      {!isLastStep && (
                        <Button variant='contained' type={'button'} onClick={handleNext} disabled={isSubmitting}>
                          Next
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default EntitySchemaFieldFormSidebar;
