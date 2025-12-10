import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf, Location } from '@angular/common';
import { AdressFormComponent } from '../adress-form/adress-form.component';
import { AdresseFormGroup } from 'app/layouts/adress-form/adress-form-group';
import { CardFormGroup } from '../payment-card-form/payment-card-group-form';
// import { PaymentCardFormComponent } from '../payment-card-form/payment-card-form.component';
import { EMPTY, from, map, Observable, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { HttpClient } from '@angular/common/http';
import LoginComponent from 'app/login/login.component';
import { IProdOrder } from 'app/entities/prod-order/prod-order.model';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { RouterLink } from '@angular/router';
import { CartService } from 'app/service/cart/cart.service';
import { Account } from 'app/core/auth/account.model';
import { IMissingStock } from 'app/model/IMissingStock';

@Component({
  standalone: true,
  selector: 'jhi-payment-tunel',
  imports: [ReactiveFormsModule, NgIf, AdressFormComponent, /* PaymentCardFormComponent ,*/ LoginComponent],
  templateUrl: './payment-tunel.component.html',
  styleUrls: ['./payment-tunel.component.scss'],
})
export default class PaymentTunelComponent implements OnInit, AfterViewInit {
  private cartService = inject(CartService);
  paymentForm!: FormGroup;
  isConnected = true;

  stripe: Stripe | null = null;
  card: StripeCardElement | null = null;
  isProcessing = false;
  message: string | null = null;

  account: Account | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private accountService: AccountService,
    private location: Location,
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
          this.isConnected = !!user;
          return this.isConnected ? of(user) : this.accountService.getAuthenticationState();
        }),
        switchMap(user => {
          if (!user) return EMPTY; // n'était pas co et ne l'ai toujours pas, stop

          this.account = user;
          this.isConnected = true;
          return this.http.get<IProdOrder>(`/api/prod-orders/current`);
        }),
      )
      .subscribe({
        next: prodOrder => console.log('ON SUBSCRIBE :', prodOrder),
        error: err => console.error('Erreur :', err),
      });
  }

  goback(): void {
    this.location.back();
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

  pay(): void {
    if (!this.stripe || !this.card) {
      console.error('Stripe non initialisé');
      return;
    }

    this.isProcessing = true;
    this.message = null;

    this.http
      .post<IMissingStock[]>('/api/payement-tunnels/pre-validate-order', {})
      .pipe(
        switchMap(stockResult => {
          if (stockResult && stockResult.length > 0) {
            this.displayStockErrors(stockResult);
            this.isProcessing = false;
            return EMPTY;
          }
          // OK => Stripe
          return from(
            this.stripe!.createPaymentMethod({
              type: 'card',
              card: this.card as StripeCardElement,
            }),
          );
        }),
        switchMap(pmResult => {
          if (pmResult.error) {
            this.message = pmResult.error.message || 'Erreur de paiement';
            return this.refoundCurrentOrder().pipe(switchMap(() => EMPTY));
          }

          return this.http.post<{ clientSecret: string }>('/api/payement-tunnels/create-payment-intent', {
            paymentMethodId: pmResult.paymentMethod!.id,
          });
        }),
        switchMap(piRes => {
          if (!piRes || !piRes.clientSecret) {
            this.message = 'Erreur serveur';
            return this.refoundCurrentOrder().pipe(switchMap(() => EMPTY));
          }
          return from(this.stripe!.confirmCardPayment(piRes.clientSecret));
        }),
        switchMap(paymentResult => {
          if (paymentResult.paymentIntent?.status === 'succeeded') {
            return this.http.post<void>('/api/payement-tunnels/validate-current-order', {});
          }

          if (paymentResult.error) {
            this.message = paymentResult.error.message || 'Erreur de paiement';
          }

          return this.refoundCurrentOrder();
        }),
      )
      .subscribe({
        next: () => {
          this.message = 'Paiement réussi !';
          this.isProcessing = false;
          this.router.navigate(['/']);
        },
        error: err => {
          console.error('Erreur reçue :', err);

          if (err.status === 400 && err.error && Array.isArray(err.error)) {
            this.displayStockErrors(err.error as IMissingStock[]);
          } else {
            this.message = 'Erreur serveur';
          }

          this.isProcessing = false;
        },
      });
  }

  displayStockErrors(stockErrors: IMissingStock[]) {
    const listItems = stockErrors
      .map(
        item =>
          `<li>${item.productName} x${item.requestedQuantity} 
        (stock disponible : ${item.availableQuantity})</li>`,
      )
      .join('');

    this.message = `
      Stock insuffisant pour certains produits :
      <ul>
        ${listItems}
      </ul>
      Merci de modifier votre panier ou d'attendre une augmentation des stocks.
    `;
  }

  refoundCurrentOrder(): Observable<void> {
    return this.http.post('/api/payement-tunnels/refound-current-order', {}).pipe(map(() => undefined));
  }
}
