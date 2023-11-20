// ** MUI Import
import Grid from '@mui/material/Grid';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// ** Icon Imports
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Loader from 'src/@core/components/loader';
import {
  CMSCollections,
  IOpenPosition,
  IUsersAddress,
  IWorker,
  OpenPositionStatusTypes,
} from 'src/types/@autogenerated';
import { Button, capitalize, CardContent, Theme, Typography, useMediaQuery } from '@mui/material';
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider';
import BannersWorker from 'src/@core/components/custom-banners/workers';
// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar';
import OpenPositionCards from 'src/views/openPositions/cards';
import { dynamicGet } from 'src/services/entitiesDynamicServices';
import { getDistanceFromLatLonInKm, handleError, nameof } from 'src/@core/coreHelper';
import { useRouter } from 'next/router';

const SCHEMA_NAME = CMSCollections.WORKERS;

interface PropsType {
  workerData: IWorker;
  addressWorker: IUsersAddress | null;
}
const HomeActiveTherapist = ({ addressWorker, workerData }: PropsType) => {
  //HOOKS
  const { t } = useTranslation();
  const router = useRouter();

  // **STATES
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [entitiesData, setEntitiesData] = useState<IOpenPosition[]>([]);
  const [entityWorkerData, setEntityWorkerData] = useState<IWorker>(workerData);
  const [addressWorkerPrimary, seAaddressWorkerPrimary] = useState<IWorker>();
  const [toggleData, setToggleData] = useState<boolean>(false);

  // gets open positions by worker distance and patient
  useEffect(() => {
    const doAsync = async () => {
      try {
        setIsLoading(true);

        const data: any = await dynamicGet({
          params: '/cms/' + CMSCollections.OPEN_POSITIONS,
          filters: [
            {
              key: nameof<IOpenPosition>('statusType'),
              value: OpenPositionStatusTypes.ACTIVE,
              operator: '$in',
            },
          ],
        });
        if (data && data.items) {
          const openPositionFilteredByDistance = setFilterOpenPositions(data.items);

          setEntitiesData(openPositionFilteredByDistance);
        }

        setIsLoading(false);
      } catch (e: any) {
        setIsLoading(false);
        handleError(e);
      }
    };

    doAsync();
  }, [toggleData]);

  const toggle = async () => {
    setToggleData(true);
  };

  const setFilterOpenPositions = (positions: IOpenPosition[]) => {
    return positions.filter(function (vacant: IOpenPosition) {
      if (!addressWorker || !addressWorker.address || !addressWorker.address.lng || !addressWorker.address.lat) return;

      const ditanceFromWorker = getDistanceFromLatLonInKm(
        vacant.jobAddress?.lng,
        vacant.jobAddress?.lat,
        addressWorker.address.lng,
        addressWorker.address.lat
      );

      const TOLERANCE_WORKER_DISTANCE_FROM_PATIENT_IN_KM = entityWorkerData.maxDistance ?? 5;

      return ditanceFromWorker <= TOLERANCE_WORKER_DISTANCE_FROM_PATIENT_IN_KM && vacant.patient !== undefined;
    });
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <KeenSliderWrapper sx={{ marginBottom: '10px' }}>
        <Grid item xs={12}>
          <BannersWorker />
        </Grid>
      </KeenSliderWrapper>

      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={3} sx={{ pb: 4 }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={12}>
              <Card>
                <CardContent
                  sx={{
                    display: 'flex',
                    textAlign: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    p: (theme) => `${theme.spacing(9.75, 5, 9.25)} !important`,
                  }}
                >
                  <CustomAvatar skin='light' sx={{ width: 50, height: 50, mb: 2.25 }}>
                    <Typography variant='h4' sx={{}}>
                      56
                    </Typography>
                  </CustomAvatar>
                  <Typography variant='h4' sx={{ mb: 2.75 }}>
                    {capitalize(t('worked hours'))}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={12}>
              <Card color='primary'>
                <CardContent
                  sx={{
                    display: 'flex',
                    textAlign: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    p: (theme) => `${theme.spacing(9.75, 5, 9.25)} !important`,
                  }}
                >
                  <CustomAvatar skin='light' sx={{ width: 50, height: 50, mb: 2.25 }}>
                    <Typography variant='h4' sx={{}}>
                      4
                    </Typography>
                  </CustomAvatar>
                  <Typography variant='h4' sx={{ mb: 2.75 }}>
                    {capitalize(t('reports due'))}
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
                  title={capitalize(t('open positions'))}
                  action={
                    <Button
                      variant='contained'
                      onClick={() => {
                        router.push('/workers/openPositions');
                      }}
                      sx={{ mr: 4, mb: [2, 0] }}
                    >
                      {capitalize(t('see all'))}
                    </Button>
                  }
                />
                <CardContent>
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <OpenPositionCards
                      openPositions={entitiesData}
                      showItems={3}
                      workerId={workerData.id}
                      toggle={toggle}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default HomeActiveTherapist;