import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../prod-order.test-samples';

import { ProdOrderFormService } from './prod-order-form.service';

describe('ProdOrder Form Service', () => {
  let service: ProdOrderFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdOrderFormService);
  });

  describe('Service methods', () => {
    describe('createProdOrderFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProdOrderFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            valid: expect.any(Object),
            promo: expect.any(Object),
            address: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });

      it('passing IProdOrder should create a new form with FormGroup', () => {
        const formGroup = service.createProdOrderFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            valid: expect.any(Object),
            promo: expect.any(Object),
            address: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });
    });

    describe('getProdOrder', () => {
      it('should return NewProdOrder for default ProdOrder initial value', () => {
        const formGroup = service.createProdOrderFormGroup(sampleWithNewData);

        const prodOrder = service.getProdOrder(formGroup) as any;

        expect(prodOrder).toMatchObject(sampleWithNewData);
      });

      it('should return NewProdOrder for empty ProdOrder initial value', () => {
        const formGroup = service.createProdOrderFormGroup();

        const prodOrder = service.getProdOrder(formGroup) as any;

        expect(prodOrder).toMatchObject({});
      });

      it('should return IProdOrder', () => {
        const formGroup = service.createProdOrderFormGroup(sampleWithRequiredData);

        const prodOrder = service.getProdOrder(formGroup) as any;

        expect(prodOrder).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProdOrder should not enable id FormControl', () => {
        const formGroup = service.createProdOrderFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProdOrder should disable id FormControl', () => {
        const formGroup = service.createProdOrderFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
