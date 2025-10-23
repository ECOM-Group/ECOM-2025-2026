import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IPayementTunnel } from '../payement-tunnel.model';

@Component({
  selector: 'jhi-payement-tunnel-detail',
  templateUrl: './payement-tunnel-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class PayementTunnelDetailComponent {
  payementTunnel = input<IPayementTunnel | null>(null);

  previousState(): void {
    window.history.back();
  }
}
