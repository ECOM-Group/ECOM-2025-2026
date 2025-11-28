export interface ICustomer {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  userId?: number | null; // TODO : not nullable : comme id
}

export type NewCustomer = Omit<ICustomer, 'id'> & { id: null };
