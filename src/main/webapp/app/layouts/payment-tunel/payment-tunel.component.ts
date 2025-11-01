import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AdressFormComponent } from '../adress-form/adress-form.component';
import { AdresseFormGroup } from 'app/layouts/adress-form/adress-form-group';
import { CardFormGroup } from '../payment-card-form/payment-card-group-form';
import { PaymentCardFormComponent } from '../payment-card-form/payment-card-form.component';
import { EMPTY, map, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { HttpClient } from '@angular/common/http';
import LoginComponent from 'app/login/login.component';
import { IUser } from 'app/admin/user-management/user-management.model';
import { IProdOrder } from 'app/entities/prod-order/prod-order.model';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

@Component({
  standalone: true,
  selector: 'jhi-payment-tunel',
  imports: [ReactiveFormsModule, NgIf, AdressFormComponent, PaymentCardFormComponent, LoginComponent],
  templateUrl: './payment-tunel.component.html',
  styleUrls: ['./payment-tunel.component.scss'],
})
export default class PaymentTunelComponent implements OnInit, AfterViewInit {
  paymentForm!: FormGroup;
  isConnected = true;

  stripe: Stripe | null = null;
  card: StripeCardElement | null = null;
  isProcessing = false;
  message: string | null = null;

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
      // card: new CardFormGroup(),
    });
    this.setDynamiqueValidatorOnBilling();

    this.accountService
      .identity()
      .pipe(
        switchMap(user => {
          if (user && user.login) {
            this.isConnected = true;
            return of(user);
          }
          this.isConnected = false;
          return this.accountService.getAuthenticationState();
        }),
        switchMap(user => {
          if (!user || !user.login) {
            return EMPTY;
          }
          this.isConnected = true;
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
      });
  }

  async ngAfterViewInit() {
    this.stripe = await loadStripe(
      'pk_test_51SL1eH9mZN1DQFxykNy0gNXhNOGZgIgHZkLX48pw9TWxyFCWx2gPDSzNNaUAGFChLmoQs05oFbJgDWXuWZqHqtkV00dDaJneYm',
    );

    const elements = this.stripe!.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');

    this.card.on('change', event => {
      const displayError = document.getElementById('card-errors');
      if (displayError) displayError.textContent = event.error ? event.error.message : '';
    });
  }

  setDynamiqueValidatorOnBilling() {
    const billingGroup = this.paymentForm.get('billing') as AdresseFormGroup;

    const changeValidator = (sameAdress: boolean) => {
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
    console.log(this.paymentForm.invalid);
    if (this.paymentForm.invalid) return;
    this.pay();
  }

  async pay() {
    if (!this.stripe || !this.card) {
      console.error('Stripe non initialisé');
      return;
    }

    this.isProcessing = true;
    this.message = null;

    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.card,
    });

    if (error) {
      this.message = error.message || 'Erreur de paiement';
      this.isProcessing = false;
      return;
    }

    this.http
      .post<any>('/api/payement-tunnels/create-payment-intent', {
        paymentMethodId: paymentMethod.id,
      })
      .subscribe(
        async res => {
          const result = await this.stripe!.confirmCardPayment(res.clientSecret);

          if (result.error) {
            this.message = result.error.message || 'Erreur de paiement';
          } else if (result.paymentIntent.status === 'succeeded') {
            this.message = '✅ Paiement réussi !';
            this.saveOrder();
          }

          this.isProcessing = false;
        },
        () => {
          this.message = 'Erreur serveur';
          this.isProcessing = false;
        },
      );
  }

  saveOrder() {
    this.http.post('/api/payement-tunnels/validate-order', {}).subscribe({
      next: () => {
        console.log('Commande validée en base ✅');
        this.router.navigate(['/success']);
      },
      error: err => {
        console.error('Erreur lors de la validation de la commande :', err);
        this.message = 'Erreur lors de la validation de la commande';
      },
    });
  }
}
