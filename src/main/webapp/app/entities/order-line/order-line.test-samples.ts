import { IOrderLine, NewOrderLine } from './order-line.model';

export const sampleWithRequiredData: IOrderLine = {
  id: 7269,
};

export const sampleWithPartialData: IOrderLine = {
  id: 25518,
  total: 19404,
  quantity: 28931,
};

export const sampleWithFullData: IOrderLine = {
  id: 27230,
  unitPrice: 28142,
  total: 27524,
  quantity: 30106,
};

export const sampleWithNewData: NewOrderLine = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
