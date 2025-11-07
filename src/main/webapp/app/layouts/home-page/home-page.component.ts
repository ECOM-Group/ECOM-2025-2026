import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IProduct } from 'app/entities/product/product.model';
import { switchMap } from 'rxjs';
import { HomePageService } from 'app/service/home-page/home-page.service';
import { MiniFicheComponent } from '../mini-fiche/mini-fiche.component';

@Component({
  selector: 'jhi-home-page',
  imports: [MiniFicheComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export default class HomePageComponent {
  topSoldProducts: IProduct[] = [];
  searchedProducts: IProduct[] = [];
  constructor(
    private http: HttpClient,
    private homePageService: HomePageService,
  ) {}

  ngOnInit(): void {
    this.homePageService.GetMostSelledProducts().subscribe({
      next: (products: IProduct[]) => {
        this.topSoldProducts = products;
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des produits les plus vendus', err);
      },
    });
  }
  research(motsCles: string[]): void{
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
