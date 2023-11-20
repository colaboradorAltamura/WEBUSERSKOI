import { useDynamics } from 'src/hooks/useDynamics';

import {
  DynamicComponentTypes,
  IDynamicFormComponent,
  IDynamicFormFileUploaderComponent,
  IDynamicFormSelectComponent,
} from 'src/types/dynamics';
import DynamicFormComponentBoolean from './DynamicFormComponentBoolean';
import DynamicFormComponentInput from './DynamicFormComponentInput';
import DynamicFormComponentMultiSelectAsync from './DynamicFormComponentMultiSelectAsync';
import DynamicFormComponentSelect from './DynamicFormComponentSelect';
import DynamicFormComponentSelectAsync from './DynamicFormComponentSelectAsync';
import DynamicFormComponentSelectCreatable from './DynamicFormComponentSelectCreatable';
import DynamicFormComponentDate from './DynamicFormComponentDate';
import DynamicFormComponentCountryPicker from './DynamicFormComponentCountryPicker';
import DynamicFormComponentLocation from './DynamicFormComponentLocation';
import DynamicFormComponentRelatedState from './DynamicFormComponentRelatedState';

import DynamicFormComponentPhoneInput from './DynamicFormComponentPhoneInput';

import DynamicFormComponentFileUploader from './DynamicFormComponentFileUploader';

interface PropsType {
  component: IDynamicFormComponent;
  isCreating?: boolean;
}

const DynamicFormComponent = ({ component, isCreating, ...rest }: PropsType) => {
  if (
    component.type === DynamicComponentTypes.FORM_TEXT ||
    component.type === DynamicComponentTypes.FORM_EMAIL ||
    component.type === DynamicComponentTypes.FORM_NUMBER
  )
    return <DynamicFormComponentInput component={component} isCreating={isCreating} {...rest} />;

  if (component.type === DynamicComponentTypes.FORM_BOOLEAN)
    return <DynamicFormComponentBoolean component={component} isCreating={isCreating} {...rest} />;

  if (component.type === DynamicComponentTypes.FORM_DATE)
    return <DynamicFormComponentDate component={component} isCreating={isCreating} {...rest} />;

  if (
    component.type === DynamicComponentTypes.FORM_SELECT ||
    component.type === DynamicComponentTypes.FORM_MULTI_SELECT
  )
    return <DynamicFormComponentSelect component={component} isCreating={isCreating} {...rest} />;

  if (component.type === DynamicComponentTypes.FORM_SELECT_ASYNC) {
    const selectComponent = component as IDynamicFormSelectComponent;

    // let cachedData = null;

    // if (selectComponent.dataSource.schemaId && dynamics.cacheableEntitiesData) {
    //   cachedData = dynamics.cacheableEntitiesData.find((cachedItem) => {
    //     return cachedItem.entitySchemaId === selectComponent.dataSource.schemaId;
    //   });
    // }

    // if (cachedData) {
    //   selectComponent.dataSource.fixedOptions = [{ label: 'Text', value: DynamicComponentTypes.FORM_TEXT }];

    //   return <DynamicFormComponentSelect component={component} isCreating={isCreating} {...rest} />;
    // } else {
    return <DynamicFormComponentSelectAsync component={selectComponent} isCreating={isCreating} {...rest} />;
    // }
  }

  if (component.type === DynamicComponentTypes.USER) {
    return (
      <DynamicFormComponentSelectAsync
        component={component as IDynamicFormSelectComponent}
        isCreating={isCreating}
        {...rest}
      />
    );
  }

  if (component.type === DynamicComponentTypes.FORM_MULTI_SELECT_ASYNC)
    return (
      <DynamicFormComponentMultiSelectAsync
        component={component as IDynamicFormSelectComponent}
        isCreating={isCreating}
        {...rest}
      />
    );

  if (
    component.type === DynamicComponentTypes.FORM_SELECT_CREATABLE ||
    component.type === DynamicComponentTypes.FORM_MULTI_SELECT_CREATABLE
  )
    return <DynamicFormComponentSelectCreatable component={component} isCreating={isCreating} {...rest} />;

  if (component.type === DynamicComponentTypes.FORM_RELATED_STATE)
    return <DynamicFormComponentRelatedState component={component} isCreating={isCreating} {...rest} />;

  if (
    component.type === DynamicComponentTypes.FORM_COUNTRY_PICKER ||
    component.type === DynamicComponentTypes.FORM_COUNTRY_PICKER_CONSTRAINTS
  )
    return <DynamicFormComponentCountryPicker component={component} isCreating={isCreating} {...rest} />;

  if (component.type === DynamicComponentTypes.ADDRESS)
    return <DynamicFormComponentLocation component={component} isCreating={isCreating} {...rest} />;

  if (component.type === DynamicComponentTypes.FORM_PHONE_NUMBER)
    return <DynamicFormComponentPhoneInput component={component} isCreating={isCreating} {...rest} />;

  if (component.type === DynamicComponentTypes.FILE_UPLOADER)
    return (
      <DynamicFormComponentFileUploader
        component={component as IDynamicFormFileUploaderComponent}
        isCreating={isCreating}
        {...rest}
      />
    );

  if (component.type === DynamicComponentTypes.FORM_GENERIC_ANY) return <>*{component.type}* not implemented yet</>;

  // por defecto retorno un component generico
  return <>Invalid component type: {component.type}</>;
};

export default DynamicFormComponent;
