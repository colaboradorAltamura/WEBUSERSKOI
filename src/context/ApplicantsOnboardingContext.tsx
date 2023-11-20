// ** React Imports
import { ReactNode, createContext, useState } from 'react';

import { ApplicantsStateTypes, IApplicant } from 'src/types/applicants';

interface IApplicantsOnboardingContextData {
  onboardingData: IApplicant;
  isLoading: boolean;
  saveOnboardingData: (data: IApplicant) => void;
}

// ** Defaults
const defaultProvider: IApplicantsOnboardingContextData = {
  onboardingData: {
    applicantStateType: ApplicantsStateTypes.PENDING_INTERVIEW,

    applicantFullname: '',
    applicantGender: '',
    applicantIdentificationNumber: '',
    applicantIdentificationType: '',
    applicantPhoneNumber: '',
    applicantEmail: '',
    applicantBirthdate: new Date(),

    relativeFullname: '',
    relativeIdentificationNumber: '',
    relativeIdentificationType: '',
    relationWithApplicant: '',
    relativePhoneNumber: '',
    relativeEmail: '',

    //step 2
    diagnostic: '',
    specialNeeds: '',
    professionalStaffFullname: '',
    professionalStaffPhoneNumber: '',

    //step 3
    applicantAddress: [],
    schoolAccompaniment: false,
    schoolContact: '',
    schoolName: '',
    schoolDocs: '',
    schoolDocsfromEnlite: '',

    //step 4
    paymentMethod: '',
    insurance: '',
    paymentDocsEnlite: '',
    paymentMode: '',
    insuranceNumber: '',
    amparoIndicator: false,
    ivaCondition: '',
    cudCertificate: false,
    comments: '',

    //details - diagnostic
    urgencyLevel: '',
    wasAssistedBefore: false,
    aggressiveBehavior: false,
    cashManagement: false,
    suicidalThoughts: false,
    patientStory: '',

    //Details - Service
    serviceDispositive: '',
    therapistType: '',
    therapistAmount: 0,
    therapistProfile: '',
    therapistGender: '',
    therapistSex: '',
    therapistDays: '',
    therapistSchedule: '',
    therapistWeeklyHours: '',
    therapistMonthlyHours: '',
  },
  isLoading: true,
  saveOnboardingData: () => null,
};

const ApplicantsOnboardingContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const ApplicantsOnboardingProvider = ({ children }: Props) => {
  // ** Hooks

  // ** States
  const [onboardingData, setOnboardingData] = useState<IApplicant>(defaultProvider.onboardingData);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const saveOnboardingData = (data: IApplicant) => {
    setOnboardingData(data);
  };

  const values = {
    onboardingData,
    saveOnboardingData,
    isLoading,
  };

  return <ApplicantsOnboardingContext.Provider value={values}>{children}</ApplicantsOnboardingContext.Provider>;
};

export { ApplicantsOnboardingContext, ApplicantsOnboardingProvider };
