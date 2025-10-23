import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IIllustrator } from '../illustrator.model';
import { IllustratorService } from '../service/illustrator.service';

@Component({
  templateUrl: './illustrator-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class IllustratorDeleteDialogComponent {
  illustrator?: IIllustrator;

  protected illustratorService = inject(IllustratorService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.illustratorService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
