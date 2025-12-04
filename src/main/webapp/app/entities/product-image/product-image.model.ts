import { IProduct } from 'app/entities/product/product.model';

export interface IProductImage {
  id: number;
  url?: string | null;
  product?: IProduct | null;
}

export type NewProductImage = Omit<IProductImage, 'id'> & { id: null };
