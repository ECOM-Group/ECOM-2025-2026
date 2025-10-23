import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPayementTunnel } from '../payement-tunnel.model';
import { PayementTunnelService } from '../service/payement-tunnel.service';

@Component({
  templateUrl: './payement-tunnel-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PayementTunnelDeleteDialogComponent {
  payementTunnel?: IPayementTunnel;

  protected payementTunnelService = inject(PayementTunnelService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.payementTunnelService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
