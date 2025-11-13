import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

export class AdresseFormGroup extends FormGroup {
  constructor() {
    super({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^(\d{2} ?){5}$/)]),
      adress: new FormControl('', Validators.required),
      postalCode: new FormControl('', [Validators.required, Validators.pattern(/^\d{5}$/)]),
      city: new FormControl('', Validators.required),
    });
  }

  // Optionnel : getters pratiques pour un meilleur typage
  get firstName() {
    return this.get('firstName') as FormControl;
  }
  get lastName() {
    return this.get('lastName') as FormControl;
  }
  get email() {
    return this.get('email') as FormControl;
  }
  get phoneNumber() {
    return this.get('phoneNumber') as FormControl;
  }
  get adress() {
    return this.get('adress') as FormControl;
  }
  get postalCode() {
    return this.get('postalCode') as FormControl;
  }
  get city() {
    return this.get('city') as FormControl;
  }
}
