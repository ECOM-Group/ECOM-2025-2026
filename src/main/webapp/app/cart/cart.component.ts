import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrderLine } from 'app/entities/order-line/order-line.model';

interface Product {
  id: number;
  name: string;
  description: string;
}

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
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    // Get cart ID from URL (for now)
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    this.loadOrderItems();
  }

  loadOrderItems(): void {
    // Fetch items of the order from backend
    this.http.get(`/api/prod-orders/${this.orderId}/order-lines`).subscribe({
      next: data => (this.items = data as IOrderLine[]),
      error: err => console.error('Failed to fetch order lines', err),
    });
  }
}
