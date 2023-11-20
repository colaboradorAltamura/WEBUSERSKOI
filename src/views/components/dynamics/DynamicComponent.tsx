// formik components

import {
  DynamicComponentTypes,
  IDynamicComponent,
  IDynamicFormComponent,
  IDynamicTableComponent,
} from 'src/types/dynamics';
import DynamicFormComponent from './DynamicFormComponent';
import DynamicTableComponent from './DynamicTableComponent';
import React, { JSXElementConstructor } from 'react';
import Divider from '@mui/material/Divider';

interface PropsType {
  component: IDynamicComponent;
  containerTitle?: string;
  isCreating?: boolean;
}

const DynamicComponent = ({ component, containerTitle, isCreating, ...rest }: PropsType) => {
  if (component.type === DynamicComponentTypes.TITLE) {
    return <h4>{component.label}</h4>;
  }

  if (component.type === DynamicComponentTypes.DIVIDER) {
    return <Divider sx={{ mb: 4 }} />;
  }

  if (component.type === DynamicComponentTypes.TABLE) {
    return (
      <DynamicTableComponent
        component={component as IDynamicTableComponent}
        containerTitle={containerTitle}
        {...rest}
      />
    );
  }

  if (component.type === DynamicComponentTypes.CUSTOM) {
    const Comp = component;
    // const Comp = React.cloneElement(component as JSXElement);

    // return { component };
    return <>TODO Custom comp</>;
  }

  return <DynamicFormComponent component={component as IDynamicFormComponent} isCreating={isCreating} />;
};

export default DynamicComponent;
