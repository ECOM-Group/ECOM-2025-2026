import { IUser } from 'app/entities/user/user.model';
import { IProduct } from 'app/entities/product/product.model';

export interface IReview {
  id: number;
  desc?: string | null;
  grade?: number | null;
  user?: Pick<IUser, 'id'> | null;
  product?: IProduct | null;
}

export type NewReview = Omit<IReview, 'id'> & { id: null };
