import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IllustratorService } from '../service/illustrator.service';
import { IIllustrator } from '../illustrator.model';
import { IllustratorFormService } from './illustrator-form.service';

import { IllustratorUpdateComponent } from './illustrator-update.component';

describe('Illustrator Management Update Component', () => {
  let comp: IllustratorUpdateComponent;
  let fixture: ComponentFixture<IllustratorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let illustratorFormService: IllustratorFormService;
  let illustratorService: IllustratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IllustratorUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(IllustratorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IllustratorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    illustratorFormService = TestBed.inject(IllustratorFormService);
    illustratorService = TestBed.inject(IllustratorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const illustrator: IIllustrator = { id: 12763 };

      activatedRoute.data = of({ illustrator });
      comp.ngOnInit();

      expect(comp.illustrator).toEqual(illustrator);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIllustrator>>();
      const illustrator = { id: 25218 };
      jest.spyOn(illustratorFormService, 'getIllustrator').mockReturnValue(illustrator);
      jest.spyOn(illustratorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ illustrator });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: illustrator }));
      saveSubject.complete();

      // THEN
      expect(illustratorFormService.getIllustrator).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(illustratorService.update).toHaveBeenCalledWith(expect.objectContaining(illustrator));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIllustrator>>();
      const illustrator = { id: 25218 };
      jest.spyOn(illustratorFormService, 'getIllustrator').mockReturnValue({ id: null });
      jest.spyOn(illustratorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ illustrator: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: illustrator }));
      saveSubject.complete();

      // THEN
      expect(illustratorFormService.getIllustrator).toHaveBeenCalled();
      expect(illustratorService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIllustrator>>();
      const illustrator = { id: 25218 };
      jest.spyOn(illustratorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ illustrator });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(illustratorService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
