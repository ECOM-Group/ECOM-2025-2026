import { HttpClient, HttpParams } from '@angular/common/http';
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
    return this.http.get<IProduct[]>('/api/products/most-selled').pipe(
      map((products: IProduct[]) => {
        if (!products || products.length === 0) {
          console.log('Aucun produit trouvé dans GetMostSelledProducts');
        }
        return products;
      }),
    );
  }

  Search(motsCles: string[]): Observable<IProduct[]> {
    const params = new HttpParams().set('q', motsCles.join(' '));

    return this.http.get<IProduct[]>('/api/products/search', { params }).pipe(
      map((products: IProduct[]) => {
        if (!products || products.length === 0) {
          console.log('Aucun produit trouvé dans GetConnnectedProducts');
        }
        return products;
      }),
    );
  }
}
