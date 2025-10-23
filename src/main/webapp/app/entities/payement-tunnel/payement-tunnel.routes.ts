import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import PayementTunnelResolve from './route/payement-tunnel-routing-resolve.service';

const payementTunnelRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/payement-tunnel.component').then(m => m.PayementTunnelComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/payement-tunnel-detail.component').then(m => m.PayementTunnelDetailComponent),
    resolve: {
      payementTunnel: PayementTunnelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/payement-tunnel-update.component').then(m => m.PayementTunnelUpdateComponent),
    resolve: {
      payementTunnel: PayementTunnelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/payement-tunnel-update.component').then(m => m.PayementTunnelUpdateComponent),
    resolve: {
      payementTunnel: PayementTunnelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default payementTunnelRoute;
