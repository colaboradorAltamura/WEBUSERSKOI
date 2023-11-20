// ** MUI Imports
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

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
import { IApplicant, ICompany } from 'src/types/@autogenerated';
import { IForm } from 'src/types/dynamics';
import { IEntitySchema, IEntitySchemaField } from 'src/types/entities';
import DynamicFormSidebar from '../components/dynamics/DynamicFormSidebar';
import { schemaToForm, updateEntityDataBySchema } from '../components/dynamics/helpers';
import { UserDefinedRols } from 'src/types/userDefinedRols';
import { AppRols } from 'src/types/appRols';

interface PropsType {
  docId: string;
}

const CheckingAccountTab = ({ docId }: PropsType) => {
  // ** Hooks
  const dynamics = useDynamics();
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={capitalize(t('checking account'))} />
          <CardContent>
            <Typography>Para completar</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CheckingAccountTab;