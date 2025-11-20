import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { MiniFicheComponent } from 'app/layouts/mini-fiche/mini-fiche.component';
import { FilterOptions, FilterOption } from 'app/shared/filter/filter.model';

@Component({
  selector: 'jhi-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss'],
  imports: [MiniFicheComponent],
})
export class ProductSearchComponent implements OnInit {
  query: string | null = null;
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  loading = false;

  priceRanges: string[] = ['0-50', '50-100', '100-200'];

  // Filters for the page (only color and priceRange)
  searchFilters = new FilterOptions([new FilterOption('color'), new FilterOption('priceRange')]);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.query = params.get('q');
      if (this.query) this.searchProducts(this.query);
    });

    // Subscribe to filter changes to update results dynamically
    this.searchFilters.filterChanges.subscribe(() => this.applyFilters());
  }

  searchProducts(query: string): void {
    this.loading = true;

    this.productService.search(query).subscribe({
      next: (products: IProduct[]) => {
        this.products = products;
        this.filteredProducts = [...products]; // initially show all results
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product =>
      this.searchFilters.filterOptions.every(filter => {
        if (!filter.isSet()) return true;

        switch (filter.name) {
          case 'color':
            return product.color != null && filter.values.includes(product.color);

          case 'priceRange':
            const price = product.price;
            if (price == null) return false; // price is null or undefined → skip
            return filter.values.some(range => {
              const [min, max] = range.split('-').map(Number);
              return price >= min && price <= max; // price is definitely a number here
            });

          default:
            return true;
        }
      }),
    );
  }

  // Methods to update filters dynamically
  toggleFilter(name: string, value: string): void {
    const existing = this.searchFilters.getFilterOptionByName(name);
    if (existing?.values.includes(value)) {
      this.searchFilters.removeFilter(name, value);
    } else {
      this.searchFilters.addFilter(name, value);
    }
  }

  clearAllFilters(): void {
    this.searchFilters.clear();
  }

  clearFilter(name: string, value: string): void {
    this.searchFilters.removeFilter(name, value);
  }

  get priceFilterValues(): string[] {
    return this.searchFilters.filterOptions.find(f => f.name === 'priceRange')?.values ?? [];
  }

  get colorFilterValues(): string[] {
    return this.searchFilters.filterOptions.find(f => f.name === 'color')?.values ?? [];
  }

  get getAvailableColors(): string[] {
    return Array.from(new Set(this.products.map(p => p.color).filter(c => c != null)));
  }
}
