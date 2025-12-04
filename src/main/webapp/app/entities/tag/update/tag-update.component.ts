import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ITag } from '../tag.model';
import { TagService } from '../service/tag.service';
import { TagFormGroup, TagFormService } from './tag-form.service';

@Component({
  selector: 'jhi-tag-update',
  templateUrl: './tag-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TagUpdateComponent implements OnInit {
  isSaving = false;
  tag: ITag | null = null;

  productsSharedCollection: IProduct[] = [];
  selectedProducts: IProduct[] = [];

  protected tagService = inject(TagService);
  protected tagFormService = inject(TagFormService);
  protected productService = inject(ProductService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TagFormGroup = this.tagFormService.createTagFormGroup();

  compareProduct = (o1: IProduct | null, o2: IProduct | null): boolean => this.productService.compareProduct(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tag }) => {
      this.tag = tag;
      if (tag) {
        this.updateForm(tag);
      }
      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tag = this.tagFormService.getTag(this.editForm);
    if (tag.id !== null) {
      this.subscribeToSaveResponse(this.tagService.update(tag));
    } else {
      this.subscribeToSaveResponse(this.tagService.create(tag));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITag>>): void {
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

  protected updateForm(tag: ITag): void {
    this.tag = tag;
    this.tagFormService.resetForm(this.editForm, tag);

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing<IProduct>(
      this.productsSharedCollection,
      ...(tag.ids ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing<IProduct>(products, ...(this.tag?.ids ?? []))),
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));
  }

  // NEW method for multiple products
  attachMultipleProductsToTag(products: IProduct[]): void {
    if (!products.length || !this.tag?.id) return;

    const tagId = this.tag.id;
    const attachObservables: Observable<void>[] = [];

    products.forEach(product => {
      if (product.id) {
        attachObservables.push(this.tagService.attachToProduct(product.id, tagId));
      }
    });

    // Subscribe to all attach requests individually
    attachObservables.forEach(obs =>
      obs.subscribe({
        next: () => console.log(`Attached product to tag ${tagId}`),
        error: err => console.error('Failed to attach product', err),
      }),
    );

    // Clear selection after attaching
    this.selectedProducts = [];
  }

  // check if a product is already selected
  isSelected(product: IProduct): boolean {
    return this.selectedProducts.some(p => p.id === product.id);
  }

  // toggle selection when checkbox changes
  toggleProductSelection(event: Event, product: IProduct): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.isSelected(product)) {
        this.selectedProducts.push(product);
      }
    } else {
      this.selectedProducts = this.selectedProducts.filter(p => p.id !== product.id);
    }
  }
}
