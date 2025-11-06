import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: ':orderId',
    loadComponent: () => import('./cart.component').then(m => m.CartComponent),
    data: { pageTitle: 'Cart' },
  },
];

export default routes;
