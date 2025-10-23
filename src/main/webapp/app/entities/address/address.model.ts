import { IUser } from 'app/entities/user/user.model';

export interface IAddress {
  id: number;
  country?: string | null;
  city?: string | null;
  street?: string | null;
  zipcode?: number | null;
  ids?: Pick<IUser, 'id'>[] | null;
}

export type NewAddress = Omit<IAddress, 'id'> & { id: null };
