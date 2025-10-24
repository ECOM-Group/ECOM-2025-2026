import { Route } from '@angular/router';
import { CartComponent } from './cart.component';

export const CART_ROUTE: Route = {
  path: 'cart/:orderId', // URL: /cart/1
  component: CartComponent,
  data: { pageTitle: 'Cart' },
};
