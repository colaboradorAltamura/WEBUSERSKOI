// ** MUI Imports
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { Button, capitalize, styled } from '@mui/material';
import TextInfo from 'src/@core/components/custom-text-info';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { useDynamics } from 'src/hooks/useDynamics';
import { IForm } from 'src/types/dynamics';
import { IEntitySchema, IEntitySchemaField, IEntitySchemaWithFields } from 'src/types/entities';
import { createEntityDataBySchema, schemaToForm, updateEntityDataBySchema } from '../components/dynamics/helpers';
import Loader from 'src/@core/components/loader';
import { dynamicGet, dynamicUpdate } from 'src/services/entitiesDynamicServices';
import { AppRols } from 'src/types/appRols';
import { UserDefinedRols } from 'src/types/userDefinedRols';
import { Collections } from 'src/types/collectionsTypes';
// ** Icon Imports
import {
  getSourceEntityData,
  handleError,
  hasRole,
  nameof,
  parseDateToShortString,
  roundTwoDecimals,
} from 'src/@core/coreHelper';
import {
  IPatientPaymentCondition,
  IPatient,
  ICompany,
  IHealthInsuranceAgreement,
  PaymentConditionStateTypes,
  CMSCollections,
  BusinessTypes,
  IAddress,
} from 'src/types/@autogenerated';
import { useRouter } from 'next/router';
import OptionsMenu from 'src/@core/components/option-menu';
import PaymentConditionForm from '../paymentCondition';
import DynamicFormSidebar from '../components/dynamics/DynamicFormSidebar';
//import PaymentConditionForm from '../PaymentConditions';

const PAYMENT_CONDITIONS = CMSCollections.PATIENT_PAYMENT_CONDITIONS;
interface PropsType {
  docId: string;
  patientSchemaArg: IEntitySchema;
  patientDataArg: IPatient;
  patientSchemaFieldsArg: IEntitySchemaField[];
  primaryAddressArg: IAddress | null;
  onUpdatePatient: () => Promise<any>;
}

const calculateMonthlyHoursRate = (hours: number, hourRate: number) => {
  return hours * hourRate;
};

const calculateMonthlyHoursRateTax = (monthlyHoursRate: number, tax: string) => {
  if (!tax) return 0;
  if (tax === 'iva_21') return monthlyHoursRate * 1.21;
  else if (tax === 'iva_10_5') return monthlyHoursRate * 1.105;
  else if (tax === 'tax_free') return monthlyHoursRate;

  return 0;
};

const calculateMargin = (workerHours: number, enliteRate: number) => {
  if (!enliteRate) return 0;

  return (1 - workerHours) / enliteRate;
};

const ContractedServiceTab = ({
  docId,
  patientSchemaArg,
  patientDataArg,
  patientSchemaFieldsArg,
  primaryAddressArg,
  onUpdatePatient,
}: PropsType) => {
  // ** Hooks
  const dynamics = useDynamics();
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const router = useRouter();

  // ** State
  const [patientSchema, setPatientSchema] = useState<IEntitySchema>(patientSchemaArg);
  const [patientEntitySchemaFields, setPatientEntitySchemaFields] =
    useState<IEntitySchemaField[]>(patientSchemaFieldsArg);
  const [patientData, setPatientData] = useState<IPatient>(patientDataArg);
  const [patientPaymentConditionData, setPatientPaymentConditionData] = useState<IPatientPaymentCondition | null>();

  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [toggleData, setToggleData] = useState<boolean>(false);
  const [displayHealthInsurance, setDisplayHealthInsurance] = useState<string>();
  const [primaryAddress, setPrimaryAddress] = useState<IAddress | null>(primaryAddressArg);
  const [address, setAddress] = useState<string>('');

  const [patientPaymentConditionsEntitySchema, setPatientPaymentConditionsEntitySchema] =
    useState<IEntitySchema | null>(null);
  const [patientPaymentConditionsEntitySchemaFields, setPatientPaymentConditionsEntitySchemaFields] = useState<
    IEntitySchemaField[]
  >([]);
  const [loadingSchema, setLoadingSchema] = useState<boolean>(true);

  // ** certificates
  const [editCertificatesSideOpen, setEditCertificatesSideOpen] = useState<boolean>(false);
  const toggleEditCertificatesDrawer = () => setEditCertificatesSideOpen(!editCertificatesSideOpen);
  const [editCertificatesForm, setEditCertificatesForm] = useState<IForm | null>(null);

  // ** service
  const [editServiceSideOpen, setEditServiceSideOpen] = useState<boolean>(false);
  const toggleEditServiceDrawer = () => setEditServiceSideOpen(!editServiceSideOpen);
  const [editServiceForm, setEditServiceForm] = useState<IForm | null>(null);

  //** therapist,
  const [editTherapistSideOpen, setEditTherapistSideOpen] = useState<boolean>(false);
  const toggleEditTherapistDrawer = () => setEditTherapistSideOpen(!editTherapistSideOpen);
  const [editTherapistForm, setEditTherapistForm] = useState<IForm | null>(null);

  const [isCreating, setIsCreating] = useState<boolean>(true);

  useEffect(() => {
    if (!primaryAddress) return;
    setAddress(primaryAddress.addressString ?? '');
  }, [address]);

  // ** Effects
  useEffect(() => {
    const doAsync = async () => {
      try {
        if (dynamics.isLoadingSchemas || !dynamics.entitySchemas || !dynamics.entitySchemasFields) return null;

        setLoadingSchema(true);
        const schema = dynamics.entitySchemas.find((schema) => {
          return schema.name === PAYMENT_CONDITIONS;
        });
        if (!schema) throw new Error('Missing schemaName: ' + PAYMENT_CONDITIONS);
        const schemaFields = dynamics.entitySchemasFields.filter((field) => {
          return field.schemaId === schema.id;
        });

        // Fetch Schema
        // const entitySchemaResponse = (await getEntitySchemaByName(schemaName)) as IEntitySchemaWithFields;
        const entitySchemaResponse: IEntitySchemaWithFields = { ...schema, fields: schemaFields };

        setPatientPaymentConditionsEntitySchema(entitySchemaResponse);
        setPatientPaymentConditionsEntitySchemaFields(
          entitySchemaResponse.fields.sort((a, b) => {
            return a.order - b.order;
          })
        );

        setLoadingSchema(false);
      } catch (e: any) {
        handleError(e);
        setLoadingSchema(false);
      }
    };

    doAsync();
  }, []);

  // Obtenemos todos los paymentConditions relacionados a este patient
  useEffect(() => {
    const doAsync = async () => {
      setLoadingData(true);
      try {
        const response = await dynamicGet({
          params: '/cms/' + PAYMENT_CONDITIONS + '/by-prop/' + nameof<IPatientPaymentCondition>('userId') + '/' + docId,
        });

        console.log(response);
        if (!response || !response.items) throw new Error('Invalid response');

        if (response.items[0]) {
          setPatientPaymentConditionData(response.items[0]);
          setIsCreating(false);

          setDisplayHealthInsurance('');
          if (response.items[0].businessType === BusinessTypes.PRIVATE_INSURANCE) setDisplayHealthInsurance('none');
        } else {
          setIsCreating(true);
        }

        setLoadingData(false);
      } catch (e) {
        handleError(e);
        setLoadingData(false);
      }
    };

    doAsync();
  }, [toggleData]);

  const onEdit_Certificates = () => {
    try {
      if (!patientSchema) throw new Error('missing entitySchema');

      const fieldsNames = [nameof<IPatient>('writOfProtection'), nameof<IPatient>('disabilityCertificate')];

      const toShowFields = patientEntitySchemaFields.filter((field) => {
        return fieldsNames.includes(field.name);
      });
      const theForm = schemaToForm(patientSchema, toShowFields, null, dynamics);

      setEditCertificatesForm(theForm);

      setEditCertificatesSideOpen(true);
    } catch (e: any) {
      handleError(e);
    }
  };

  const onEdit_Therapist = () => {
    try {
      if (!patientSchema) throw new Error('missing entitySchema');

      const fieldsNames = [
        nameof<IPatient>('therapistType'),
        nameof<IPatient>('therapistGender'),
        nameof<IPatient>('therapistAmount'),
        nameof<IPatient>('therapistSex'),
        nameof<IPatient>('therapistProfile'),
        nameof<IPatient>('therapistDays'),
        nameof<IPatient>('therapistWeeklyHours'),
        nameof<IPatient>('therapistSchedule'),
        nameof<IPatient>('therapistMonthlyHours'),
      ];

      const toShowFields = patientEntitySchemaFields.filter((field) => {
        return fieldsNames.includes(field.name);
      });
      const theForm = schemaToForm(patientSchema, toShowFields, null, dynamics);

      setEditTherapistForm(theForm);

      setEditTherapistSideOpen(true);
    } catch (e: any) {
      handleError(e);
    }
  };

  const onEdit_Service = () => {
    try {
      if (!patientSchema) throw new Error('missing entitySchema');

      const fieldsNames = [
        nameof<IPatient>('serviceType'),
        nameof<IPatient>('schoolName'),
        nameof<IPatient>('schoolContact'),
      ];

      const toShowFields = patientEntitySchemaFields.filter((field) => {
        return fieldsNames.includes(field.name);
      });
      const theForm = schemaToForm(patientSchema, toShowFields, null, dynamics);

      setEditServiceForm(theForm);

      setEditServiceSideOpen(true);
    } catch (e: any) {
      handleError(e);
    }
  };

  const onSubmit_Patient = async (formData: any) => {
    try {
      setLoadingData(true);

      if (!patientSchema || !currentUser.currentUser) throw new Error('Missing entitySchema/currentUser.currentUser');

      await updateEntityDataBySchema(
        currentUser.currentUser,
        patientSchema,
        patientEntitySchemaFields,
        docId,
        formData,
        null,
        null
      );

      // cierro sidebar
      closeSideBar();

      await onUpdatePatient();

      // apago loading
      setLoadingData(false);
    } catch (e) {
      setLoadingData(false);
      handleError(e);
    }
  };

  const closeSideBar = () => {
    setEditCertificatesSideOpen(false);
    setEditServiceSideOpen(false);
    setEditTherapistSideOpen(false);
  };

  const isFieldsCompleted = () => {
    const requeridFieldsNames = [
      nameof<IPatientPaymentCondition>('businessType'),
      nameof<IPatientPaymentCondition>('paymentMode'),
      nameof<IPatientPaymentCondition>('taxCondition'),
      nameof<IPatientPaymentCondition>('healthInsuranceId'),
      nameof<IPatientPaymentCondition>('healthInsuranceAgreementId'),
      nameof<IPatientPaymentCondition>('hourlyRateWorker'),
      nameof<IPatientPaymentCondition>('collectionPeriod'),
      nameof<IPatientPaymentCondition>('paymentDate'),
      nameof<IPatientPaymentCondition>('hourlyRateEnlite'),
      nameof<IPatientPaymentCondition>('monthlyHours'),
      nameof<IPatientPaymentCondition>('validFrom'),
      nameof<IPatientPaymentCondition>('validUntil'),
    ];
    if (!patientPaymentConditionData) throw new Error('Missing entityData');

    const isValid = requeridFieldsNames.find(
      (field) => !patientPaymentConditionData[field as keyof IPatientPaymentCondition]
    );

    return !isValid;
  };

  const isPermittedByRol = (role: string) => {
    //UserDefinedRols.UDR_STAFF_COMMERCIAL
    return (
      !currentUser.isLoading &&
      !!currentUser.currentUser &&
      (hasRole(currentUser.currentUser?.appRols, AppRols.APP_ADMIN) ||
        hasRole(currentUser.currentUser?.userDefinedRols, role))
    );
  };

  const getHeatlhInsuranceFriendlyName = (patientPaymentConditionData?: IPatientPaymentCondition | null) => {
    if (!patientPaymentConditionData) return '';

    const sourceData = getSourceEntityData({
      obj: patientPaymentConditionData,
      key: nameof<IPatientPaymentCondition>('healthInsuranceId'),
    });
    if (!sourceData) return '';

    return (sourceData as ICompany).name;
  };

  const getHealthInsuranceAgreementFriendlyName = (patientPaymentConditionData?: IPatientPaymentCondition | null) => {
    if (!patientPaymentConditionData) return '';

    const sourceData = getSourceEntityData({
      obj: patientPaymentConditionData,
      key: nameof<IPatientPaymentCondition>('healthInsuranceAgreementId'),
    });
    if (!sourceData) return '';

    return (sourceData as IHealthInsuranceAgreement).name;
  };

  const updateEntitybyId = async (formData: any, schema: string, id: string) => {
    let response = null;

    response = await dynamicUpdate({
      params: `/cms/${schema}/` + id,
      data: formData,
    });
  };

  if (loadingData) return <Loader />;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                patientPaymentConditionData?.businessType === 'insurance'
                  ? capitalize(t('insurance'))
                  : capitalize(t(patientPaymentConditionData?.businessType ?? ''))
              }
              action={
                isPermittedByRol(UserDefinedRols.UDR_STAFF_CLINIC) ? (
                  <Button
                    variant='contained'
                    onClick={() => {
                      alert();
                    }}
                    sx={{ mr: 4, mb: [2, 0] }}
                  >
                    {capitalize(t('edit'))}
                  </Button>
                ) : (
                  ''
                )
              }
            />
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <TextInfo
                    visible={displayHealthInsurance}
                    title={'health insurance'}
                    value={getHeatlhInsuranceFriendlyName(patientPaymentConditionData)}
                  ></TextInfo>
                  <TextInfo
                    visible={displayHealthInsurance}
                    title={'insuranceNumber'}
                    value={''} //applicantData.insuranceNumber}
                  ></TextInfo>
                  <TextInfo title={'paymentMode'} value={patientPaymentConditionData?.paymentMode}></TextInfo>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={capitalize(t('certificates'))}
              action={
                isPermittedByRol(UserDefinedRols.UDR_STAFF_CLINIC) ? (
                  <Button
                    variant='contained'
                    onClick={() => {
                      onEdit_Certificates();
                    }}
                    sx={{ mr: 4, mb: [2, 0] }}
                  >
                    {capitalize(t('edit'))}
                  </Button>
                ) : (
                  ''
                )
              }
            />
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <TextInfo title={'amparo'} value={patientData.writOfProtection}></TextInfo>
                  <TextInfo title={'cudCertificate'} value={patientData.disabilityCertificate}></TextInfo>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {!!editCertificatesSideOpen && (
            <DynamicFormSidebar
              isCreating={false}
              onSubmit={onSubmit_Patient}
              title={'Edit certificates'}
              formId={'Edit_certificates'}
              initialValues={patientData}
              preloadForm={editCertificatesForm}
              open={editCertificatesSideOpen}
              toggle={toggleEditCertificatesDrawer}
              onSubmitDone={() => {
                toggleEditCertificatesDrawer();

                return Promise.resolve();
              }}
            />
          )}
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={capitalize(t('contracted service'))}
              action={
                isPermittedByRol(UserDefinedRols.UDR_STAFF_CLINIC) ? (
                  <Button
                    variant='contained'
                    onClick={() => {
                      onEdit_Service();
                    }}
                    sx={{ mr: 4, mb: [2, 0] }}
                  >
                    {capitalize(t('edit'))}
                  </Button>
                ) : (
                  ''
                )
              }
            />
            <CardContent>
              <Grid container spacing={0}>
                <Grid item xs={12} md={12}>
                  <TextInfo title={'address'} value={address}></TextInfo>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInfo title={'service type'} value={patientData.serviceType}></TextInfo>
                  <TextInfo title={'schoolName'} value={patientData.schoolName}></TextInfo>
                  <TextInfo title={'schoolContact'} value={patientData.schoolContact}></TextInfo>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {!!editServiceSideOpen && (
            <DynamicFormSidebar
              isCreating={false}
              onSubmit={onSubmit_Patient}
              title={'Edit service'}
              formId={'Edit_service'}
              initialValues={patientData}
              preloadForm={editServiceForm}
              open={editServiceSideOpen}
              toggle={toggleEditServiceDrawer}
              onSubmitDone={() => {
                toggleEditServiceDrawer();

                return Promise.resolve();
              }}
            />
          )}
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={capitalize(t('therapist profile'))}
              action={
                isPermittedByRol(UserDefinedRols.UDR_STAFF_CLINIC) ? (
                  <Button
                    variant='contained'
                    onClick={() => {
                      onEdit_Therapist();
                    }}
                    sx={{ mr: 4, mb: [2, 0] }}
                  >
                    {capitalize(t('edit'))}
                  </Button>
                ) : (
                  ''
                )
              }
            />
            <CardContent>
              <Grid container spacing={0}>
                <Grid item xs={12} md={6}>
                  <TextInfo title={'therapist'} value={patientData.therapistType}></TextInfo>
                  <TextInfo title={'gender'} value={patientData.therapistGender}></TextInfo>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInfo title={'therapist amoung'} value={patientData.therapistAmount}></TextInfo>
                  <TextInfo title={'sex'} value={patientData.therapistSex}></TextInfo>
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextInfo title={'profile'} value={patientData.therapistProfile}></TextInfo>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInfo title={'days'} value={patientData.therapistDays}></TextInfo>
                  <TextInfo title={'weekly hours'} value={patientData.therapistWeeklyHours}></TextInfo>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInfo title={'schedule'} value={patientData.therapistSchedule}></TextInfo>
                  <TextInfo title={'monthly hours'} value={patientData.therapistMonthlyHours}></TextInfo>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {!!editTherapistSideOpen && (
            <DynamicFormSidebar
              isCreating={false}
              onSubmit={onSubmit_Patient}
              title={'Edit therapist'}
              formId={'Edit_Therapist'}
              initialValues={patientData}
              preloadForm={editTherapistForm}
              open={editTherapistSideOpen}
              toggle={toggleEditTherapistDrawer}
              onSubmitDone={() => {
                toggleEditTherapistDrawer();

                return Promise.resolve();
              }}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ContractedServiceTab;
