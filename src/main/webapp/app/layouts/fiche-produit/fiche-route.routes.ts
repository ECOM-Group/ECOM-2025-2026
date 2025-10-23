import { Routes } from '@angular/router';

const routes: Routes = [{ path: ':id', loadComponent: () => import('./fiche-produit.component') }];

export default routes;
