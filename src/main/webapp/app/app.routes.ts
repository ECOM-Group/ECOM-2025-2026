import { Routes } from '@angular/router';

import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { errorRoute } from './layouts/error/error.route';
import { ProductSearchComponent } from './product-search/product-search.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'homePage',
  },
  {
    path: '',
    loadComponent: () => import('./layouts/navbar/navbar.component'),
    outlet: 'navbar',
  },
  {
    path: 'admin',
    data: {
      authorities: [Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.route'),
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.route'),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
    title: 'login.title',
  },
  {
    path: 'fiche_produit',
    loadChildren: () => import('./layouts/fiche-produit/fiche-route.routes'),
  },
  {
    path: 'homePage',
    loadChildren: () => import('./layouts/home-page/homePage.routes'),
  },
  {
    path: 'payment',
    loadComponent: () => import('./layouts/payment-tunel/payment-tunel.component'),
  },
  {
    path: '',
    loadChildren: () => import(`./entities/entity.routes`),
  },
  {
    path: 'search',
    component: ProductSearchComponent,
  },
  ...errorRoute,
];

export default routes;
