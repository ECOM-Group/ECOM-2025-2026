import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { PayementTunnelDetailComponent } from './payement-tunnel-detail.component';

describe('PayementTunnel Management Detail Component', () => {
  let comp: PayementTunnelDetailComponent;
  let fixture: ComponentFixture<PayementTunnelDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayementTunnelDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./payement-tunnel-detail.component').then(m => m.PayementTunnelDetailComponent),
              resolve: { payementTunnel: () => of({ id: 11747 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PayementTunnelDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayementTunnelDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load payementTunnel on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PayementTunnelDetailComponent);

      // THEN
      expect(instance.payementTunnel()).toEqual(expect.objectContaining({ id: 11747 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
