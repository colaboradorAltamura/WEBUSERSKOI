// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// ** Types

// ** Custom Components Imports
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import Loader from 'src/@core/components/loader';
import CustomChip from 'src/@core/components/mui/chip';
import OptionsMenu from 'src/@core/components/option-menu';
import { getSourceEntityData, handleError, parseDateToShortString } from 'src/@core/coreHelper';
import { formatDate } from 'src/@core/utils/format';
import { dynamicGet } from 'src/services/entitiesDynamicServices';
import {
  ApplicantsStateTypes,
  IOpenPosition,
  QuotationStatusTypes,
  IApplicantQuotation,
} from 'src/types/@autogenerated';
import { IconButton, Tooltip, capitalize } from '@mui/material';
import Icon from 'src/@core/components/icon';
import { useRouter } from 'next/router';
import { nameof } from 'src/@core/coreHelper';

import { ThemeColor } from 'src/@core/layouts/types';
// import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

interface IOpenPositionsListResponse {
  total: number;
  hasMore: boolean;
  items: IOpenPosition[];
}

const WidgetOldestOpenPositions = () => {
  const router = useRouter();
  const [data, setData] = useState<any[] | null>(null);
  const [compError, setCompError] = useState<any[] | null>(null);
  const [closedApplicants, setQuotationsPendingApproval] = useState<any[]>([]);
  const [openApplicants, setPendingQuotationApplicants] = useState<any[]>([]);

  const { t } = useTranslation();

  useEffect(() => {
    const doAsync = async () => {
      // Hablar con miche
      try {
        const openPositionsResult: IOpenPositionsListResponse = await dynamicGet({
          params: '/cms/openPositions',
          filters: [
            {
              key: 'statusType',
              value: 'active',
              operator: '$in',
            },
          ],
        });
        const renderList: any[] = [];
        openPositionsResult.items.forEach((position: IOpenPosition) => {
          const openPositionRow: IOpenPosition = { ...position };
          renderList.push(openPositionRow);
        });

        const orderedList = renderList.sort(
          (a: IOpenPosition, b: IOpenPosition) =>
            new Date(a.updatedAt as any).getTime() - new Date(b.updatedAt as any).getTime()
        );

        const finalList = orderedList.splice(0, 5);
        console.log(finalList);
        setData(finalList);
      } catch (e: any) {
        setCompError(e);
      }
    };

    doAsync();
  }, []);

  return (
    <Card>
      <CardHeader
        title={capitalize(t('oldest open positions'))}
        action={<Button onClick={() => router.push(`/vacants`)}>{t('View all')}</Button>}
      />
      {!data && <Loader sx={{ marginBottom: 10 }} />}
      {compError && (
        <Typography noWrap variant='h5'>
          Ups! Error de conexión
        </Typography>
      )}
      {data && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{ '& .MuiTableCell-root': { py: 2, borderTop: (theme) => `1px solid ${theme.palette.divider}` } }}
              >
                <TableCell></TableCell>

                <TableCell>{t('name')}</TableCell>
                <TableCell>{t('location')}</TableCell>
                <TableCell>{t('creation date')}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.length === 0 && (
                <Typography noWrap variant='h5'>
                  No hay vacantes
                </Typography>
              )}
              {data.length > 0 &&
                data.map((row: IOpenPosition, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        '&:last-child .MuiTableCell-root': { pb: (theme) => `${theme.spacing(6)} !important` },
                        '& .MuiTableCell-root': { border: 0, py: (theme) => `${theme.spacing(2.25)} !important` },
                        '&:first-of-type .MuiTableCell-root': { pt: (theme) => `${theme.spacing(4.5)} !important` },
                      }}
                    >
                      <TableCell>
                        <Tooltip title='Ver contenido'>
                          <IconButton
                            size='small'
                            sx={{ color: 'text.secondary' }}
                            onClick={() => {
                              router.push(`/vacants/${row.id}`);
                            }}
                          >
                            <Icon icon='tabler:eye' />
                          </IconButton>
                        </Tooltip>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', '& img': { mr: 4 } }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Typography
                              noWrap
                              sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}
                            >
                              {row.name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                            {row.jobZone ? row.jobZone : '-'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                            {parseDateToShortString(row.createdAt as any)}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Card>
  );
};

export default WidgetOldestOpenPositions;
