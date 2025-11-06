import { Component, Input } from '@angular/core';
import { IOrderLine } from 'app/entities/order-line/order-line.model';

@Component({
  selector: 'jhi-cart-line',
  templateUrl: './cart-line.component.html',
  styleUrls: ['./cart-line.component.scss'],
})
export class CartLineComponent {
  @Input() orderLine!: IOrderLine;
}
