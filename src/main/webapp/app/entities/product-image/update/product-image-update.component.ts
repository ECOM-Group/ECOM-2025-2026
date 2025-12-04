import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IProductImage, NewProductImage } from '../product-image.model';
import { ProductImageService } from '../service/product-image.service';
import { ProductImageFormGroup, ProductImageFormService } from './product-image-form.service';

type ProductImageInput = IProductImage | NewProductImage;

@Component({
  selector: 'jhi-product-image-update',
  templateUrl: './product-image-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProductImageUpdateComponent implements OnInit {
  isSaving = false;
  productImage: IProductImage | null = null;

  productsSharedCollection: IProduct[] = [];

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  protected productImageService = inject(ProductImageService);
  protected productImageFormService = inject(ProductImageFormService);
  protected productService = inject(ProductService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ProductImageFormGroup = this.productImageFormService.createProductImageFormGroup();

  compareProduct = (o1: IProduct | null, o2: IProduct | null): boolean => this.productService.compareProduct(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productImage }) => {
      this.productImage = productImage;
      if (productImage) {
        this.updateForm(productImage);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;

    const productImage = this.productImageFormService.getProductImage(this.editForm);

    if (this.selectedFile) {
      this.productImageService.uploadImage(this.selectedFile, productImage.product!.id!).subscribe({
        next: response => {
          const savedImage = response.body!;

          this.productImage = savedImage;

          this.onSaveSuccess();
        },
        error: () => {
          this.isSaving = false;
          console.error('Erreur upload image');
        },
      });
    } else {
      // Pas de fichier → fonctionnement normal
      this.finishSave(productImage);
    }
  }

  private finishSave(productImage: ProductImageInput): void {
    if (productImage.id !== null) {
      // objet existant → update
      this.subscribeToSaveResponse(this.productImageService.update(productImage as IProductImage));
    } else {
      // nouvel objet → create
      this.subscribeToSaveResponse(this.productImageService.create(productImage as NewProductImage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductImage>>): void {
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

  protected updateForm(productImage: IProductImage): void {
    this.productImage = productImage;

    this.productImageFormService.resetForm(this.editForm, {
      ...productImage,
      id: productImage.id, // assure que l'id est bien mis dans le form !
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing<IProduct>(
      this.productsSharedCollection,
      productImage.product,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing<IProduct>(products, this.productImage?.product)),
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = e => (this.previewUrl = reader.result as string);
      reader.readAsDataURL(this.selectedFile);
    }
  }
}
