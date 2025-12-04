import { IProduct } from 'app/entities/product/product.model';

export interface ITag {
  id: number;
  name?: string | null;
  ids?: IProduct[] | null;
  productIds?: number[];
}

export type NewTag = Omit<ITag, 'id'> & { id: null };
