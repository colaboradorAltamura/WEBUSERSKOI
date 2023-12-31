// ** MUI Import
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { Button, CardContent, Typography, backdropClasses, capitalize } from '@mui/material';

import { SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// ** Icon Imports
import Loader from 'src/@core/components/loader';
import { useAuth } from 'src/hooks/useAuth';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import router, { useRouter } from 'next/router';
import { CMSCollections, EnliteServices, IPatient, IPatientTherapeuticProject } from 'src/types/@autogenerated';
import { getSourceEntityData, handleError, nameof, parseDateToShortString } from 'src/@core/coreHelper';
import CustomAvatar from 'src/@core/components/mui/avatar';

import { useSettings } from 'src/@core/hooks/useSettings';
import { Icon } from '@iconify/react';
import { dynamicGet } from 'src/services/entitiesDynamicServices';
import { date } from 'yup';

interface IPatientCustom extends IPatient {
  supervisionDate: Date;
}

const HomeClinic = () => {
  // ** HOOKS
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const { settings } = useSettings();

  // ** Global vars

  // ** States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [patientsData, setPatientsData] = useState<IPatient[]>([]);
  const [patientsCustomData, setPatientsCustomData] = useState<IPatientCustom[]>([]);
  const [patientsOrderbySupervisionDate, setPatientsOrderbySupervisionDate] = useState<IPatientCustom[]>([]);
  const [kpiTotalPatients, setKpiTotalPatients] = useState<number>(0);
  const [kpiTotalPatientNoTherapeuticProject, setKpiTotalPatientNoTherapeuticProject] = useState<number>(0);

  // ** effects
  //obtiene los pacientes activos
  useEffect(() => {
    const doAsync = async () => {
      try {
        setIsLoading(true);

        //gettings all patients
        const totalPatients: any = await dynamicGet({
          params: '/cms/' + CMSCollections.PATIENTS,
          filters: [
            {
              key: nameof<IPatient>('enliteService'),
              value: EnliteServices.CARE,
              operator: '$in',
            },
          ],
        });

        console.log(totalPatients.items);
        if (totalPatients && totalPatients.items) {
          setKpiTotalPatients(totalPatients.items.length);
          setPatientsData(totalPatients.items);
        }

        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        handleError(e);
      }
    };
    doAsync();
  }, []);

  useEffect(() => {
    const doAsync = async () => {
      try {
        setIsLoading(true);

        //getting all PATIENT_THERAPEUTIC_PROJECT
        const data: any = await dynamicGet({
          params: '/cms/' + CMSCollections.PATIENT_THERAPEUTIC_PROJECT,
        });

        if (data.items) {
          //pacientes con proyectos
          const patientsTherapeuticProject = getPatientsTherapeuticProject(data.items);
          //pacientes sin openposition
          const patientNoTherapeuticProject = getPatientsNoTherapeuticProject(patientsTherapeuticProject);

          //el total de los pacientes que NO tienen proyecto terapeutico
          setKpiTotalPatientNoTherapeuticProject(patientNoTherapeuticProject.length);
        }

        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        handleError(e);
      }
    };
    doAsync();
  }, [patientsData]);

  //devuelve los pacientes que tienen proyectos terapeuticos
  const getPatientsTherapeuticProject = (data: any) => {
    const patientsWithProyectoTerapeutico = [] as IPatient[];
    const patientsCustom = [] as IPatientCustom[]; //para obtener el paciente + la fecha de supervision del proyecto

    //guarda la data en una variable tipada
    const proyectoTerapeuticoData = data as IPatientTherapeuticProject[];

    //por cada proyecto terapeutico
    proyectoTerapeuticoData.forEach(function (proyectoTerapeutico) {
      //recorre los pacientes y verificamos por id
      patientsData.forEach(function (patient) {
        //verifica que no este duplicado
        const exist = patientsWithProyectoTerapeutico.includes(patient);
        //si ambos ids coinciden y si no existe en patientsWithProyectoTerapeutico, se agrega
        if (proyectoTerapeutico?.userId == patient.id && !exist) {
          //setea en patiente
          patientsWithProyectoTerapeutico.push(patient);
          //setea en paciente custom
          patientsCustom.push({
            supervisionDate: proyectoTerapeutico.updatedAt ? proyectoTerapeutico.updatedAt : new Date(),
            ...patient,
          });
        }
      });
    });

    //guarda en el state los paciente + su fecha de supervision ordenados por fecha
    setPatientsCustomData(
      patientsCustom.sort(function (a, b) {
        if (!a.supervisionDate || !b.supervisionDate) new Date();

        return new Date(b.supervisionDate).getTime() - new Date(a.supervisionDate).getTime();
      })
    );

    return patientsWithProyectoTerapeutico;
  };

  //devuelve los pacientes sin proyecto terapeuticos
  const getPatientsNoTherapeuticProject = (patientsFiltered: IPatient[]) => {
    return patientsData.filter((patient) => !patientsFiltered.includes(patient));
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={3} sx={{ pb: 4 }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={12}>
              <Card color='primary' sx={{ borderBottom: '1px solid orange' }}>
                <CardContent
                  sx={{
                    display: 'flex',
                    textAlign: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    p: (theme) => `${theme.spacing(9.75, 5, 9.25)} !important`,
                  }}
                >
                  <CustomAvatar skin='light' color='warning' sx={{ width: 50, height: 50, mb: 2.25 }}>
                    <Typography variant='h4' sx={{}}>
                      {kpiTotalPatientNoTherapeuticProject}
                    </Typography>
                  </CustomAvatar>
                  <Typography variant='h4' sx={{ mb: 2.75 }}>
                    {capitalize(t('pending therapeutic projects'))}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={12}>
              <Card color='primary' sx={{ borderBottom: '1px solid green' }}>
                <CardContent
                  sx={{
                    display: 'flex',
                    textAlign: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    p: (theme) => `${theme.spacing(9.75, 5, 9.25)} !important`,
                  }}
                >
                  <CustomAvatar skin='light' color='success' sx={{ width: 50, height: 50, mb: 2.25 }}>
                    <Typography variant='h4' sx={{}}>
                      {kpiTotalPatients}
                    </Typography>
                  </CustomAvatar>
                  <Typography variant='h4' sx={{ mb: 2.75 }}>
                    {capitalize(t('active patients'))}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12} lg={9} sx={{ pb: 4 }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={12}>
              <Card>
                <CardHeader
                  title={capitalize(t('patients with treatment'))}
                  action={
                    <Button
                      variant='contained'
                      onClick={() => {
                        router.push(`/${CMSCollections.PATIENTS}`);
                      }}
                      sx={{ mr: 4, mb: [2, 0] }}
                    >
                      {capitalize(t('see all patients'))}
                    </Button>
                  }
                />
                <CardContent>
                  <Grid container spacing={6}>
                    {patientsCustomData.map((patient: IPatient) => {
                      return (
                        <Grid item xs={6} md={3} key={patient.id}>
                          <Card color='primary' key={patient.id}>
                            <CardContent
                              sx={{
                                display: 'flex',
                                textAlign: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                p: (theme) => `${theme.spacing(6, 5, 4)} !important`,
                              }}
                            >
                              <CustomAvatar skin='light' color='primary' sx={{ width: 30, height: 30, mb: 2.25 }}>
                                <Icon icon={'tabler:user'} fontSize={'20'} />
                              </CustomAvatar>
                              <Typography variant='h6' sx={{ mb: 2.75 }}></Typography>

                              <Button
                                variant='text'
                                fullWidth
                                onClick={() => {
                                  router.push(`/${CMSCollections.PATIENTS}/${patient.id}`);
                                }}
                                sx={{ mr: 4, mb: [2, 0] }}
                              >
                                {`${patient.firstName} ${patient.lastName}`}
                              </Button>
                              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                                {patient.dirtyAddress?.addressString}
                              </Typography>
                              <Typography sx={{ mb: 8, color: 'text.disabled', fontSize: 11, marginTop: 5 }}>
                                <Icon color='primary' fontSize='11' icon={'tabler:clock-edit'} />
                                {parseDateToShortString(patient.createdAt)}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default HomeClinic;
