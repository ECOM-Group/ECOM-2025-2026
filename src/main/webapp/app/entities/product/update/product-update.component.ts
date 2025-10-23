import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IIllustrator } from 'app/entities/illustrator/illustrator.model';
import { IllustratorService } from 'app/entities/illustrator/service/illustrator.service';
import { ITag } from 'app/entities/tag/tag.model';
import { TagService } from 'app/entities/tag/service/tag.service';
import { ProductType } from 'app/entities/enumerations/product-type.model';
import { CardType } from 'app/entities/enumerations/card-type.model';
import { Language } from 'app/entities/enumerations/language.model';
import { Material } from 'app/entities/enumerations/material.model';
import { ProductService } from '../service/product.service';
import { IProduct } from '../product.model';
import { ProductFormGroup, ProductFormService } from './product-form.service';

@Component({
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;
  product: IProduct | null = null;
  productTypeValues = Object.keys(ProductType);
  cardTypeValues = Object.keys(CardType);
  languageValues = Object.keys(Language);
  materialValues = Object.keys(Material);

  illustratorsSharedCollection: IIllustrator[] = [];
  tagsSharedCollection: ITag[] = [];

  protected productService = inject(ProductService);
  protected productFormService = inject(ProductFormService);
  protected illustratorService = inject(IllustratorService);
  protected tagService = inject(TagService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ProductFormGroup = this.productFormService.createProductFormGroup();

  compareIllustrator = (o1: IIllustrator | null, o2: IIllustrator | null): boolean => this.illustratorService.compareIllustrator(o1, o2);

  compareTag = (o1: ITag | null, o2: ITag | null): boolean => this.tagService.compareTag(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.product = product;
      if (product) {
        this.updateForm(product);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.productFormService.getProduct(this.editForm);
    if (product.id !== null) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(product: IProduct): void {
    this.product = product;
    this.productFormService.resetForm(this.editForm, product);

    this.illustratorsSharedCollection = this.illustratorService.addIllustratorToCollectionIfMissing<IIllustrator>(
      this.illustratorsSharedCollection,
      product.illustrator,
    );
    this.tagsSharedCollection = this.tagService.addTagToCollectionIfMissing<ITag>(this.tagsSharedCollection, ...(product.tags ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.illustratorService
      .query()
      .pipe(map((res: HttpResponse<IIllustrator[]>) => res.body ?? []))
      .pipe(
        map((illustrators: IIllustrator[]) =>
          this.illustratorService.addIllustratorToCollectionIfMissing<IIllustrator>(illustrators, this.product?.illustrator),
        ),
      )
      .subscribe((illustrators: IIllustrator[]) => (this.illustratorsSharedCollection = illustrators));

    this.tagService
      .query()
      .pipe(map((res: HttpResponse<ITag[]>) => res.body ?? []))
      .pipe(map((tags: ITag[]) => this.tagService.addTagToCollectionIfMissing<ITag>(tags, ...(this.product?.tags ?? []))))
      .subscribe((tags: ITag[]) => (this.tagsSharedCollection = tags));
  }
}
