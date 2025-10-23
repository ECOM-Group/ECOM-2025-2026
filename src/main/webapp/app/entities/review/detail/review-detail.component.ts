import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IReview } from '../review.model';

@Component({
  selector: 'jhi-review-detail',
  templateUrl: './review-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class ReviewDetailComponent {
  review = input<IReview | null>(null);

  previousState(): void {
    window.history.back();
  }
}
