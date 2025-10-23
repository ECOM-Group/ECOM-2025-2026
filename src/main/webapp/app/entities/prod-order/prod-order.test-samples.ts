import { IProdOrder, NewProdOrder } from './prod-order.model';

export const sampleWithRequiredData: IProdOrder = {
  id: 5410,
};

export const sampleWithPartialData: IProdOrder = {
  id: 18038,
  promo: 24577.82,
};

export const sampleWithFullData: IProdOrder = {
  id: 11370,
  valid: true,
  promo: 32558,
};

export const sampleWithNewData: NewProdOrder = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
