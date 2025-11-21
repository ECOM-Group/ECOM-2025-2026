import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { MiniFicheComponent } from 'app/layouts/mini-fiche/mini-fiche.component';
import { FilterOptions, FilterOption } from 'app/shared/filter/filter.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'jhi-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss'],
  imports: [MiniFicheComponent, FormsModule],
})
export class ProductSearchComponent implements OnInit {
  query: string | null = null;
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  loading = false;

  minPrice = 0;
  maxPrice = 0;
  sliderPrice = 0; // current selected max price

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
        this.setupPriceSlider();
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  applyFilters(): void {
    // Filter by slider price
    this.filteredProducts = this.products.filter(product => {
      const price = product.price ?? 0;
      return price >= this.minPrice && price <= this.sliderPrice;
    });

    // Apply other filters (color, etc.)
    this.filteredProducts = this.filteredProducts.filter(product =>
      this.searchFilters.filterOptions.every(filter => {
        if (!filter.isSet()) return true;

        switch (filter.name) {
          case 'color':
            return product.color != null && filter.values.includes(product.color);
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

  /** Price Slider Setup and Handlers */
  setupPriceSlider(): void {
    const prices = this.products.map(p => p.price).filter((p): p is number => p != null);

    if (prices.length === 0) {
      this.minPrice = 0;
      this.maxPrice = 0;
      this.sliderPrice = 0;
      return;
    }

    this.minPrice = 0;
    this.maxPrice = Math.max(...prices);
    this.sliderPrice = this.maxPrice;
  }

  onSliderChange(): void {
    this.applyFilters(); // fully reactive live filtering
  }

  onEmptyPrice(): void {
    if (!this.sliderPrice) {
      this.sliderPrice = 0;
      this.applyFilters();
    }
  }

  /* Getters for Filter Options */
  get colorFilterValues(): string[] {
    return this.searchFilters.filterOptions.find(f => f.name === 'color')?.values ?? [];
  }

  get getAvailableColors(): string[] {
    return Array.from(new Set(this.products.map(p => p.color).filter(c => c != null)));
  }
}
