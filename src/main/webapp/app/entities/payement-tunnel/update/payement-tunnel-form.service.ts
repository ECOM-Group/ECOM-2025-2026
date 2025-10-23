import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IPayementTunnel, NewPayementTunnel } from '../payement-tunnel.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPayementTunnel for edit and NewPayementTunnelFormGroupInput for create.
 */
type PayementTunnelFormGroupInput = IPayementTunnel | PartialWithRequiredKeyOf<NewPayementTunnel>;

type PayementTunnelFormDefaults = Pick<NewPayementTunnel, 'id'>;

type PayementTunnelFormGroupContent = {
  id: FormControl<IPayementTunnel['id'] | NewPayementTunnel['id']>;
  payementMethod: FormControl<IPayementTunnel['payementMethod']>;
};

export type PayementTunnelFormGroup = FormGroup<PayementTunnelFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PayementTunnelFormService {
  createPayementTunnelFormGroup(payementTunnel: PayementTunnelFormGroupInput = { id: null }): PayementTunnelFormGroup {
    const payementTunnelRawValue = {
      ...this.getFormDefaults(),
      ...payementTunnel,
    };
    return new FormGroup<PayementTunnelFormGroupContent>({
      id: new FormControl(
        { value: payementTunnelRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      payementMethod: new FormControl(payementTunnelRawValue.payementMethod),
    });
  }

  getPayementTunnel(form: PayementTunnelFormGroup): IPayementTunnel | NewPayementTunnel {
    return form.getRawValue() as IPayementTunnel | NewPayementTunnel;
  }

  resetForm(form: PayementTunnelFormGroup, payementTunnel: PayementTunnelFormGroupInput): void {
    const payementTunnelRawValue = { ...this.getFormDefaults(), ...payementTunnel };
    form.reset(
      {
        ...payementTunnelRawValue,
        id: { value: payementTunnelRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PayementTunnelFormDefaults {
    return {
      id: null,
    };
  }
}
