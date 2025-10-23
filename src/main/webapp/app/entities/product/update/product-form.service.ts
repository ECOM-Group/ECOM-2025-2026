import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IProduct, NewProduct } from '../product.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProduct for edit and NewProductFormGroupInput for create.
 */
type ProductFormGroupInput = IProduct | PartialWithRequiredKeyOf<NewProduct>;

type ProductFormDefaults = Pick<NewProduct, 'id' | 'tags'>;

type ProductFormGroupContent = {
  id: FormControl<IProduct['id'] | NewProduct['id']>;
  name: FormControl<IProduct['name']>;
  prodType: FormControl<IProduct['prodType']>;
  price: FormControl<IProduct['price']>;
  desc: FormControl<IProduct['desc']>;
  quantity: FormControl<IProduct['quantity']>;
  imageHash: FormControl<IProduct['imageHash']>;
  cardType: FormControl<IProduct['cardType']>;
  cardText: FormControl<IProduct['cardText']>;
  edition: FormControl<IProduct['edition']>;
  language: FormControl<IProduct['language']>;
  material: FormControl<IProduct['material']>;
  color: FormControl<IProduct['color']>;
  pageNum: FormControl<IProduct['pageNum']>;
  pageLoad: FormControl<IProduct['pageLoad']>;
  capacity: FormControl<IProduct['capacity']>;
  illustrator: FormControl<IProduct['illustrator']>;
  tags: FormControl<IProduct['tags']>;
};

export type ProductFormGroup = FormGroup<ProductFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductFormService {
  createProductFormGroup(product: ProductFormGroupInput = { id: null }): ProductFormGroup {
    const productRawValue = {
      ...this.getFormDefaults(),
      ...product,
    };
    return new FormGroup<ProductFormGroupContent>({
      id: new FormControl(
        { value: productRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(productRawValue.name),
      prodType: new FormControl(productRawValue.prodType),
      price: new FormControl(productRawValue.price),
      desc: new FormControl(productRawValue.desc),
      quantity: new FormControl(productRawValue.quantity),
      imageHash: new FormControl(productRawValue.imageHash),
      cardType: new FormControl(productRawValue.cardType),
      cardText: new FormControl(productRawValue.cardText),
      edition: new FormControl(productRawValue.edition),
      language: new FormControl(productRawValue.language),
      material: new FormControl(productRawValue.material),
      color: new FormControl(productRawValue.color),
      pageNum: new FormControl(productRawValue.pageNum),
      pageLoad: new FormControl(productRawValue.pageLoad),
      capacity: new FormControl(productRawValue.capacity),
      illustrator: new FormControl(productRawValue.illustrator),
      tags: new FormControl(productRawValue.tags ?? []),
    });
  }

  getProduct(form: ProductFormGroup): IProduct | NewProduct {
    return form.getRawValue() as IProduct | NewProduct;
  }

  resetForm(form: ProductFormGroup, product: ProductFormGroupInput): void {
    const productRawValue = { ...this.getFormDefaults(), ...product };
    form.reset(
      {
        ...productRawValue,
        id: { value: productRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProductFormDefaults {
    return {
      id: null,
      tags: [],
    };
  }
}
