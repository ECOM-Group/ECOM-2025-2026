import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { IOrderLine } from 'app/entities/order-line/order-line.model';
import { OrderLineService } from 'app/entities/order-line/service/order-line.service';
import { CartService } from 'app/service/cart/cart.service';

@Component({
  selector: 'jhi-cart-line',
  templateUrl: './cart-line.component.html',
  styleUrls: ['./cart-line.component.scss'],
})
export class CartLineComponent {
  @Input() isCart = true;
  @Input() orderLine!: IOrderLine;
  @Output() updated = new EventEmitter<{ id: number; delete: boolean; priceDiff: number }>(); // notify parent cart

  imageUrl: string | null = null;
  isRemoving = false;
  stockMax = false;

  constructor(
    private orderLineService: OrderLineService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const idProduit = this.orderLine?.product?.id;
    this.stockMax = (this.orderLine.product?.quantity ?? 0) <= (this.orderLine.quantity ?? 0);
    if (idProduit) {
      this.http.get<any>(`/api/product-images/first-by-product/${idProduit}`).subscribe(img => {
        this.imageUrl = img?.url ?? 'assets/images/no-image.png';
      });
    }
  }

  increment(): void {
    if (!this.orderLine) return;

    this.orderLineService.incrementQuantity(this.orderLine).subscribe({
      next: res => {
        if (res.body) {
          this.orderLine = res.body;
          this.stockMax = (this.orderLine.product?.quantity ?? 0) <= (this.orderLine.quantity ?? 0);
          this.updated.emit({ id: this.orderLine.id, delete: false, priceDiff: this.orderLine.unitPrice ?? 0 });
        }
      },
      error: err => {
        if (err.status === 409) {
          this.stockMax = true;
        } else console.error('Error incrementing quantity', err);
      },
    });
  }

  decrement(): void {
    if (!this.orderLine) return;

    this.orderLineService.decrementQuantity(this.orderLine).subscribe({
      next: res => {
        // res.body can be IOrderLine (updated) or {} (deleted)
        if (res.body && 'id' in res.body) {
          // updated line
          this.stockMax = false;
          this.orderLine = res.body as IOrderLine;
          this.updated.emit({ id: this.orderLine.id, delete: false, priceDiff: -(this.orderLine.unitPrice ?? 0) });
        } else {
          this.updated.emit({ id: this.orderLine.id, delete: true, priceDiff: -(this.orderLine.unitPrice ?? 0) });
          //this.cartService.notifyCartUpdated();
        }
      },
      error: err => console.error('Error decrementing quantity', err),
    });
  }

  delete(): void {
    if (!this.orderLine?.id) return;

    this.isRemoving = true;

    setTimeout(() => {
      this.orderLineService.delete(this.orderLine.id).subscribe({
        next: () => {
          this.updated.emit({
            id: this.orderLine.id,
            delete: true,
            priceDiff: -(this.orderLine.total ?? 0),
          });
        },
        error: err => console.error('Error deleting line', err),
      });
    }, 350);
  }
}
