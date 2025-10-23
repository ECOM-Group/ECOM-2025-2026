import { IIllustrator, NewIllustrator } from './illustrator.model';

export const sampleWithRequiredData: IIllustrator = {
  id: 1854,
};

export const sampleWithPartialData: IIllustrator = {
  id: 21482,
  lastName: 'Olivier',
};

export const sampleWithFullData: IIllustrator = {
  id: 14992,
  firstName: 'Sauveur',
  lastName: 'Paris',
};

export const sampleWithNewData: NewIllustrator = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
