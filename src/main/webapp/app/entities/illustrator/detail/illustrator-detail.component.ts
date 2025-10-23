import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IIllustrator } from '../illustrator.model';

@Component({
  selector: 'jhi-illustrator-detail',
  templateUrl: './illustrator-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class IllustratorDetailComponent {
  illustrator = input<IIllustrator | null>(null);

  previousState(): void {
    window.history.back();
  }
}
