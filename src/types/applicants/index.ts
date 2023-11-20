export enum ApplicantsStateTypes {
  QUOTATION_REJECTED = 'quotation-rejected',
  QUOTATION_APPROVED = 'quotation-approved',
  INTERVIEW_SCHEDULED = 'interview-scheduled',
  CONVERTED = 'converted',
  PENDING_QUOTATION = 'pending-quotation',
  PENDING_INTERVIEW = 'pending-interview',
  REJECTED = 'rejected',
}

export interface IApplicant {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  applicantStateType?: ApplicantsStateTypes;
  state?: number;

  //*********  step 1
  applicantFullname: string;
  applicantGender: string;
  applicantIdentificationNumber: string;
  applicantIdentificationType: string;
  applicantPhoneNumber: string;
  applicantEmail: string;
  applicantBirthdate: Date;

  relativeFullname: string;
  relativeIdentificationNumber: string;
  relativeIdentificationType: string;
  relationWithApplicant: string;
  relativePhoneNumber: string;
  relativeEmail: string;

  //step 2
  diagnostic: string;
  specialNeeds: string;
  professionalStaffFullname: string;
  professionalStaffPhoneNumber: string;

  //step 3
  applicantAddress: any;
  schoolAccompaniment: boolean;
  schoolContact: string;
  schoolName: string;
  schoolDocs: string;
  schoolDocsfromEnlite: string;

  //step 4
  paymentMethod: string;
  insurance: string;
  paymentDocsEnlite: string;
  paymentMode: string;
  insuranceNumber: string;
  amparoIndicator: boolean;
  ivaCondition: string;
  cudCertificate: boolean;
  comments: string;

  //Details - diagnostic
  urgencyLevel: string;
  wasAssistedBefore: boolean;
  aggressiveBehavior: boolean;
  cashManagement: boolean;
  suicidalThoughts: boolean;
  patientStory: string;

  //Details - Service
  serviceDispositive: string;
  therapistType: string;
  therapistAmount: number;
  therapistProfile: string;
  therapistGender: string;
  therapistSex: string;
  therapistDays: string;
  therapistSchedule: string;
  therapistWeeklyHours: string;
  therapistMonthlyHours: string;
}
