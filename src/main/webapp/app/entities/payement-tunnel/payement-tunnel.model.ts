import { PayementMode } from 'app/entities/enumerations/payement-mode.model';

export interface IPayementTunnel {
  id: number;
  payementMethod?: keyof typeof PayementMode | null;
}

export type NewPayementTunnel = Omit<IPayementTunnel, 'id'> & { id: null };
