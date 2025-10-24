import { Route } from '@angular/router';
import { ProdOrderComponent } from './prod-order.component';

export const PROD_ORDER_ROUTE: Route = {
  path: 'prod-order/:orderId', // URL: /prod-order/1
  component: ProdOrderComponent,
  data: { pageTitle: 'Product Order' },
};
