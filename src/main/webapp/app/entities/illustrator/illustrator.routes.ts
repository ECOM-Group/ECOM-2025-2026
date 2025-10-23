import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import IllustratorResolve from './route/illustrator-routing-resolve.service';

const illustratorRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/illustrator.component').then(m => m.IllustratorComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/illustrator-detail.component').then(m => m.IllustratorDetailComponent),
    resolve: {
      illustrator: IllustratorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/illustrator-update.component').then(m => m.IllustratorUpdateComponent),
    resolve: {
      illustrator: IllustratorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/illustrator-update.component').then(m => m.IllustratorUpdateComponent),
    resolve: {
      illustrator: IllustratorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default illustratorRoute;
