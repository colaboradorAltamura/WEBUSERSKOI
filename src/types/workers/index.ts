interface ITimeRange {
  from: Date;
  to: Date;
  patientScheduleId?: string;
}
export interface IAvailabilityWeek {
  relatedId?: string;
  dayOfWeek: number;
  timeRanges: ITimeRange[];
}
