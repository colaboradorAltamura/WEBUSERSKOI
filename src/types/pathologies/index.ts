/* eslint-disable no-unused-vars */

export enum PathologyTypes {
  AUTISMO = 'autismo',
  DOWN = 'down',
  OTHER = 'other',
}

export type PathologyType = {
  id: string;

  name: PathologyTypes;
  description?: string;
};
