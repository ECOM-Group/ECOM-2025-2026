import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IIllustrator } from '../illustrator.model';
import { IllustratorService } from '../service/illustrator.service';
import { IllustratorFormGroup, IllustratorFormService } from './illustrator-form.service';

@Component({
  selector: 'jhi-illustrator-update',
  templateUrl: './illustrator-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class IllustratorUpdateComponent implements OnInit {
  isSaving = false;
  illustrator: IIllustrator | null = null;

  protected illustratorService = inject(IllustratorService);
  protected illustratorFormService = inject(IllustratorFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: IllustratorFormGroup = this.illustratorFormService.createIllustratorFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ illustrator }) => {
      this.illustrator = illustrator;
      if (illustrator) {
        this.updateForm(illustrator);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const illustrator = this.illustratorFormService.getIllustrator(this.editForm);
    if (illustrator.id !== null) {
      this.subscribeToSaveResponse(this.illustratorService.update(illustrator));
    } else {
      this.subscribeToSaveResponse(this.illustratorService.create(illustrator));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIllustrator>>): void {
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

  protected updateForm(illustrator: IIllustrator): void {
    this.illustrator = illustrator;
    this.illustratorFormService.resetForm(this.editForm, illustrator);
  }
}
