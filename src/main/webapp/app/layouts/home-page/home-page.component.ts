import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { IProduct } from 'app/entities/product/product.model';
import { ITag } from 'app/entities/tag/tag.model';
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

  constructor(
    private http: HttpClient,
    private homePageService: HomePageService,
    private tagService: TagService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cartService.notifyCartUpdated();

    // Top sold products
    this.homePageService.GetMostSelledProducts().subscribe({
      next: (products: IProduct[]) => {
        this.topSoldProducts = products;
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des produits les plus vendus', err);
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
