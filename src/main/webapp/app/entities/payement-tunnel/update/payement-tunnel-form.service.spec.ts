import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../payement-tunnel.test-samples';

import { PayementTunnelFormService } from './payement-tunnel-form.service';

describe('PayementTunnel Form Service', () => {
  let service: PayementTunnelFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayementTunnelFormService);
  });

  describe('Service methods', () => {
    describe('createPayementTunnelFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPayementTunnelFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            payementMethod: expect.any(Object),
          }),
        );
      });

      it('passing IPayementTunnel should create a new form with FormGroup', () => {
        const formGroup = service.createPayementTunnelFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            payementMethod: expect.any(Object),
          }),
        );
      });
    });

    describe('getPayementTunnel', () => {
      it('should return NewPayementTunnel for default PayementTunnel initial value', () => {
        const formGroup = service.createPayementTunnelFormGroup(sampleWithNewData);

        const payementTunnel = service.getPayementTunnel(formGroup) as any;

        expect(payementTunnel).toMatchObject(sampleWithNewData);
      });

      it('should return NewPayementTunnel for empty PayementTunnel initial value', () => {
        const formGroup = service.createPayementTunnelFormGroup();

        const payementTunnel = service.getPayementTunnel(formGroup) as any;

        expect(payementTunnel).toMatchObject({});
      });

      it('should return IPayementTunnel', () => {
        const formGroup = service.createPayementTunnelFormGroup(sampleWithRequiredData);

        const payementTunnel = service.getPayementTunnel(formGroup) as any;

        expect(payementTunnel).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPayementTunnel should not enable id FormControl', () => {
        const formGroup = service.createPayementTunnelFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPayementTunnel should disable id FormControl', () => {
        const formGroup = service.createPayementTunnelFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
