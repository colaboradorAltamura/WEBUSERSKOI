// estos son dinamicos pero se necesitan conocer para mostrar la home correspondiente a cada rol etc
export enum UserDefinedRols {
  SYS_COMP_EMPLOYEE = 'sys-comp-employee',

  UDR_PATIENT = 'udr-patient',
  UDR_PATIENT_RELATIVE = 'udr-patient-relative',

  UDR_STAFF_ADMISSION = 'udr-staff-admission',
  UDR_STAFF_INTERVIEWER = 'udr-staff-interviewer',
  UDR_STAFF_RECRUITER = 'udr-staff-recruiter',
  UDR_STAFF_CLINIC = 'udr-staff-clinic',
  UDR_STAFF_SALES = 'udr-staff-sales',
  UDR_STAFF_COMMERCIAL = 'udr-staff-commercial',
  UDR_STAFF_TRIAGE = 'udr-staff-triage', // Admision rismi
  UDR_STAFF_ADMINISTRATIVE = 'udr-staff-administrative',
  UDR_STAFF_COORDINATOR = 'udr-staff-coordinator',
  UDR_STAFF_SEEKER = 'udr-staff-seeker', //busqueda

  UDR_STAFF_FINANCIER = 'udr-staff-financier',

  UDR_WORKERS = 'udr-workers', // AT
}
