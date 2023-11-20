// formik components

// ** React Imports

// ** Next Imports

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

// ** Icon Imports

// ** Store Imports

// ** Custom Components Imports

// ** Utils Import

// ** Actions Imports

// ** Third Party Components

// ** Types Imports

// ** Custom Table Components Imports
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer';

import { IDynamicTableColumnComponent, IDynamicTableComponent, IPreloadEvent, IWidget } from 'src/types/dynamics';
import { useDynamics } from 'src/hooks/useDynamics';
import Loader from 'src/@core/components/loader';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';

// ** Icon Imports
import Icon from 'src/@core/components/icon';
import DynamicFormSidebar from './DynamicFormSidebar';
import { argsToParamsString } from './helpers';

interface PropsType {
  component: IDynamicTableComponent;
  containerTitle?: string;
}

interface ITableCell {
  row: any;
}

const DynamicTableComponent = ({ component, containerTitle, ...rest }: PropsType) => {
  // ** State
  const [loading, setLoading] = useState<boolean>(false);
  const [componentData, setComponentData] = useState<any>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [addOpen, setAddOpen] = useState<boolean>(false);

  const [columns, setColumns] = useState<GridColDef[]>([]);

  const [initialValues, setInitialValues] = useState<any>(null);

  // ** Hooks
  const dynamics = useDynamics();

  const toggleAddDrawer = () => setAddOpen(!addOpen);

  const getItemValueFromPropPath = (propPath: string[], value: any) => {
    if (!value) return null;

    let wow = value;
    propPath.forEach((propKey) => {
      wow = wow[propKey];
    });

    return wow;
  };

  useEffect(() => {
    const variable = getItemValueFromPropPath(
      component.dataSourceContextVariableNamePropPath,
      dynamics.getVariableByName(component.dataSourceContextVariableName)?.value
    );

    // if (!variable || !variable.value || !variable.value.length) return;
    if (!variable || !variable.length) return;

    // setComponentData(variable.value);
    setComponentData(variable);

    const columnsData: GridColDef[] = [];

    component.columns.forEach((column: IDynamicTableColumnComponent) => {
      columnsData.push({
        flex: 0.25,
        minWidth: 280,
        field: column.name,
        headerName: column.name,

        renderCell: ({ row }: ITableCell) => {
          // const { fullName, email } = row;

          const rowValue = getItemValueFromPropPath(column.propPath, row);

          // TODO Terminar...
          if (column.action && column.action.sidebarEditor)
            return (
              <Typography
                onClick={() => {
                  // setInitialValuesEvent(column.action.sidebarEditor?.initialValuesEvent);
                }}
                noWrap
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {rowValue}
              </Typography>
            );
          else if (column.action && column.action.actionRoute)
            return (
              <Typography
                noWrap
                component={Link}
                href={
                  column.action.actionRoute.url +
                  argsToParamsString(row, dynamics.variables, column.action.actionRoute.paramsVariables)
                }
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {rowValue}
              </Typography>
            );

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                {rowValue}
              </Typography>
            </Box>
          );
        },
      });
    });

    setColumns(columnsData);
  }, [
    component.columns,
    component.dataSourceContextVariableName,
    component.dataSourceContextVariableNamePropPath,
    dynamics,
  ]);

  const dataToTableData: any = (data: any) => {
    if (!data) return [] as any;

    const rows: any[] = [];
    data.forEach((item: any) => {
      const row: any = {};

      component.columns.forEach((column) => {
        row[column.name] = getItemValueFromPropPath(column.propPath, item);
      });

      rows.push(row);
    });

    return rows;
  };

  if (loading) return <Loader />;

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={component.label}
            action={
              component.relatedFormId ? (
                <Button onClick={toggleAddDrawer} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                  <Icon fontSize='1.125rem' icon='tabler:plus' />
                  New
                </Button>
              ) : null
            }
          />
          <Divider sx={{ m: '0 !important' }} />
          {/* <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddDrawer} /> */}
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={dataToTableData(componentData)}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      {!!component.relatedFormId && (
        <DynamicFormSidebar
          title={containerTitle}
          formId={component.relatedFormId}
          open={addOpen}
          toggle={toggleAddDrawer}
          onSubmitDone={() => {
            dynamics.refreshVariableDataToggle(component.dataSourceContextVariableName);

            toggleAddDrawer();

            return Promise.resolve();
          }}
        />
      )}

      {!!component.relatedFormId && (
        <DynamicFormSidebar
          title={containerTitle}
          formId={component.relatedFormId}
          open={addOpen}
          toggle={toggleAddDrawer}
          onSubmitDone={() => {
            dynamics.refreshVariableDataToggle(component.dataSourceContextVariableName);

            toggleAddDrawer();

            return Promise.resolve();
          }}
        />
      )}
    </Grid>
  );
};

export default DynamicTableComponent;
