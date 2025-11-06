import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrderLine } from 'app/entities/order-line/order-line.model';
import { ProdOrderService } from 'app/entities/prod-order/service/prod-order.service';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'jhi-cart',
  imports: [RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  orderId?: number;
  items: IOrderLine[] = [];
  totalPrice = 0;

  constructor(
    private route: ActivatedRoute,
    private prodOrderService: ProdOrderService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    // Get cart ID from URL (for now)
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    this.loadOrderItems();
  }

  loadOrderItems(): void {
    if (!this.orderId) return;

    // Appelle directement le backend : les produits sont déjà inclus
    this.prodOrderService.getOrderLines(this.orderId).subscribe({
      next: (lines: IOrderLine[]) => {
        this.items = lines;
        console.log('✅ Lignes de commande chargées avec produits :', this.items);
        this.totalPrice = this.items.map(i => i.total).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 0;
      },
      error: err => {
        console.error('❌ Erreur lors du chargement des lignes de commande', err);
      },
    });
  }
}
