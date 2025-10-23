import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { IProduct } from './../../entities/product/product.model';
import { IOrderLine } from './../../entities/order-line/order-line.model';

@Injectable({
  providedIn: 'root',
})
export class HomePageService {
  constructor(private http: HttpClient) {}

  GetMostSelledProducts(): Observable<IProduct[]> {
    return this.http.get<IOrderLine[]>('/api/order-lines').pipe(
      map((orderlines: IOrderLine[]) => {
        const salesMap = new Map<number, number>();

        orderlines.forEach(line => {
          if (line.product && line.quantity) {
            const current = salesMap.get(line.product.id) || 0;
            salesMap.set(line.product.id, current + line.quantity);
          } else {
            console.log('Attention la ligne de commade est null, dans GetMostSelledProducts');
          }
        });

        const topProductIds = Array.from(salesMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([productId]) => productId);
        return topProductIds;
      }),

      switchMap((topProductIds: number[]) => {
        const requests = topProductIds.map(id => this.http.get<IProduct>(`/api/products/${id}`));
        return forkJoin(requests);
      }),
    );
  }
}
