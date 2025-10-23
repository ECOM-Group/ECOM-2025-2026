import { IAddress } from 'app/entities/address/address.model';
import { IUser } from 'app/entities/user/user.model';

export interface IProdOrder {
  id: number;
  valid?: boolean | null;
  promo?: number | null;
  address?: IAddress | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewProdOrder = Omit<IProdOrder, 'id'> & { id: null };
