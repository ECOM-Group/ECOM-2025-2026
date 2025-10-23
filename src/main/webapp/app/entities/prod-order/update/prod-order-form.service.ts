import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IProdOrder, NewProdOrder } from '../prod-order.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProdOrder for edit and NewProdOrderFormGroupInput for create.
 */
type ProdOrderFormGroupInput = IProdOrder | PartialWithRequiredKeyOf<NewProdOrder>;

type ProdOrderFormDefaults = Pick<NewProdOrder, 'id' | 'valid'>;

type ProdOrderFormGroupContent = {
  id: FormControl<IProdOrder['id'] | NewProdOrder['id']>;
  valid: FormControl<IProdOrder['valid']>;
  promo: FormControl<IProdOrder['promo']>;
  address: FormControl<IProdOrder['address']>;
  user: FormControl<IProdOrder['user']>;
};

export type ProdOrderFormGroup = FormGroup<ProdOrderFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProdOrderFormService {
  createProdOrderFormGroup(prodOrder: ProdOrderFormGroupInput = { id: null }): ProdOrderFormGroup {
    const prodOrderRawValue = {
      ...this.getFormDefaults(),
      ...prodOrder,
    };
    return new FormGroup<ProdOrderFormGroupContent>({
      id: new FormControl(
        { value: prodOrderRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      valid: new FormControl(prodOrderRawValue.valid),
      promo: new FormControl(prodOrderRawValue.promo),
      address: new FormControl(prodOrderRawValue.address),
      user: new FormControl(prodOrderRawValue.user),
    });
  }

  getProdOrder(form: ProdOrderFormGroup): IProdOrder | NewProdOrder {
    return form.getRawValue() as IProdOrder | NewProdOrder;
  }

  resetForm(form: ProdOrderFormGroup, prodOrder: ProdOrderFormGroupInput): void {
    const prodOrderRawValue = { ...this.getFormDefaults(), ...prodOrder };
    form.reset(
      {
        ...prodOrderRawValue,
        id: { value: prodOrderRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProdOrderFormDefaults {
    return {
      id: null,
      valid: false,
    };
  }
}
