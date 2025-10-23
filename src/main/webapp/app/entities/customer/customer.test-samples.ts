import { ICustomer, NewCustomer } from './customer.model';

export const sampleWithRequiredData: ICustomer = {
  id: 3366,
};

export const sampleWithPartialData: ICustomer = {
  id: 8561,
};

export const sampleWithFullData: ICustomer = {
  id: 4149,
  firstName: 'Lorraine',
  lastName: 'Leclerc',
  email: 'Ariste_Morel15@hotmail.fr',
  password: 'aussitôt que',
};

export const sampleWithNewData: NewCustomer = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
