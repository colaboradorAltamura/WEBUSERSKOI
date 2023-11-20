// ** MUI Imports
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';

import { useTranslation } from 'react-i18next';
// ** Icon Imports

// ** Types

// ** Demo Component Imports

// ** Custom Components Imports
import { Button, capitalize } from '@mui/material';
import { useEffect, useState } from 'react';
import TextInfo from 'src/@core/components/custom-text-info';
import { handleError, hasRole, parseDateToShortString } from 'src/@core/coreHelper';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { useDynamics } from 'src/hooks/useDynamics';
import {
  ICompany,
  ICompanyEmployee,
  IHealthInsuranceAgreement,
  CompanyEmployeeRoleTypes,
  IUserBasicData,
} from 'src/types/@autogenerated';
import { IForm } from 'src/types/dynamics';
import { IEntitySchema, IEntitySchemaField } from 'src/types/entities';
import DynamicFormSidebar from '../components/dynamics/DynamicFormSidebar';
import { schemaToForm, updateEntityDataBySchema } from '../components/dynamics/helpers';
import { UserDefinedRols } from 'src/types/userDefinedRols';
import { AppRols } from 'src/types/appRols';
import { formatDate } from 'src/@core/utils/format';

interface IEmployee extends IUserBasicData {
  userId: string;
  companyId: string;
  companyEmployeeRole: CompanyEmployeeRoleTypes;
}

interface PropsType {
  docId: string;
  companySchemaArg: IEntitySchema;
  companyDataArg: IEmployee;
  companySchemaFieldsArg: IEntitySchemaField[];
  onUpdateCompany: () => Promise<any>;
}

const SummaryTab = ({
  docId,
  companySchemaArg: companySchemaArg,
  companyDataArg: companyDataArg,
  companySchemaFieldsArg: companySchemaFieldsArg,
  onUpdateCompany,
}: PropsType) => {
  // ** Hooks
  const dynamics = useDynamics();
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  // ** State
  const [companySchema, setCompanySchema] = useState<IEntitySchema>(companySchemaArg);
  const [companySchemaFields, setCompanySchemaFields] = useState<IEntitySchemaField[]>(companySchemaFieldsArg);
  const [companyData, setCompanyData] = useState<IEmployee>(companyDataArg);
  const [editEntityForm, setEditEntityForm] = useState<IForm | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  // const [address, setAddress] = useState<string>('');

  // ** companys
  const [editCompanySidebarOpen, setEditCompanySidebarOpen] = useState<boolean>(false);
  const [editCompanyInfoOpen, setEditCompanyInfoOpen] = useState<boolean>(false);
  const toggleEditCompanyDrawer = () => setEditCompanySidebarOpen(!editCompanySidebarOpen);

  // ** relatives
  const [editRelativeSidebarOpen, setEditRelativeSidebarOpen] = useState<boolean>(false);
  const [editRelativeInfoOpen, setEditRelativeInfoOpen] = useState<boolean>(false);
  const toggleEditRelativeDrawer = () => setEditRelativeSidebarOpen(!editRelativeSidebarOpen);

  // **

  const handleOnEntityEdit_Company = () => {
    try {
      if (!companySchema) throw new Error('missing entitySchema');

      const fieldsNames = ['firstName', 'lastName', 'email', 'phoneNumber', 'companyEmployeeRole'];

      const toShowFields = companySchemaFields.filter((field) => {
        return fieldsNames.includes(field.name);
      });
      const theForm = schemaToForm(companySchema, toShowFields, null, dynamics);

      setEditEntityForm(theForm);

      setEditCompanySidebarOpen(true);
    } catch (e: any) {
      handleError(e);
    }
  };
  const handleOnEditSubmit_Company = async (formData: any) => {
    try {
      setLoadingData(true);

      if (!companySchema || !currentUser.currentUser) throw new Error('Missing entitySchema/currentUser.currentUser');

      await updateEntityDataBySchema(
        currentUser.currentUser,
        companySchema,
        companySchemaFields,
        docId,
        formData,
        null,
        null
      );

      // cierro sidebar
      setEditCompanySidebarOpen(false);

      await onUpdateCompany();

      // apago loading
      setLoadingData(false);
    } catch (e) {
      setLoadingData(false);
      handleError(e);
    }
  };

  const isPermittedByRol = () => {
    return (
      !currentUser.isLoading &&
      !!currentUser.currentUser &&
      (hasRole(currentUser.currentUser?.appRols, AppRols.APP_ADMIN) ||
        hasRole(currentUser.currentUser?.userDefinedRols, UserDefinedRols.UDR_STAFF_COMMERCIAL))
    );
  };
  console.log(companyData);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={capitalize(t('general information'))}
            // action={
            //   isPermittedByRol() ? (
            //     <Button
            //       variant='contained'
            //       onClick={() => {
            //         handleOnEntityEdit_Company();
            //       }}
            //       sx={{ mr: 4, mb: [2, 0] }}
            //     >
            //       {capitalize(t('edit'))}
            //     </Button>
            //   ) : (
            //     ''
            //   )
            // }
          />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <TextInfo title={'name'} value={`${companyData.firstName} ${companyData.lastName}`}></TextInfo>
                <TextInfo title={'email'} value={companyData.email}></TextInfo>
                <TextInfo title={'phone'} value={companyData.phoneNumber}></TextInfo>
                <TextInfo title={'role'} value={companyData.companyEmployeeRole}></TextInfo>
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <TextInfo title={'address'} value={address}></TextInfo>
              </Grid> */}
            </Grid>
          </CardContent>
        </Card>

        {/* {!!editCompanySidebarOpen && (
          <DynamicFormSidebar
            isCreating={false}
            onSubmit={handleOnEditSubmit_Company}
            title={'Edit ' + companySchema?.name}
            formId={'Edit_' + companySchema?.name}
            initialValues={companyData}
            preloadForm={editEntityForm}
            open={editCompanySidebarOpen}
            toggle={toggleEditCompanyDrawer}
            onSubmitDone={() => {
              toggleEditCompanyDrawer();

              return Promise.resolve();
            }}
          />
        )} */}
      </Grid>
    </Grid>
  );
};

export default SummaryTab;
