import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PayementMode } from 'app/entities/enumerations/payement-mode.model';
import { IPayementTunnel } from '../payement-tunnel.model';
import { PayementTunnelService } from '../service/payement-tunnel.service';
import { PayementTunnelFormGroup, PayementTunnelFormService } from './payement-tunnel-form.service';

@Component({
  selector: 'jhi-payement-tunnel-update',
  templateUrl: './payement-tunnel-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PayementTunnelUpdateComponent implements OnInit {
  isSaving = false;
  payementTunnel: IPayementTunnel | null = null;
  payementModeValues = Object.keys(PayementMode);

  protected payementTunnelService = inject(PayementTunnelService);
  protected payementTunnelFormService = inject(PayementTunnelFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PayementTunnelFormGroup = this.payementTunnelFormService.createPayementTunnelFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payementTunnel }) => {
      this.payementTunnel = payementTunnel;
      if (payementTunnel) {
        this.updateForm(payementTunnel);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const payementTunnel = this.payementTunnelFormService.getPayementTunnel(this.editForm);
    if (payementTunnel.id !== null) {
      this.subscribeToSaveResponse(this.payementTunnelService.update(payementTunnel));
    } else {
      this.subscribeToSaveResponse(this.payementTunnelService.create(payementTunnel));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPayementTunnel>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(payementTunnel: IPayementTunnel): void {
    this.payementTunnel = payementTunnel;
    this.payementTunnelFormService.resetForm(this.editForm, payementTunnel);
  }
}
