import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { IProduct } from 'app/entities/product/product.model';
import { ITag } from 'app/entities/tag/tag.model';
import { EMPTY, switchMap, tap } from 'rxjs';
import { HomePageService } from 'app/service/home-page/home-page.service';
import { MiniFicheComponent } from '../mini-fiche/mini-fiche.component';
import { CartService } from 'app/service/cart/cart.service';
import { TagService } from 'app/entities/tag/service/tag.service';
import { TagLabelComponent } from 'app/entities/tag/tag-label/tag-label.component';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-home-page',
  imports: [MiniFicheComponent, TagLabelComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export default class HomePageComponent {
  private cartService = inject(CartService);

  topSoldProducts: IProduct[] = [];
  searchedProducts: IProduct[] = [];
  tags: ITag[] = [];
  selectedTagIds: number[] = [];

  canComment: Array<CanComment> = [];

  constructor(
    private http: HttpClient,
    private homePageService: HomePageService,
    private tagService: TagService,
    private router: Router,
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
    // Fetch tags
    this.tagService.findAll().subscribe({
      next: res => {
        this.tags = res.body ?? [];
      },
      error: err => console.error('Erreur lors de la récupération des tags', err),
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

  onTagClicked(tagId: number): void {
    const tagName = this.tags.find(t => t.id === tagId)?.name;

    if (!tagName) return;
    this.router.navigate(['/search'], {
      queryParams: {
        tag: tagId,
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
