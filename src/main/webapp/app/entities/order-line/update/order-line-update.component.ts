import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProdOrder } from 'app/entities/prod-order/prod-order.model';
import { ProdOrderService } from 'app/entities/prod-order/service/prod-order.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { OrderLineService } from '../service/order-line.service';
import { IOrderLine } from '../order-line.model';
import { OrderLineFormGroup, OrderLineFormService } from './order-line-form.service';

@Component({
  selector: 'jhi-order-line-update',
  templateUrl: './order-line-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class OrderLineUpdateComponent implements OnInit {
  isSaving = false;
  orderLine: IOrderLine | null = null;

  prodOrdersSharedCollection: IProdOrder[] = [];
  productsSharedCollection: IProduct[] = [];

  protected orderLineService = inject(OrderLineService);
  protected orderLineFormService = inject(OrderLineFormService);
  protected prodOrderService = inject(ProdOrderService);
  protected productService = inject(ProductService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: OrderLineFormGroup = this.orderLineFormService.createOrderLineFormGroup();

  compareProdOrder = (o1: IProdOrder | null, o2: IProdOrder | null): boolean => this.prodOrderService.compareProdOrder(o1, o2);

  compareProduct = (o1: IProduct | null, o2: IProduct | null): boolean => this.productService.compareProduct(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderLine }) => {
      this.orderLine = orderLine;
      if (orderLine) {
        this.updateForm(orderLine);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderLine = this.orderLineFormService.getOrderLine(this.editForm);
    if (orderLine.id !== null) {
      this.subscribeToSaveResponse(this.orderLineService.update(orderLine));
    } else {
      this.subscribeToSaveResponse(this.orderLineService.create(orderLine));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderLine>>): void {
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

  protected updateForm(orderLine: IOrderLine): void {
    this.orderLine = orderLine;
    this.orderLineFormService.resetForm(this.editForm, orderLine);

    this.prodOrdersSharedCollection = this.prodOrderService.addProdOrderToCollectionIfMissing<IProdOrder>(
      this.prodOrdersSharedCollection,
      orderLine.prodOrder,
    );
    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing<IProduct>(
      this.productsSharedCollection,
      orderLine.product,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.prodOrderService
      .query()
      .pipe(map((res: HttpResponse<IProdOrder[]>) => res.body ?? []))
      .pipe(
        map((prodOrders: IProdOrder[]) =>
          this.prodOrderService.addProdOrderToCollectionIfMissing<IProdOrder>(prodOrders, this.orderLine?.prodOrder),
        ),
      )
      .subscribe((prodOrders: IProdOrder[]) => (this.prodOrdersSharedCollection = prodOrders));

    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing<IProduct>(products, this.orderLine?.product)))
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));
  }
}
