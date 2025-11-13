import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountService } from 'app/core/auth/account.service';
import { switchMap, of } from 'rxjs';
import { IProdOrder } from 'app/entities/prod-order/prod-order.model';
import { IOrderLine } from 'app/entities/order-line/order-line.model';
import { IUser } from 'app/entities/user/user.model';
import { ProdOrderService } from 'app/entities/prod-order/service/prod-order.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);

  cartCount = signal(0);

  private prodOrderService = inject(ProdOrderService);

  constructor() {
    this.loadCartCount();
  }

  refresh(): void {
    this.loadCartCount();
  }

  loadCartCount(): void {
    if (!this.accountService.isAuthenticated()) {
      this.cartCount.set(0);
      return;
    }

    this.http
      .get<IUser>('/api/account')
      .pipe(
        switchMap(user => {
          if (!user) return of(null);

          const userId = user.id;

          // même logique que loadOrderItems
          return this.http.get<IProdOrder>(`/api/prod-orders/${userId}/current`);
        }),
        switchMap(prodOrder => {
          if (!prodOrder) return of([]);

          // IMPORTANT : même vérification que ton code qui marche
          if (!prodOrder.user || prodOrder.user.id !== prodOrder.user.id) {
            return of([]);
          }

          // APPEL FONCTIONNEL (ton code)
          return this.prodOrderService.getOrderLines(prodOrder.id);
        }),
      )
      .subscribe({
        next: (lines: IOrderLine[]) => {
          this.cartCount.set(lines.length); // juste compter
        },
        error: err => {
          console.error('❌ Erreur loadCartCount():', err);
          this.cartCount.set(0);
        },
      });
  }
}
