import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import OrderLineResolve from './route/order-line-routing-resolve.service';

const orderLineRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/order-line.component').then(m => m.OrderLineComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/order-line-detail.component').then(m => m.OrderLineDetailComponent),
    resolve: {
      orderLine: OrderLineResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/order-line-update.component').then(m => m.OrderLineUpdateComponent),
    resolve: {
      orderLine: OrderLineResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/order-line-update.component').then(m => m.OrderLineUpdateComponent),
    resolve: {
      orderLine: OrderLineResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default orderLineRoute;
