import { IPayementTunnel, NewPayementTunnel } from './payement-tunnel.model';

export const sampleWithRequiredData: IPayementTunnel = {
  id: 26591,
};

export const sampleWithPartialData: IPayementTunnel = {
  id: 20733,
  payementMethod: 'CREDIT_CARD',
};

export const sampleWithFullData: IPayementTunnel = {
  id: 20970,
  payementMethod: 'SPIRITUAL_ESSENCE',
};

export const sampleWithNewData: NewPayementTunnel = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
