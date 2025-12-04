import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { IProduct } from 'app/entities/product/product.model';
import { EMPTY, switchMap, tap } from 'rxjs';
import { HomePageService } from 'app/service/home-page/home-page.service';
import { MiniFicheComponent } from '../mini-fiche/mini-fiche.component';
import { CartService } from 'app/service/cart/cart.service';

@Component({
  selector: 'jhi-home-page',
  imports: [MiniFicheComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export default class HomePageComponent {
  private cartService = inject(CartService);

  topSoldProducts: IProduct[] = [];
  searchedProducts: IProduct[] = [];

  canComment: Array<CanComment> = [];

  constructor(
    private http: HttpClient,
    private homePageService: HomePageService,
  ) {}

  private MIN_DISPLAYED_PRODUCTS = 10;

  ngOnInit(): void {
    this.cartService.notifyCartUpdated();
    let purchasedProduct_id: Array<number> = [];

    this.http
      .get<number[]>('/api/products/get-all-purchased-procucts-by-user')
      .pipe(
        tap(ids => (purchasedProduct_id = ids)),
        switchMap(() => {
          return this.homePageService.GetMostSelledProducts();
        }),
        switchMap((products: IProduct[]) => {
          this.topSoldProducts = products;

          products.forEach(p => {
            this.canComment.push(new CanComment(p.id, purchasedProduct_id.includes(p.id)));
          });

          return this.topSoldProducts.length > this.MIN_DISPLAYED_PRODUCTS ? EMPTY : this.http.get<IProduct[]>('/api/products');
        }),
      )
      .subscribe({
        next: products => {
          if (!products) return;

          const topSoldProductsId = this.topSoldProducts.map(p => p.id);

          const additionalProducts = products
            .filter(p => !topSoldProductsId.includes(p.id))
            .slice(0, this.MIN_DISPLAYED_PRODUCTS - this.topSoldProducts.length);

          additionalProducts.forEach(p => {
            this.canComment.push(new CanComment(p.id, purchasedProduct_id.includes(p.id)));
          });

          this.topSoldProducts.push(...additionalProducts);
        },
        error: err => {
          console.error('Erreur lors du chargement des produits', err);
        },
      });
  }
  research(motsCles: string[]): void {
    this.homePageService.Search(motsCles).subscribe({
      next: (products: IProduct[]) => {
        this.searchedProducts = products;
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des produits connectes', err);
      },
    });
  }
}
class CanComment {
  constructor(
    public prod_id: number,
    public canComment: boolean,
  ) {}
}
