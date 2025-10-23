import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IProdOrder } from '../prod-order.model';

@Component({
  selector: 'jhi-prod-order-detail',
  templateUrl: './prod-order-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class ProdOrderDetailComponent {
  prodOrder = input<IProdOrder | null>(null);

  previousState(): void {
    window.history.back();
  }
}
