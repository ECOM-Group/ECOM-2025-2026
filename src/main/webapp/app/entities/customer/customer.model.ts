export interface ICustomer {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  userId?: number;
}

export type NewCustomer = Omit<ICustomer, 'id'> & { id: null };
