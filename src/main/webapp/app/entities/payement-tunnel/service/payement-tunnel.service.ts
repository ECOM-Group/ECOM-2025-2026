import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPayementTunnel, NewPayementTunnel } from '../payement-tunnel.model';

export type PartialUpdatePayementTunnel = Partial<IPayementTunnel> & Pick<IPayementTunnel, 'id'>;

export type EntityResponseType = HttpResponse<IPayementTunnel>;
export type EntityArrayResponseType = HttpResponse<IPayementTunnel[]>;

@Injectable({ providedIn: 'root' })
export class PayementTunnelService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/payement-tunnels');

  create(payementTunnel: NewPayementTunnel): Observable<EntityResponseType> {
    return this.http.post<IPayementTunnel>(this.resourceUrl, payementTunnel, { observe: 'response' });
  }

  update(payementTunnel: IPayementTunnel): Observable<EntityResponseType> {
    return this.http.put<IPayementTunnel>(`${this.resourceUrl}/${this.getPayementTunnelIdentifier(payementTunnel)}`, payementTunnel, {
      observe: 'response',
    });
  }

  partialUpdate(payementTunnel: PartialUpdatePayementTunnel): Observable<EntityResponseType> {
    return this.http.patch<IPayementTunnel>(`${this.resourceUrl}/${this.getPayementTunnelIdentifier(payementTunnel)}`, payementTunnel, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPayementTunnel>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPayementTunnel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPayementTunnelIdentifier(payementTunnel: Pick<IPayementTunnel, 'id'>): number {
    return payementTunnel.id;
  }

  comparePayementTunnel(o1: Pick<IPayementTunnel, 'id'> | null, o2: Pick<IPayementTunnel, 'id'> | null): boolean {
    return o1 && o2 ? this.getPayementTunnelIdentifier(o1) === this.getPayementTunnelIdentifier(o2) : o1 === o2;
  }

  addPayementTunnelToCollectionIfMissing<Type extends Pick<IPayementTunnel, 'id'>>(
    payementTunnelCollection: Type[],
    ...payementTunnelsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const payementTunnels: Type[] = payementTunnelsToCheck.filter(isPresent);
    if (payementTunnels.length > 0) {
      const payementTunnelCollectionIdentifiers = payementTunnelCollection.map(payementTunnelItem =>
        this.getPayementTunnelIdentifier(payementTunnelItem),
      );
      const payementTunnelsToAdd = payementTunnels.filter(payementTunnelItem => {
        const payementTunnelIdentifier = this.getPayementTunnelIdentifier(payementTunnelItem);
        if (payementTunnelCollectionIdentifiers.includes(payementTunnelIdentifier)) {
          return false;
        }
        payementTunnelCollectionIdentifiers.push(payementTunnelIdentifier);
        return true;
      });
      return [...payementTunnelsToAdd, ...payementTunnelCollection];
    }
    return payementTunnelCollection;
  }
}
