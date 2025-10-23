import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { PayementTunnelService } from '../service/payement-tunnel.service';
import { IPayementTunnel } from '../payement-tunnel.model';
import { PayementTunnelFormService } from './payement-tunnel-form.service';

import { PayementTunnelUpdateComponent } from './payement-tunnel-update.component';

describe('PayementTunnel Management Update Component', () => {
  let comp: PayementTunnelUpdateComponent;
  let fixture: ComponentFixture<PayementTunnelUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let payementTunnelFormService: PayementTunnelFormService;
  let payementTunnelService: PayementTunnelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PayementTunnelUpdateComponent],
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
      .overrideTemplate(PayementTunnelUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PayementTunnelUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    payementTunnelFormService = TestBed.inject(PayementTunnelFormService);
    payementTunnelService = TestBed.inject(PayementTunnelService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const payementTunnel: IPayementTunnel = { id: 32317 };

      activatedRoute.data = of({ payementTunnel });
      comp.ngOnInit();

      expect(comp.payementTunnel).toEqual(payementTunnel);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPayementTunnel>>();
      const payementTunnel = { id: 11747 };
      jest.spyOn(payementTunnelFormService, 'getPayementTunnel').mockReturnValue(payementTunnel);
      jest.spyOn(payementTunnelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payementTunnel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: payementTunnel }));
      saveSubject.complete();

      // THEN
      expect(payementTunnelFormService.getPayementTunnel).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(payementTunnelService.update).toHaveBeenCalledWith(expect.objectContaining(payementTunnel));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPayementTunnel>>();
      const payementTunnel = { id: 11747 };
      jest.spyOn(payementTunnelFormService, 'getPayementTunnel').mockReturnValue({ id: null });
      jest.spyOn(payementTunnelService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payementTunnel: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: payementTunnel }));
      saveSubject.complete();

      // THEN
      expect(payementTunnelFormService.getPayementTunnel).toHaveBeenCalled();
      expect(payementTunnelService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPayementTunnel>>();
      const payementTunnel = { id: 11747 };
      jest.spyOn(payementTunnelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payementTunnel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(payementTunnelService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
