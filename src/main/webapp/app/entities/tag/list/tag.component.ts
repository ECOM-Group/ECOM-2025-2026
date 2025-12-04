import { Component, NgZone, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, forkJoin, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { ITag } from '../tag.model';
import { EntityArrayResponseType, TagService } from '../service/tag.service';
import { TagDeleteDialogComponent } from '../delete/tag-delete-dialog.component';

@Component({
  selector: 'jhi-tag',
  templateUrl: './tag.component.html',
  imports: [RouterModule, FormsModule, SharedModule, SortDirective, SortByDirective],
})
export class TagComponent implements OnInit {
  subscription: Subscription | null = null;
  tags = signal<ITag[]>([]);
  isLoading = false;

  sortState = sortStateSignal({});

  public readonly router = inject(Router);
  protected readonly tagService = inject(TagService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (item: ITag): number => this.tagService.getTagIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (this.tags().length === 0) {
            this.load();
          } else {
            this.tags.set(this.refineData(this.tags()));
          }
        }),
      )
      .subscribe();
  }

  delete(tag: ITag): void {
    const modalRef = this.modalService.open(TagDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tag = tag;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.isLoading = true;

    // 1️⃣ Fetch normal tags
    this.tagService.query({ sort: this.sortService.buildSortParam(this.sortState()) }).subscribe({
      next: res => {
        const tags = res.body ?? [];

        console.log(
          'Fetched tags:',
          tags.map(t => ({ id: t.id, name: t.name })),
        );

        // fetch product IDs for each tag
        const fetchProductIds = tags.map(tag =>
          this.tagService.getProductIdsByTag(tag.id).pipe(
            tap(productIds => {
              console.log(`Tag ${tag.id} productIds:`, productIds);
              tag.productIds = productIds; // attach to tag
            }),
          ),
        );

        // 3️⃣ Run all product ID fetches in parallel
        forkJoin(fetchProductIds).subscribe({
          next: () => {
            this.tags.set(this.refineData(tags));
            this.isLoading = false;
          },
          error: () => {
            // still display tags even if productIds fail
            this.tags.set(this.refineData(tags));
            this.isLoading = false;
          },
        });
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.tags.set(this.refineData(dataFromBody));
  }

  protected refineData(data: ITag[]): ITag[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: ITag[] | null): ITag[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      eagerload: true,
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.tagService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(sortState: SortState): void {
    const queryParamsObj = {
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
