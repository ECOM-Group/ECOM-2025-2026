import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IProdOrder } from '../prod-order.model';
import { ProdOrderService } from '../service/prod-order.service';

@Component({
  templateUrl: './prod-order-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ProdOrderDeleteDialogComponent {
  prodOrder?: IProdOrder;

  protected prodOrderService = inject(ProdOrderService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.prodOrderService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
