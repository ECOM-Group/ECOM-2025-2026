import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProdOrder, NewProdOrder } from '../prod-order.model';

export type PartialUpdateProdOrder = Partial<IProdOrder> & Pick<IProdOrder, 'id'>;

export type EntityResponseType = HttpResponse<IProdOrder>;
export type EntityArrayResponseType = HttpResponse<IProdOrder[]>;

@Injectable({ providedIn: 'root' })
export class ProdOrderService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/prod-orders');

  create(prodOrder: NewProdOrder): Observable<EntityResponseType> {
    return this.http.post<IProdOrder>(this.resourceUrl, prodOrder, { observe: 'response' });
  }

  update(prodOrder: IProdOrder): Observable<EntityResponseType> {
    return this.http.put<IProdOrder>(`${this.resourceUrl}/${this.getProdOrderIdentifier(prodOrder)}`, prodOrder, { observe: 'response' });
  }

  partialUpdate(prodOrder: PartialUpdateProdOrder): Observable<EntityResponseType> {
    return this.http.patch<IProdOrder>(`${this.resourceUrl}/${this.getProdOrderIdentifier(prodOrder)}`, prodOrder, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProdOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProdOrder[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProdOrderIdentifier(prodOrder: Pick<IProdOrder, 'id'>): number {
    return prodOrder.id;
  }

  compareProdOrder(o1: Pick<IProdOrder, 'id'> | null, o2: Pick<IProdOrder, 'id'> | null): boolean {
    return o1 && o2 ? this.getProdOrderIdentifier(o1) === this.getProdOrderIdentifier(o2) : o1 === o2;
  }

  addProdOrderToCollectionIfMissing<Type extends Pick<IProdOrder, 'id'>>(
    prodOrderCollection: Type[],
    ...prodOrdersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const prodOrders: Type[] = prodOrdersToCheck.filter(isPresent);
    if (prodOrders.length > 0) {
      const prodOrderCollectionIdentifiers = prodOrderCollection.map(prodOrderItem => this.getProdOrderIdentifier(prodOrderItem));
      const prodOrdersToAdd = prodOrders.filter(prodOrderItem => {
        const prodOrderIdentifier = this.getProdOrderIdentifier(prodOrderItem);
        if (prodOrderCollectionIdentifiers.includes(prodOrderIdentifier)) {
          return false;
        }
        prodOrderCollectionIdentifiers.push(prodOrderIdentifier);
        return true;
      });
      return [...prodOrdersToAdd, ...prodOrderCollection];
    }
    return prodOrderCollection;
  }
}
