import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AdressFormComponent } from '../adress-form/adress-form.component';
import { AdresseFormGroup } from 'app/layouts/adress-form/adress-form-group';
import { CardFormGroup } from '../payment-card-form/payment-card-group-form';
import { PaymentCardFormComponent } from '../payment-card-form/payment-card-form.component';
import { EMPTY, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { HttpClient } from '@angular/common/http';
import LoginComponent from 'app/login/login.component';
import { IUser } from 'app/admin/user-management/user-management.model';
import { IProdOrder } from 'app/entities/prod-order/prod-order.model';

@Component({
  standalone: true,
  selector: 'jhi-payment-tunel',
  imports: [ReactiveFormsModule, NgIf, AdressFormComponent, PaymentCardFormComponent, LoginComponent],
  templateUrl: './payment-tunel.component.html',
  styleUrls: ['./payment-tunel.component.scss'],
})
export default class PaymentTunelComponent implements OnInit {
  paymentForm!: FormGroup;
  isConnected = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      sameAdress: [true],
      delivery: new AdresseFormGroup(),
      billing: new AdresseFormGroup(),
      card: new CardFormGroup(),
    });
    this.setDynamiqueValidatorOnBilling();

    this.accountService
      .identity()
      .pipe(
        switchMap(user => {
          if (user && user.login) {
            console.log('Utilisateur déjà connecté');
            return of(user); // user = Objet, of(user) : of = créé un observable => of(user) = créer un observable et envoit user dedans
          }

          this.isConnected = false;
          return this.accountService.getAuthenticationState();
        }),

        switchMap(user => {
          if (!user || !user.login) {
            console.log('Toujours pas connecté après redirection');
            return EMPTY;
          }
          this.isConnected = true;
          console.log('Utilisateur :', user, 'typeof', typeof user);
          return this.http.get<IUser>(`/api/admin/users/${user.login}`);
        }),
        map(user => user.id),
        switchMap(userId => {
          return this.http.get<IProdOrder>(`/api/prod-orders/${userId}/current`);
        }),
      )
      .subscribe({
        next: prodOrder => console.log('ON SUBSCRIBE :', prodOrder),
        error: err => console.error('Erreur :', err),
        complete: () => console.log('Flux terminé'),
      });
  }

  setDynamiqueValidatorOnBilling() {
    const billingGroup = this.paymentForm.get('billing') as AdresseFormGroup;

    const changeValidator = (sameAdress: boolean) => {
      console.log(sameAdress);
      if (sameAdress) {
        Object.keys(billingGroup.controls).forEach(field => {
          billingGroup.get(field)?.clearValidators();
          billingGroup.get(field)?.updateValueAndValidity();
        });
      } else {
        // Ajouter les validators
        billingGroup.get('firstName')?.setValidators(Validators.required);
        billingGroup.get('lastName')?.setValidators(Validators.required);
        billingGroup.get('email')?.setValidators([Validators.required, Validators.email]);
        billingGroup.get('phoneNumber')?.setValidators([Validators.required, Validators.pattern(/^(\d{2} ?){5}$/)]);
        billingGroup.get('adress')?.setValidators(Validators.required);
        billingGroup.get('postalCode')?.setValidators([Validators.required, Validators.pattern(/^\d{5}$/)]);
        billingGroup.get('city')?.setValidators(Validators.required);
        Object.keys(billingGroup.controls).forEach(field => {
          billingGroup.get(field)?.updateValueAndValidity();
        });
      }
    };

    this.paymentForm.get('sameAdress')?.valueChanges.subscribe(sameAdress => changeValidator(sameAdress));
    changeValidator(this.paymentForm.get('sameAdress')?.value);
  }

  deliveryForm(): AdresseFormGroup {
    return this.paymentForm.get('delivery') as AdresseFormGroup;
  }
  billingForm(): AdresseFormGroup {
    return this.paymentForm.get('billing') as AdresseFormGroup;
  }
  cardForm(): CardFormGroup {
    return this.paymentForm.get('card') as CardFormGroup;
  }

  isSameAdress(): boolean {
    return this.paymentForm?.get('sameAdress')?.value;
  }

  submit(): void {
    console.log(this.paymentForm.value);
    console.log(this.paymentForm.valid);
  }
}
