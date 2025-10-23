import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../illustrator.test-samples';

import { IllustratorFormService } from './illustrator-form.service';

describe('Illustrator Form Service', () => {
  let service: IllustratorFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IllustratorFormService);
  });

  describe('Service methods', () => {
    describe('createIllustratorFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createIllustratorFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
          }),
        );
      });

      it('passing IIllustrator should create a new form with FormGroup', () => {
        const formGroup = service.createIllustratorFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
          }),
        );
      });
    });

    describe('getIllustrator', () => {
      it('should return NewIllustrator for default Illustrator initial value', () => {
        const formGroup = service.createIllustratorFormGroup(sampleWithNewData);

        const illustrator = service.getIllustrator(formGroup) as any;

        expect(illustrator).toMatchObject(sampleWithNewData);
      });

      it('should return NewIllustrator for empty Illustrator initial value', () => {
        const formGroup = service.createIllustratorFormGroup();

        const illustrator = service.getIllustrator(formGroup) as any;

        expect(illustrator).toMatchObject({});
      });

      it('should return IIllustrator', () => {
        const formGroup = service.createIllustratorFormGroup(sampleWithRequiredData);

        const illustrator = service.getIllustrator(formGroup) as any;

        expect(illustrator).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IIllustrator should not enable id FormControl', () => {
        const formGroup = service.createIllustratorFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewIllustrator should disable id FormControl', () => {
        const formGroup = service.createIllustratorFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
