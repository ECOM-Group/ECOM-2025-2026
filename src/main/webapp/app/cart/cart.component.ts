import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrderLine } from 'app/entities/order-line/order-line.model';
import { ProdOrderService } from 'app/entities/prod-order/service/prod-order.service';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { EMPTY, switchMap } from 'rxjs';
import { IUser } from 'app/entities/user/user.model';
import { IProdOrder } from 'app/entities/prod-order/prod-order.model';
import LoginComponent from 'app/login/login.component';
import { CartLineComponent } from './cart-line/cart-line.component';

@Component({
  selector: 'jhi-cart',
  imports: [RouterModule, LoginComponent, CartLineComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  items: IOrderLine[] = [];
  totalPrice = 0;
  orderId = -1;
  userId = -1;
  userConnected = true;
  redirectURL = '/';
  @Input() order: IOrderLine | null = null;

  constructor(
    private route: ActivatedRoute,
    private prodOrderService: ProdOrderService,
    private http: HttpClient,
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    const orderIdString = this.route.snapshot.paramMap.get('orderId');
    this.orderId = Number(orderIdString);
    // orderId = 0, NaN, > 0 , 0 <

    if (isNaN(this.orderId) || this.orderId <= 0) {
      this.orderId = this.order?.id ?? -1;
    }
    // orderId = -1 ou > 0
    this.loadOrderItems();
  }

  loadOrderItems(): void {
    if (!this.accountService.isAuthenticated()) {
      this.userConnected = false;
      this.redirectURL = `/cart${this.orderId < 0 ? '' : `/${this.orderId}`}`;
      return;
    }
    this.http
      .get<IUser>('/api/account')
      .pipe(
        switchMap(user => {
          // Récupérer le user courrant ou attendre qu'il se connecte
          if (!user) return EMPTY;
          this.userConnected = true;

          this.userId = user.id;
          console.log('User id = ', this.userId, 'orderId = ', this.orderId);

          if (this.orderId < 0) return this.http.get<IProdOrder>(`/api/prod-orders/${this.userId}/current`);
          return this.http.get<IProdOrder>(`/api/prod-orders/${this.orderId}`);
        }),
        switchMap(prodOrder => {
          // Récupère les OrderLines de la prod Order
          if (!prodOrder || prodOrder.user?.id !== this.userId) {
            console.log(`prodOrder.user : ${prodOrder.user ? 'ok' : 'null'} of ID ${prodOrder.user?.id} VS this.userID = ${this.userId}`);
            return EMPTY;
          }
          this.orderId = prodOrder.id;
          console.log('True order id = ', this.orderId);
          return this.prodOrderService.getOrderLines(prodOrder.id);
        }),
      )
      .subscribe({
        next: (lines: IOrderLine[]) => {
          this.items = lines;
          console.log('✅ Lignes de commande chargées avec produits :', this.items);
          this.totalPrice = this.items.map(i => i.total).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 0;
          this.userConnected = true;
        },
        error: err => {
          console.error('❌ Erreur lors du chargement des lignes de commande', err);
        },
      });
  }

  onLineUpdated(line: IOrderLine): void {
    this.items = this.items.filter(i => i.id !== line.id);
  }
}
