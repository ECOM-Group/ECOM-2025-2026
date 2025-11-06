import { inject, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { StateStorageService } from './state-storage.service';

export const UserRouteAccessService: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const stateStorageService = inject(StateStorageService);

  // ✅ Définis ici les routes publiques (accessibles sans être connecté)
  const publicRoutes = ['/homePage', '/login', '/register', '/'];

  // Si la route courante est publique, on laisse passer directement
  console.log("Vérification de l'accès à la route aaaaaaaaaaaaaaaaaaashaushuiahisuahiushaiushauishauishauishauish:", state.url);
  if (publicRoutes.includes(state.url)) {
    return true;
  }

  return accountService.identity().pipe(
    map(account => {
      if (account) {
        const { authorities } = next.data;

        if (!authorities || authorities.length === 0 || accountService.hasAnyAuthority(authorities)) {
          return true;
        }

        if (isDevMode()) {
          console.error('User does not have any of the required authorities:', authorities);
        }
        router.navigate(['accessdenied']);
        return false;
      }

      // utilisateur non connecté → redirection login
      stateStorageService.storeUrl(state.url);
      router.navigate(['/login']);
      return false;
    }),
  );
};
