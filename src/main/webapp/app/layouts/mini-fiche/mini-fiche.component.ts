import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from 'app/entities/product/product.model';
import { RouterModule } from '@angular/router';
import { TagLabelComponent } from 'app/entities/tag/tag-label/tag-label.component';
import { TagService } from 'app/entities/tag/service/tag.service';
import { ITag } from 'app/entities/tag/tag.model';
@Component({
  selector: 'jhi-mini-fiche',
  imports: [RouterModule, TagLabelComponent],
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

  tags: ITag[] = [];

  constructor(
    private http: HttpClient,
    private tagService: TagService,
  ) {}
  imageUrl: string | null = null;

  ngOnInit(): void {
    if (this.idProduit) {
      this.http.get<IProduct>(`/api/products/${this.idProduit}`).subscribe(product => {
        this.product = product;

        this.http.get<any>(`/api/product-images/first-by-product/${this.idProduit}`).subscribe(img => {
          this.imageUrl = img?.url ?? '';
        });

        this.tagService.getTagsByProduct(this.idProduit).subscribe(tags => {
          this.tags = tags;
        });
      });
    }
  }
}
