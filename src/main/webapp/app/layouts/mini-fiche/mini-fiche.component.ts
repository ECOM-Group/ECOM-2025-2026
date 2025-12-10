import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from 'app/entities/product/product.model';
import { Router, RouterModule } from '@angular/router';
import { TagLabelComponent } from 'app/entities/tag/tag-label/tag-label.component';
import { TagService } from 'app/entities/tag/service/tag.service';
import { ITag } from 'app/entities/tag/tag.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jhi-mini-fiche',
  imports: [RouterModule, TagLabelComponent, CommonModule],
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

  tags: ITag[] = [];

  constructor(
    private http: HttpClient,
    private tagService: TagService,
    private router: Router,
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

  onTagClicked(tagId: number): void {
    const tagName = this.tags.find(t => t.id === tagId)?.name;

    if (!tagName) return;
    this.router.navigate(['/search'], {
      queryParams: {
        tag: tagId,
      },
    });
  }

  get rarity(): string {
    const id = this.product?.id ?? 0;
    return this.rarityList[id % this.rarityList.length];
  }
}
