import { FormGroup, FormControl, Validators } from '@angular/forms';

export class CardFormGroup extends FormGroup {
  constructor() {
    super({
      number: new FormGroup({
        p1: new FormControl('', [Validators.required, Validators.pattern(/^\d{4}$/)]),
        p2: new FormControl('', [Validators.required, Validators.pattern(/^\d{4}$/)]),
        p3: new FormControl('', [Validators.required, Validators.pattern(/^\d{4}$/)]),
        p4: new FormControl('', [Validators.required, Validators.pattern(/^\d{4}$/)]),
      }),
      expirationMonth: new FormControl('', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]),
      expirationYear: new FormControl('', [Validators.required, Validators.pattern(/^\d{4}$/)]),
      cvv: new FormControl('', [Validators.required, Validators.pattern(/^\d{3}$/)]),
    });
  }

  get number(): FormGroup {
    return this.get('number') as FormGroup;
  }

  get p1() {
    return this.number.get('p1') as FormControl;
  }
  get p2() {
    return this.number.get('p2') as FormControl;
  }
  get p3() {
    return this.number.get('p3') as FormControl;
  }
  get p4() {
    return this.number.get('p4') as FormControl;
  }

  get expirationMonth() {
    return this.get('expirationMonth') as FormControl;
  }
  get expirationYear() {
    return this.get('expirationYear') as FormControl;
  }
  get cvv() {
    return this.get('cvv') as FormControl;
  }
}
