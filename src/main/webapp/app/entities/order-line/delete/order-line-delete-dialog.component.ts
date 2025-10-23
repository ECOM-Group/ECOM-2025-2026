import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IOrderLine } from '../order-line.model';
import { OrderLineService } from '../service/order-line.service';

@Component({
  templateUrl: './order-line-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class OrderLineDeleteDialogComponent {
  orderLine?: IOrderLine;

  protected orderLineService = inject(OrderLineService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.orderLineService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
