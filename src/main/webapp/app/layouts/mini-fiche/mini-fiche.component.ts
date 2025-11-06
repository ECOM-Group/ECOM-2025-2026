import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from 'app/entities/product/product.model';
import { map } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'jhi-mini-fiche',
  imports: [RouterModule],
  templateUrl: './mini-fiche.component.html',
  styleUrl: './mini-fiche.component.scss',
})
export class MiniFicheComponent implements OnInit {
  @Input() idProduit!: number;
  product: IProduct = {
    id: -1,
    price: null,
    desc: '',
    quantity: 0,
    imageHash: null,
    tags: [],
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.idProduit) {
      this.http
        .get(`/api/products/${this.idProduit}`)
        .pipe(map((d: any): IProduct => d))
        .subscribe({
          next: data => {
            this.product = data;
          },
          error: err => {
            console.error('Erreur lors de la récupération du produit');
          },
        });
    }
  }
}
