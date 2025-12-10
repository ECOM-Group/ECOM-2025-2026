import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountService } from 'app/core/auth/account.service';
import { ProdOrderService } from 'app/entities/prod-order/service/prod-order.service';
import { switchMap, of, Subject } from 'rxjs';
import { IUser } from 'app/entities/user/user.model';
import { IProdOrder } from 'app/entities/prod-order/prod-order.model';
import { IOrderLine } from 'app/entities/order-line/order-line.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  private prodOrderService = inject(ProdOrderService);

  // Signal réactif
  cartCount = signal(0);

  // Événements internes
  private cartUpdated$ = new Subject<void>();

  constructor() {
    // Recharge le panier quand l'app démarre
    this.loadCartCount();

    // Recharge automatiquement après chaque modification du panier
    this.cartUpdated$.subscribe(() => this.loadCartCount());
  }

  /** Appel public : permet à toutes les actions d’indiquer que le panier a changé */
  notifyCartUpdated(): void {
    this.cartUpdated$.next();
  }

  /** Recharge la quantité du panier */
  private loadCartCount(): void {
    if (!this.accountService.isAuthenticated()) {
      this.cartCount.set(0);
      return;
    }
    this.http
      .get<IProdOrder>(`/api/prod-orders/current`)
      .pipe(
        switchMap(order => {
          if (!order) return of([]); // <-- IMPORTANT : toujours un tableau
          return this.prodOrderService.getOrderLines(order.id);
        }),
      )
      .subscribe({
        next: (lines: IOrderLine[]) => this.cartCount.set((lines ?? []).length), // <-- sécurisation
        error: () => this.cartCount.set(0),
      });
  }
}
