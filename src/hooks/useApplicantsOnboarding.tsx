import { useContext } from 'react';
import { ApplicantsOnboardingContext } from 'src/context/ApplicantsOnboardingContext';

export const useApplicantsOnboarding = () => useContext(ApplicantsOnboardingContext);
