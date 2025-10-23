import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIllustrator, NewIllustrator } from '../illustrator.model';

export type PartialUpdateIllustrator = Partial<IIllustrator> & Pick<IIllustrator, 'id'>;

export type EntityResponseType = HttpResponse<IIllustrator>;
export type EntityArrayResponseType = HttpResponse<IIllustrator[]>;

@Injectable({ providedIn: 'root' })
export class IllustratorService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/illustrators');

  create(illustrator: NewIllustrator): Observable<EntityResponseType> {
    return this.http.post<IIllustrator>(this.resourceUrl, illustrator, { observe: 'response' });
  }

  update(illustrator: IIllustrator): Observable<EntityResponseType> {
    return this.http.put<IIllustrator>(`${this.resourceUrl}/${this.getIllustratorIdentifier(illustrator)}`, illustrator, {
      observe: 'response',
    });
  }

  partialUpdate(illustrator: PartialUpdateIllustrator): Observable<EntityResponseType> {
    return this.http.patch<IIllustrator>(`${this.resourceUrl}/${this.getIllustratorIdentifier(illustrator)}`, illustrator, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IIllustrator>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IIllustrator[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getIllustratorIdentifier(illustrator: Pick<IIllustrator, 'id'>): number {
    return illustrator.id;
  }

  compareIllustrator(o1: Pick<IIllustrator, 'id'> | null, o2: Pick<IIllustrator, 'id'> | null): boolean {
    return o1 && o2 ? this.getIllustratorIdentifier(o1) === this.getIllustratorIdentifier(o2) : o1 === o2;
  }

  addIllustratorToCollectionIfMissing<Type extends Pick<IIllustrator, 'id'>>(
    illustratorCollection: Type[],
    ...illustratorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const illustrators: Type[] = illustratorsToCheck.filter(isPresent);
    if (illustrators.length > 0) {
      const illustratorCollectionIdentifiers = illustratorCollection.map(illustratorItem => this.getIllustratorIdentifier(illustratorItem));
      const illustratorsToAdd = illustrators.filter(illustratorItem => {
        const illustratorIdentifier = this.getIllustratorIdentifier(illustratorItem);
        if (illustratorCollectionIdentifiers.includes(illustratorIdentifier)) {
          return false;
        }
        illustratorCollectionIdentifiers.push(illustratorIdentifier);
        return true;
      });
      return [...illustratorsToAdd, ...illustratorCollection];
    }
    return illustratorCollection;
  }
}
