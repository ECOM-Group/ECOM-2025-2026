import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IOrderLine } from 'app/entities/order-line/order-line.model';
import { OrderLineService } from 'app/entities/order-line/service/order-line.service';

@Component({
  selector: 'jhi-cart-line',
  templateUrl: './cart-line.component.html',
  styleUrls: ['./cart-line.component.scss'],
})
export class CartLineComponent {
  @Input() isCart = true;
  @Input() orderLine!: IOrderLine;
  @Output() updated = new EventEmitter<{ id: number; delete: boolean; priceDiff: number }>(); // notify parent cart

  constructor(private orderLineService: OrderLineService) {}

  increment(): void {
    if (!this.orderLine) return;

    this.orderLineService.incrementQuantity(this.orderLine).subscribe({
      next: res => {
        if (res.body) {
          this.orderLine = res.body;
          this.updated.emit({ id: this.orderLine.id, delete: false, priceDiff: this.orderLine.unitPrice ?? 0 });
        }
      },
      error: err => console.error('Error incrementing quantity', err),
    });
  }

  decrement(): void {
    if (!this.orderLine) return;

    this.orderLineService.decrementQuantity(this.orderLine).subscribe({
      next: res => {
        // res.body can be IOrderLine (updated) or {} (deleted)
        if (res.body && 'id' in res.body) {
          // updated line
          this.orderLine = res.body as IOrderLine;
          this.updated.emit({ id: this.orderLine.id, delete: false, priceDiff: -(this.orderLine.unitPrice ?? 0) });
        } else {
          this.updated.emit({ id: this.orderLine.id, delete: true, priceDiff: -(this.orderLine.unitPrice ?? 0) });
        }
      },
      error: err => console.error('Error decrementing quantity', err),
    });
  }

  delete(): void {
    if (!this.orderLine?.id) return;

    this.orderLineService.delete(this.orderLine.id).subscribe({
      // line deleted notify parent cart
      next: () => this.updated.emit({ id: this.orderLine.id, delete: true, priceDiff: -(this.orderLine.total ?? 0) }),
      error: err => console.error('Error deleting line', err),
    });
  }
}
