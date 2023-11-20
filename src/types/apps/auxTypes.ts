// ** Types
import { ThemeColor } from 'src/@core/layouts/types';

export type TreatmentTasksDataType = {
  id: number;
  img: string;
  fromHours: string;
  toHours: string;

  dayOfWeek: string;
  projectTitle: string;
  progressValue: number;
  progressColor: ThemeColor;
};

export type PatientRelativeDataType = {
  id: number;
  img: string;
  name: string;
  type: string;
};

export type ProjectListDataType = {
  id: number;
  img: string;
  hours: string;
  totalTask: string;
  projectType: string;
  projectTitle: string;
  progressValue: number;
  progressColor: ThemeColor;
};
