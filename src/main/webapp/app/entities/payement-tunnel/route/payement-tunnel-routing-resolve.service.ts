import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPayementTunnel } from '../payement-tunnel.model';
import { PayementTunnelService } from '../service/payement-tunnel.service';

const payementTunnelResolve = (route: ActivatedRouteSnapshot): Observable<null | IPayementTunnel> => {
  const id = route.params.id;
  if (id) {
    return inject(PayementTunnelService)
      .find(id)
      .pipe(
        mergeMap((payementTunnel: HttpResponse<IPayementTunnel>) => {
          if (payementTunnel.body) {
            return of(payementTunnel.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default payementTunnelResolve;
