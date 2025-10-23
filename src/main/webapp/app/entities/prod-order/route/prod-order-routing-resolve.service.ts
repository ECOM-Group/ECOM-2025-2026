import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProdOrder } from '../prod-order.model';
import { ProdOrderService } from '../service/prod-order.service';

const prodOrderResolve = (route: ActivatedRouteSnapshot): Observable<null | IProdOrder> => {
  const id = route.params.id;
  if (id) {
    return inject(ProdOrderService)
      .find(id)
      .pipe(
        mergeMap((prodOrder: HttpResponse<IProdOrder>) => {
          if (prodOrder.body) {
            return of(prodOrder.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default prodOrderResolve;
