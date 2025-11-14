import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { MiniFicheComponent } from 'app/layouts/mini-fiche/mini-fiche.component';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  imports: [MiniFicheComponent],
})
export class ProductSearchComponent implements OnInit {
  query: string | null = null;
  products: IProduct[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.query = params.get('q');
      if (this.query) {
        this.searchProducts(this.query);
      }
    });
  }

  searchProducts(query: string): void {
    this.loading = true;

    this.productService.search(query).subscribe({
      next: (products: IProduct[]) => {
        this.products = products;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
