import { IAddress, NewAddress } from './address.model';

export const sampleWithRequiredData: IAddress = {
  id: 2568,
};

export const sampleWithPartialData: IAddress = {
  id: 2411,
  country: 'São Tomé-et-Principe',
};

export const sampleWithFullData: IAddress = {
  id: 16440,
  country: 'République centrafricaine',
  city: 'Clichy',
  street: "Impasse de l'Odéon",
  zipcode: 6485,
};

export const sampleWithNewData: NewAddress = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
