import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrderLine } from '../order-line.model';
import { OrderLineService } from '../service/order-line.service';

const orderLineResolve = (route: ActivatedRouteSnapshot): Observable<null | IOrderLine> => {
  const id = route.params.id;
  if (id) {
    return inject(OrderLineService)
      .find(id)
      .pipe(
        mergeMap((orderLine: HttpResponse<IOrderLine>) => {
          if (orderLine.body) {
            return of(orderLine.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default orderLineResolve;
