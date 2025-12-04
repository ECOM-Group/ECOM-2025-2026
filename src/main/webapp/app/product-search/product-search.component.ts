import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { MiniFicheComponent } from 'app/layouts/mini-fiche/mini-fiche.component';
import { FilterOptions, FilterOption } from 'app/shared/filter/filter.model';
import { FormsModule } from '@angular/forms';
import { TagService } from 'app/entities/tag/service/tag.service';
import { ITag } from 'app/entities/tag/tag.model';
import { TagLabelComponent } from 'app/entities/tag/tag-label/tag-label.component';

@Component({
  selector: 'jhi-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss'],
  imports: [MiniFicheComponent, FormsModule, TagLabelComponent],
})
export class ProductSearchComponent implements OnInit {
  query: string | null = null;

  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];

  tags: ITag[] = [];
  selectedTagIds: number[] = [];
  tagFilteredProductIds: number[] | null = null;

  loading = false;

  minPrice = 0;
  maxPrice = 0;
  sliderPrice = 0;

  searchFilters = new FilterOptions([new FilterOption('color'), new FilterOption('priceRange')]);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private tagService: TagService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.query = params.get('q');
      if (this.query) this.searchProducts(this.query);
    });

    this.tagService.findAll().subscribe({
      next: res => (this.tags = res.body ?? []),
      error: err => console.error('Failed to load tags', err),
    });

    this.searchFilters.filterChanges.subscribe(() => this.applyFilters());
  }

  searchProducts(query: string): void {
    this.loading = true;
    // Reset selected tags when starting a new search
    this.clearAllTags();

    this.productService.search(query).subscribe({
      next: (products: IProduct[]) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.setupPriceSlider();
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  applyFilters(): void {
    let result = this.products.filter(product => {
      const price = product.price ?? 0;
      return price >= this.minPrice && price <= this.sliderPrice;
    });

    result = result.filter(product =>
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

    if (this.tagFilteredProductIds && this.selectedTagIds.length > 0) {
      result = result.filter(product => product.id != null && this.tagFilteredProductIds!.includes(product.id));
    }

    this.filteredProducts = result;
  }

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
    this.clearAllTags();
  }

  clearFilter(name: string, value: string): void {
    this.searchFilters.removeFilter(name, value);
  }

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
    this.applyFilters();
  }

  onEmptyPrice(): void {
    if (!this.sliderPrice) {
      this.sliderPrice = 0;
      this.applyFilters();
    }
  }

  /** MULTI TAG TOGGLE */
  onTagToggled(tagId: number): void {
    if (this.selectedTagIds.includes(tagId)) {
      this.selectedTagIds = this.selectedTagIds.filter(id => id !== tagId);
    } else {
      this.selectedTagIds.push(tagId);
    }

    this.applyMultiTagFilter();
  }

  applyMultiTagFilter(): void {
    if (this.selectedTagIds.length === 0) {
      this.tagFilteredProductIds = null;
      this.applyFilters();
      return;
    }

    const requests = this.selectedTagIds.map(id => this.tagService.getProductIdsByTag(id));

    Promise.all(requests.map(r => r.toPromise()))
      .then(resultSets => {
        const cleanResults: number[][] = resultSets.map(r => r ?? []);

        const intersection = cleanResults.reduce((a, b) => a.filter(id => b.includes(id)), cleanResults[0] ?? []);

        this.tagFilteredProductIds = intersection;
        this.applyFilters();
      })
      .catch(err => {
        console.error('Tag filter failed', err);
        this.tagFilteredProductIds = null;
        this.applyFilters();
      });
  }

  clearAllTags(): void {
    this.selectedTagIds = [];
    this.tagFilteredProductIds = null;
    this.applyFilters();
  }

  get colorFilterValues(): string[] {
    return this.searchFilters.filterOptions.find(f => f.name === 'color')?.values ?? [];
  }

  get getAvailableColors(): string[] {
    return Array.from(new Set(this.products.map(p => p.color).filter(c => c != null)));
  }
}
