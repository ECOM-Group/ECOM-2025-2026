import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jhi-prod-order',
  imports: [],
  templateUrl: './prod-order.component.html',
  styleUrl: './prod-order.component.scss',
})
export class ProdOrderComponent implements OnInit {
  orderId?: number;
  items: any[] = [];

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
    this.http.get(`/api/orders/${this.orderId}/items`).subscribe((data: any) => {
      this.items = data;
    });
  }
}
