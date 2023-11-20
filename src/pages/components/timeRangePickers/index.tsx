import { Box, Grid, IconButton, TextField, Theme, Typography, capitalize, useTheme } from '@mui/material';
import { Dispatch, ForwardedRef, SetStateAction, forwardRef, useEffect, useState } from 'react';
import { IAvailabilityWeek } from 'src/types/workers';
import { useTranslation } from 'react-i18next';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import Icon from 'src/@core/components/icon';
import { setHours, setMinutes } from 'date-fns';

type TimeRangePickersProps = {
  workerAvailabilityWeek?: IAvailabilityWeek[];
  edit?: boolean;
  onEdit?: (_: boolean) => void;
  onAvailabilityWeekChange: Dispatch<SetStateAction<IAvailabilityWeek[]>>;
  loadDefaultWeek?: boolean;
};

type PickerProps = {
  label?: string;
  disabled?: boolean;
};

const generateInitialWeek = (loadDefaultWeek = false) => {
  const shouldAddDefaultTimeRange = (dayOfWeek: number) => loadDefaultWeek && dayOfWeek > 0 && dayOfWeek < 6;
  const timeRanges = [
    {
      from: new Date(new Date(0).setHours(9, 0, 0)),
      to: new Date(new Date(0).setHours(18, 0, 0)),
    },
  ];

  const initialAvailabilityWeek = [];
  for (let index = 0; index < 7; index++) {
    initialAvailabilityWeek.push({
      dayOfWeek: index,
      timeRanges: shouldAddDefaultTimeRange(index) ? [...timeRanges] : [],
    });
  }

  return initialAvailabilityWeek;
};

const CustomInput = forwardRef(({ ...props }: PickerProps, ref: ForwardedRef<HTMLElement>) => {
  return <TextField variant='standard' fullWidth inputRef={ref} sx={{ height: '100%' }} size={'small'} {...props} />;
});

const TimeRangePickers = ({
  workerAvailabilityWeek,
  edit = true,
  onEdit,
  onAvailabilityWeekChange,
  loadDefaultWeek = false,
}: TimeRangePickersProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { direction } = theme;
  const border = (theme: Theme) => `1px solid ${theme.palette.divider}`;
  const week = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const [availabilityWeek, setAvailabilityWeek] = useState<IAvailabilityWeek[]>(generateInitialWeek(loadDefaultWeek));
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end';

  useEffect(() => {
    const updatedAvailabilityWeek = availabilityWeek;
    workerAvailabilityWeek?.forEach((week: any) => {
      updatedAvailabilityWeek[week.dayOfWeek].timeRanges = week.timeRanges.map((timeRange: any) => {
        return {
          from: new Date(Date.parse(timeRange.from)),
          to: new Date(Date.parse(timeRange.to)),
          patientScheduleId: timeRange.patientScheduleId,
        };
      });
    });
    setAvailabilityWeek(updatedAvailabilityWeek);
    onAvailabilityWeekChange(updatedAvailabilityWeek);
  }, []);

  const handleAddTimeRange = (dayIndex: number) => {
    if (onEdit) onEdit(true);
    const nextAvailabilityWeek = [...availabilityWeek];
    const dayToModify = nextAvailabilityWeek[dayIndex];
    const timeRangeLength = dayToModify.timeRanges.length;
    let from = new Date(new Date(0).setHours(9, 0, 0));
    let to = new Date(new Date(0).setHours(18, 0, 0));

    if (timeRangeLength > 0) {
      const previousTo = dayToModify.timeRanges[timeRangeLength - 1].to;
      const previousToHours = previousTo.getHours();
      const previousToMinutes = previousTo.getMinutes();

      const deltaHours = previousToHours >= 22 && previousToMinutes >= 30 ? 0 : 1;

      from = new Date(new Date(0).setHours(previousToHours + deltaHours, previousToMinutes));
      to =
        from.getHours() < 23
          ? new Date(new Date(0).setHours(previousToHours + deltaHours + 1, previousToMinutes))
          : new Date(new Date(0).setHours(23, 59));
    }
    dayToModify.timeRanges.push({
      from,
      to,
    });

    setAvailabilityWeek(nextAvailabilityWeek);
    onAvailabilityWeekChange(nextAvailabilityWeek);
  };

  const handleRemoveTimeRange = (dayIndex: number, timeRangeIndex: number) => {
    const nextAvailabilityWeek = [...availabilityWeek];
    const dayToModify = nextAvailabilityWeek[dayIndex];
    dayToModify.timeRanges = dayToModify.timeRanges.filter((_, index) => index != timeRangeIndex);

    setAvailabilityWeek(nextAvailabilityWeek);
    onAvailabilityWeekChange(nextAvailabilityWeek);
  };

  const setTimeRange = (date: Date, dayIndex: number, timeRangeIndex: number, timeRangeField: 'from' | 'to') => {
    const nextAvailabilityWeek = [...availabilityWeek];
    const dayToModify = nextAvailabilityWeek[dayIndex];
    dayToModify.timeRanges[timeRangeIndex][timeRangeField] = date;
    setAvailabilityWeek(nextAvailabilityWeek);
    onAvailabilityWeekChange(nextAvailabilityWeek);
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        {availabilityWeek.map((availabilityDay, dayIndex) => {
          const latestTo = availabilityDay.timeRanges[availabilityDay.timeRanges.length - 1]?.to;
          const latestToHours = latestTo?.getHours();
          const latestToMinutes = latestTo?.getMinutes();

          return (
            <>
              <Box
                key={dayIndex}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: border,
                  borderTop: 'none',
                  background: theme.palette.background.default,
                  px: 2,
                  py: 0.5,
                  '&:first-of-type': { borderTop: border },
                }}
              >
                <Typography variant='h6'>{capitalize(t(week[availabilityDay.dayOfWeek]))}</Typography>
                <IconButton
                  disabled={!edit || (latestToHours == 23 && latestToMinutes == 59)}
                  size='small'
                  onClick={() => {
                    handleAddTimeRange(dayIndex);
                  }}
                >
                  <Icon icon='ic:baseline-plus' />
                </IconButton>
              </Box>
              {availabilityDay.timeRanges.map((timeRange, timeRangeIndex) => {
                const minFrom =
                  timeRangeIndex == 0
                    ? new Date(new Date(0).setHours(0, 0, 0, 0))
                    : availabilityDay.timeRanges[timeRangeIndex - 1].to;

                const maxTo =
                  timeRangeIndex == availabilityDay.timeRanges.length - 1
                    ? new Date(new Date(0).setHours(23, 59, 0, 0))
                    : availabilityDay.timeRanges[timeRangeIndex + 1].from;

                return (
                  <Box
                    key={timeRangeIndex}
                    sx={{
                      display: 'flex',
                      direction: 'row',
                      height: '37px',
                      border: border,
                      borderTop: 'none',
                    }}
                    alignItems={'center'}
                  >
                    <Box
                      key={timeRangeIndex}
                      gap={3}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        pl: 2,
                        py: 0.5,
                        flex: '1 1 auto',
                        height: '100%',
                      }}
                    >
                      <>
                        <Box sx={{ width: '80px' }}>
                          <DatePicker
                            disabled={!edit}
                            showTimeSelect
                            selected={timeRange.from}
                            minTime={minFrom}
                            maxTime={timeRange.to}
                            timeIntervals={30}
                            showTimeSelectOnly
                            dateFormat='h:mm aa'
                            id='time-only-picker'
                            popperPlacement={popperPlacement}
                            onChange={(date: Date) => setTimeRange(date, dayIndex, timeRangeIndex, 'from')}
                            customInput={<CustomInput />}
                          />
                        </Box>
                        <Typography variant='body2'>-</Typography>
                        <Box sx={{ width: '80px' }}>
                          <DatePicker
                            disabled={!edit}
                            showTimeSelect
                            timeIntervals={30}
                            selected={timeRange.to}
                            minTime={timeRange.from}
                            maxTime={maxTo}
                            showTimeSelectOnly
                            dateFormat='h:mm aa'
                            id='time-only-picker'
                            popperPlacement={popperPlacement}
                            onChange={(date: Date) => setTimeRange(date, dayIndex, timeRangeIndex, 'to')}
                            injectTimes={[setHours(setMinutes(new Date(), 59), 23)]}
                            customInput={<CustomInput />}
                          />
                        </Box>
                      </>
                    </Box>
                    <Box sx={{ px: 2 }}>
                      <IconButton
                        disabled={!edit}
                        size='small'
                        onClick={() => {
                          handleRemoveTimeRange(dayIndex, timeRangeIndex);
                        }}
                      >
                        <Icon icon='ic:baseline-minus' />
                      </IconButton>
                    </Box>
                  </Box>
                );
              })}
              {availabilityDay.timeRanges.length == 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    height: '37px',
                    alignItems: 'center',
                    border: border,
                    borderTop: 'none',
                    px: 2,
                    py: 0.5,
                    '&:hover': {
                      cursor: 'pointer',
                      backgroundColor: theme.palette.customColors.tableHeaderBg,
                    },
                  }}
                  onClick={() => {
                    handleAddTimeRange(dayIndex);
                  }}
                >
                  <Typography variant='body1' sx={{ color: theme.palette.primary.main }}>
                    {capitalize(t('add new time range'))}
                  </Typography>
                </Box>
              )}
            </>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default TimeRangePickers;
