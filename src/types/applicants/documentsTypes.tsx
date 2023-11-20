export enum documentsTypes {
  ANTECEDENTES_PENALES = 'Antecedentes penales',
  DNI = 'DNI',
  SEGURO_ACCIDENTES = 'Seguro de accidentes',
  SEGURO_RESPOSABILIDAD_CIVIL = 'Seguro de resposabilidad de mala praxis',
  APTO_FISICO = 'Apto fisico',
  TITULO_HABITANTE = 'Titulo de habitante',
  CONSTANCIA_AFIP = 'Constancia de inscripcion AFIP',
  OTHER = 'Otro',
}

export type documentType = {
  id: string;
  name: documentsTypes;
  description?: string;
};

export const DocumentsData: documentType[] = [
  {
    id: documentsTypes.ANTECEDENTES_PENALES,
    name: documentsTypes.ANTECEDENTES_PENALES,
    description: '',
  },
  {
    id: documentsTypes.DNI,
    name: documentsTypes.DNI,
    description: '',
  },
  {
    id: documentsTypes.SEGURO_ACCIDENTES,
    name: documentsTypes.SEGURO_ACCIDENTES,
    description: '',
  },
  {
    id: documentsTypes.SEGURO_RESPOSABILIDAD_CIVIL,
    name: documentsTypes.SEGURO_RESPOSABILIDAD_CIVIL,
    description: '',
  },
  {
    id: documentsTypes.APTO_FISICO,
    name: documentsTypes.APTO_FISICO,
    description: '',
  },
  {
    id: documentsTypes.TITULO_HABITANTE,
    name: documentsTypes.TITULO_HABITANTE,
    description: '',
  },
  {
    id: documentsTypes.CONSTANCIA_AFIP,
    name: documentsTypes.CONSTANCIA_AFIP,
    description: '',
  },
  {
    id: documentsTypes.OTHER,
    name: documentsTypes.OTHER,
    description: 'Unknown',
  },
];
