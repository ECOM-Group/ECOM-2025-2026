import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./cart.component').then(m => m.CartComponent),
    data: { pageTitle: 'Cart' },
  },
  {
    path: ':orderId',
    loadComponent: () => import('./cart.component').then(m => m.CartComponent),
    data: { pageTitle: 'Cart' },
  },
];

export default routes;
