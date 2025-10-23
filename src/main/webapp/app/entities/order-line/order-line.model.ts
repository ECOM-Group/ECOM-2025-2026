import { IProdOrder } from 'app/entities/prod-order/prod-order.model';
import { IProduct } from 'app/entities/product/product.model';

export interface IOrderLine {
  id: number;
  unitPrice?: number | null;
  total?: number | null;
  quantity?: number | null;
  prodOrder?: IProdOrder | null;
  product?: IProduct | null;
}

export type NewOrderLine = Omit<IOrderLine, 'id'> & { id: null };
