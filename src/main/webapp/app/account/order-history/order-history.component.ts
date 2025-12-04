import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CartComponent } from 'app/cart/cart.component';
import { IProdOrder } from 'app/entities/prod-order/prod-order.model';
import { IUser } from 'app/entities/user/user.model';
import { EMPTY, switchMap } from 'rxjs';

@Component({
  selector: 'jhi-order-history',
  imports: [CartComponent],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss',
})
export class OrderHistoryComponent implements OnInit {
  orders: IProdOrder[] = [];
  selectedOrder: IProdOrder | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadOrderItems();
  }
  loadOrderItems(): void {
    this.http
      .get<IUser>('/api/account')
      .pipe(
        switchMap(user => {
          // Récupérer le user courrant ou attendre qu'il se connecte
          if (!user) return EMPTY;

          const userId = user.id;
          console.log('User id = ', userId);

          return this.http.get<IProdOrder[]>(`/api/prod-orders/allOfCurrentUser`);
        }),
      )
      .subscribe({
        next: (orders: IProdOrder[]) => {
          this.orders = orders.filter(order => order.valid).sort((a, b) => b.id - a.id);
        },
        error: err => {
          console.error('❌ Erreur lors du chargement des lignes de commande', err);
        },
      });
  }

  selectOrder(order: IProdOrder) {
    console.log(order.id, this.selectedOrder?.id);
    console.log('FROM', this.selectedOrder?.id);
    this.selectedOrder = order.id === this.selectedOrder?.id ? null : order;
    console.log('TO', this.selectedOrder?.id);
  }
}
