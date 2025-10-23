import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IIllustrator, NewIllustrator } from '../illustrator.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IIllustrator for edit and NewIllustratorFormGroupInput for create.
 */
type IllustratorFormGroupInput = IIllustrator | PartialWithRequiredKeyOf<NewIllustrator>;

type IllustratorFormDefaults = Pick<NewIllustrator, 'id'>;

type IllustratorFormGroupContent = {
  id: FormControl<IIllustrator['id'] | NewIllustrator['id']>;
  firstName: FormControl<IIllustrator['firstName']>;
  lastName: FormControl<IIllustrator['lastName']>;
};

export type IllustratorFormGroup = FormGroup<IllustratorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class IllustratorFormService {
  createIllustratorFormGroup(illustrator: IllustratorFormGroupInput = { id: null }): IllustratorFormGroup {
    const illustratorRawValue = {
      ...this.getFormDefaults(),
      ...illustrator,
    };
    return new FormGroup<IllustratorFormGroupContent>({
      id: new FormControl(
        { value: illustratorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      firstName: new FormControl(illustratorRawValue.firstName),
      lastName: new FormControl(illustratorRawValue.lastName),
    });
  }

  getIllustrator(form: IllustratorFormGroup): IIllustrator | NewIllustrator {
    return form.getRawValue() as IIllustrator | NewIllustrator;
  }

  resetForm(form: IllustratorFormGroup, illustrator: IllustratorFormGroupInput): void {
    const illustratorRawValue = { ...this.getFormDefaults(), ...illustrator };
    form.reset(
      {
        ...illustratorRawValue,
        id: { value: illustratorRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): IllustratorFormDefaults {
    return {
      id: null,
    };
  }
}
