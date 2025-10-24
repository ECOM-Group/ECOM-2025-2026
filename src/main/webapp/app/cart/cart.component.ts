import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrderLine } from 'app/entities/order-line/order-line.model';
import { ProdOrderService } from 'app/entities/prod-order/service/prod-order.service';

@Component({
  selector: 'jhi-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  orderId?: number;
  items: IOrderLine[] = [];

  constructor(
    private route: ActivatedRoute,
    private prodOrderService: ProdOrderService,
  ) {}

  ngOnInit(): void {
    // Get cart ID from URL (for now)
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    this.loadOrderItems();
  }

  loadOrderItems(): void {
    if (this.orderId == null) return; // sanity check
    // Fetch items of the order from backend
    this.prodOrderService.getOrderLines(this.orderId).subscribe({
      next: (lines: IOrderLine[]) => (this.items = lines),
      error: err => console.error('Failed to fetch order lines', err),
    });
  }
}
