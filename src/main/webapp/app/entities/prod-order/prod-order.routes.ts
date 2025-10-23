import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ProdOrderResolve from './route/prod-order-routing-resolve.service';

const prodOrderRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/prod-order.component').then(m => m.ProdOrderComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/prod-order-detail.component').then(m => m.ProdOrderDetailComponent),
    resolve: {
      prodOrder: ProdOrderResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/prod-order-update.component').then(m => m.ProdOrderUpdateComponent),
    resolve: {
      prodOrder: ProdOrderResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/prod-order-update.component').then(m => m.ProdOrderUpdateComponent),
    resolve: {
      prodOrder: ProdOrderResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default prodOrderRoute;
