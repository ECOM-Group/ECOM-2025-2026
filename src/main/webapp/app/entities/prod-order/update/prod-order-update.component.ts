import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { ProdOrderService } from '../service/prod-order.service';
import { IProdOrder } from '../prod-order.model';
import { ProdOrderFormGroup, ProdOrderFormService } from './prod-order-form.service';

@Component({
  selector: 'jhi-prod-order-update',
  templateUrl: './prod-order-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProdOrderUpdateComponent implements OnInit {
  isSaving = false;
  prodOrder: IProdOrder | null = null;

  addressesSharedCollection: IAddress[] = [];
  usersSharedCollection: IUser[] = [];

  protected prodOrderService = inject(ProdOrderService);
  protected prodOrderFormService = inject(ProdOrderFormService);
  protected addressService = inject(AddressService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ProdOrderFormGroup = this.prodOrderFormService.createProdOrderFormGroup();

  compareAddress = (o1: IAddress | null, o2: IAddress | null): boolean => this.addressService.compareAddress(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prodOrder }) => {
      this.prodOrder = prodOrder;
      if (prodOrder) {
        this.updateForm(prodOrder);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const prodOrder = this.prodOrderFormService.getProdOrder(this.editForm);
    if (prodOrder.id !== null) {
      this.subscribeToSaveResponse(this.prodOrderService.update(prodOrder));
    } else {
      this.subscribeToSaveResponse(this.prodOrderService.create(prodOrder));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProdOrder>>): void {
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

  protected updateForm(prodOrder: IProdOrder): void {
    this.prodOrder = prodOrder;
    this.prodOrderFormService.resetForm(this.editForm, prodOrder);

    this.addressesSharedCollection = this.addressService.addAddressToCollectionIfMissing<IAddress>(
      this.addressesSharedCollection,
      prodOrder.address,
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, prodOrder.user);
  }

  protected loadRelationshipsOptions(): void {
    this.addressService
      .query()
      .pipe(map((res: HttpResponse<IAddress[]>) => res.body ?? []))
      .pipe(
        map((addresses: IAddress[]) => this.addressService.addAddressToCollectionIfMissing<IAddress>(addresses, this.prodOrder?.address)),
      )
      .subscribe((addresses: IAddress[]) => (this.addressesSharedCollection = addresses));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.prodOrder?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
