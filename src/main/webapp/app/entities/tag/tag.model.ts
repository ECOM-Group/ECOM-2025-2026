import { IProduct } from 'app/entities/product/product.model';

export interface ITag {
  id: number;
  name?: string | null;
  ids?: IProduct[] | null;
}

export type NewTag = Omit<ITag, 'id'> & { id: null };
