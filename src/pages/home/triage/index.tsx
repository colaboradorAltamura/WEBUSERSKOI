// ** MUI Import
import { Grid, Paper } from '@mui/material';
// ** Demo Component Imports
import PieChart from 'src/views/charts/recharts/RechartsPieChart';
import WidgetOldestClinicPatients from 'src/views/dashboards/crm/TableWidgets/WidgetOldestClinicPatients';

// ** Custom Component Imports
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical';
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dynamicGet } from 'src/services/entitiesDynamicServices';
import {
  ApplicantsStateTypes,
  EnliteServices,
  IApplicant,
  IPatient,
  PatientsClinicStateTypes,
} from 'src/types/@autogenerated';

import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';

interface IPatientsListResponse {
  total: number;
  hasMore: boolean;
  items: IPatient[];
}

const HomeTriage = () => {
  const [closedApplicants, setClosedApplicants] = useState<any[]>([]);
  const [openApplicants, setOpenApplicants] = useState<any[]>([]);
  const [compError, setCompError] = useState<any[] | null>(null);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const { t } = useTranslation();

  // Faltan traducciones
  useEffect(() => {
    const doAsync = async () => {
      try {
        const response = (await dynamicGet({
          params: '/cms/' + 'patients',
          filters: [
            {
              key: 'enliteService',
              value: [EnliteServices.CLINIC],
              operator: '$in',
            },
          ],
        })) as IPatientsListResponse;

        // Pie chart data
        const pendingInformation = response.items.filter(
          (item) =>
            item.clinicStateType === PatientsClinicStateTypes.PENDING_INFORMATION ||
            item.clinicStateType === PatientsClinicStateTypes.PENDING_PARTIAL_INFO
        );
        const pendingTriage = response.items.filter(
          (item) => item.clinicStateType === PatientsClinicStateTypes.PENDING_TRIAGE
        );
        const waitingPayment = response.items.filter(
          (item) => item.clinicStateType === PatientsClinicStateTypes.WAITING_PAYMENT
        );
        const active = response.items.filter((item) => item.clinicStateType === PatientsClinicStateTypes.ACTIVE);

        const dataToRender = [];

        if (pendingInformation.length !== 0) {
          dataToRender.push({ name: t('pending-information'), value: pendingInformation.length, color: '#F562C5' });
        }
        if (pendingTriage.length !== 0) {
          dataToRender.push({ name: t('pending-triage'), value: pendingTriage.length, color: '#F999DB' });
        }
        if (waitingPayment.length !== 0) {
          dataToRender.push({ name: t('waiting-payment'), value: waitingPayment.length, color: '#F227AF' });
        }
        if (active.length !== 0) {
          dataToRender.push({ name: t('active'), value: active.length, color: '#28C76F' });
        }

        setPieChartData(dataToRender);
      } catch (e: any) {
        setCompError(e);
      }
    };

    doAsync();
  }, []);

  return (
    <ApexChartWrapper>
      <Paper
        sx={{
          margin: 'auto',
          padding: '10px',
          borderRadius: '10px',
          marginBottom: 5,
        }}
      >
        <Grid item xs={12} md={8}>
          <PieChart title={t('Pacientes por estado')} data={pieChartData} emptyError={t('Aún no hay pacientes')} />
        </Grid>
      </Paper>
      <Paper
        sx={{
          margin: 'auto',
          padding: '10px',
          borderRadius: '10px',
          marginBottom: 5,
        }}
      >
        <Grid item xs={12} md={12}>
          {/* Assuming WidgetOldestApplicants is placed below the Grid */}
          <WidgetOldestClinicPatients />
        </Grid>
      </Paper>
    </ApexChartWrapper>
  );
};

export default HomeTriage;
