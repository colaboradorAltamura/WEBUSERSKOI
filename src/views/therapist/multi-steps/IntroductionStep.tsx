// ** MUI Imports
import Grid from '@mui/material/Grid';

import { useTranslation } from 'react-i18next';
import { InlineWidget } from 'react-calendly';
import { IWorker } from 'src/types/@autogenerated';

interface PropsType {
  handleNext: () => void;
  entityData: IWorker;
}

const IntroductionStep = ({ handleNext, entityData }: PropsType) => {
  // ** Hooks
  const { t } = useTranslation();

  // ** State

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {t('worker interiew info tab')}
        <InlineWidget url='https://calendly.com/d/3cf-qr8-gsj/presentacion-de-ats-cuidadores-estudiantes-y-otros' />
      </Grid>
    </Grid>
  );
};

export default IntroductionStep;
