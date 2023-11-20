export enum enliteDocumentsTypes {
  PLAN_TRABAJO = 'Plan de trabajo',
  PRESUPUESTO = 'Presupuesto',
  ACTA_ACUERDO = 'Acta de acuerdo',
  HABILITACION = 'Habilitacion',
  DOCUMENTACION_SUPERVISOR = 'Documentacion del supervisor (Matricula y DNI)',
  CARTA_PRESENTACION = 'Carta de presentacion',
  CONSTANCIA_AFIP = 'Constancia de inscripcion AFIP',
  OTHER = 'other',
}

export type enliteDocumentsType = {
  id: string;
  name: enliteDocumentsTypes;
  description?: string;
};

export const DocumentsData: enliteDocumentsType[] = [
  {
    id: enliteDocumentsTypes.PLAN_TRABAJO,
    name: enliteDocumentsTypes.PLAN_TRABAJO,
    description: '',
  },
  {
    id: enliteDocumentsTypes.PRESUPUESTO,
    name: enliteDocumentsTypes.PRESUPUESTO,
    description: '',
  },
  {
    id: enliteDocumentsTypes.ACTA_ACUERDO,
    name: enliteDocumentsTypes.ACTA_ACUERDO,
    description: '',
  },
  {
    id: enliteDocumentsTypes.HABILITACION,
    name: enliteDocumentsTypes.HABILITACION,
    description: '',
  },
  {
    id: enliteDocumentsTypes.DOCUMENTACION_SUPERVISOR,
    name: enliteDocumentsTypes.DOCUMENTACION_SUPERVISOR,
    description: '',
  },
  {
    id: enliteDocumentsTypes.CARTA_PRESENTACION,
    name: enliteDocumentsTypes.CARTA_PRESENTACION,
    description: '',
  },
  {
    id: enliteDocumentsTypes.CONSTANCIA_AFIP,
    name: enliteDocumentsTypes.CONSTANCIA_AFIP,
    description: '',
  },
  {
    id: enliteDocumentsTypes.OTHER,
    name: enliteDocumentsTypes.OTHER,
    description: 'Unknown',
  },
];
