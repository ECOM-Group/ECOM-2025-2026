import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IOrderLine } from 'app/entities/order-line/order-line.model';
import { OrderLineService } from 'app/entities/order-line/service/order-line.service';

@Component({
  selector: 'jhi-cart-line',
  templateUrl: './cart-line.component.html',
  styleUrls: ['./cart-line.component.scss'],
})
export class CartLineComponent {
  @Input() orderLine!: IOrderLine;
  @Output() updated = new EventEmitter<void>(); // notify parent cart

  constructor(private orderLineService: OrderLineService) {}

  get total(): number | null {
    return this.orderLine?.quantity && this.orderLine?.unitPrice ? this.orderLine.quantity * this.orderLine.unitPrice : null;
  }

  increment(): void {
    if (!this.orderLine) return;

    this.orderLineService.incrementQuantity(this.orderLine).subscribe({
      next: res => {
        if (res.body) {
          this.orderLine = res.body;
          this.updated.emit();
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
        } else {
          // deleted line → optionally tell parent to remove this line
          this.updated.emit();
        }
        this.updated.emit();
      },
      error: err => console.error('Error decrementing quantity', err),
    });
  }

  delete(): void {
    if (!this.orderLine?.id) return;

    this.orderLineService.delete(this.orderLine.id).subscribe({
      next: () => this.updated.emit(),
      error: err => console.error('Error deleting line', err),
    });
  }
}
