import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIllustrator } from '../illustrator.model';
import { IllustratorService } from '../service/illustrator.service';

const illustratorResolve = (route: ActivatedRouteSnapshot): Observable<null | IIllustrator> => {
  const id = route.params.id;
  if (id) {
    return inject(IllustratorService)
      .find(id)
      .pipe(
        mergeMap((illustrator: HttpResponse<IIllustrator>) => {
          if (illustrator.body) {
            return of(illustrator.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default illustratorResolve;
