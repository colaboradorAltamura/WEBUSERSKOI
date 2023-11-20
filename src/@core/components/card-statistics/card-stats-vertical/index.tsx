// ** MUI Imports
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import { capitalize } from '@mui/material';
// ** Type Import
import { CardStatsVerticalProps } from 'src/@core/components/card-statistics/types';

// ** Custom Component Import
import Icon from 'src/@core/components/icon';
import CustomChip from 'src/@core/components/mui/chip';
import CustomAvatar from 'src/@core/components/mui/avatar';

import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';

const CardStatsVertical = (props: CardStatsVerticalProps) => {
  // ** Props
  const {
    sx,
    stats,
    title,
    subtitle,
    avatarIcon,
    avatarSize = 34,
    iconSize = '1.75rem',
    chipColor = 'primary',
    avatarColor = 'primary',
    fontSize = 15,
    numberSize = 30,
    actionRoute,
    actionTitle,
  } = props;

  const RenderChip = chipColor === 'default' ? Chip : CustomChip;
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        ...sx,
        backgroundColor: (theme) => hexToRGBA(theme.palette.primary.main, 0.05),
        transform: 'translateY(0)',
        transition: 'background-color 0.3s ease, transform 0.3s ease',
        '&:hover': {
          backgroundColor: (theme) => hexToRGBA(theme.palette.primary.main, 0.2),
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 225 }}>
        <CustomAvatar
          skin='light'
          variant='rounded'
          sx={{
            mb: 3.5,
            width: avatarSize,
            height: avatarSize,
            color: 'primary.main',
          }}
        >
          <Icon icon={avatarIcon} fontSize={iconSize} />
        </CustomAvatar>
        <Typography variant='h5' sx={{ mb: 1, fontSize: fontSize, textTransform: 'capitalize', textAlign: 'center' }}>
          {title}
        </Typography>
        <Typography variant='body2' sx={{ mb: 1, color: 'text.disabled' }}>
          {subtitle}
        </Typography>
        <Typography sx={{ mb: 8, color: 'text.disabled', fontSize: numberSize, margin: 0 }}>{stats}</Typography>
        {actionRoute && actionTitle && (
          <Button onClick={() => router.push(actionRoute)} color='primary'>
            {capitalize(t(actionTitle))}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CardStatsVertical;
