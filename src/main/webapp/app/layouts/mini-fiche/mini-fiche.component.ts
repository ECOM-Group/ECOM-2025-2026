import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from 'app/entities/product/product.model';
import { map } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jhi-mini-fiche',
  imports: [RouterModule, CommonModule],
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

  rarityList = ['common', 'rare', 'sr', 'ur', 'mythic'];

  constructor(private http: HttpClient) {}
  imageUrl: string | null = null;

  ngOnInit(): void {
    if (this.idProduit) {
      this.http.get<IProduct>(`/api/products/${this.idProduit}`).subscribe(product => {
        this.product = product;

        this.http.get<any>(`/api/product-images/first-by-product/${this.idProduit}`).subscribe(img => {
          this.imageUrl = img?.url ?? '';
        });
      });
    }
  }

  get rarity(): string {
    const id = this.product?.id ?? 0;
    return this.rarityList[id % this.rarityList.length];
  }
}
