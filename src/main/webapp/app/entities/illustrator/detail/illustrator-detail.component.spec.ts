import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { IllustratorDetailComponent } from './illustrator-detail.component';

describe('Illustrator Management Detail Component', () => {
  let comp: IllustratorDetailComponent;
  let fixture: ComponentFixture<IllustratorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IllustratorDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./illustrator-detail.component').then(m => m.IllustratorDetailComponent),
              resolve: { illustrator: () => of({ id: 25218 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(IllustratorDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IllustratorDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load illustrator on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', IllustratorDetailComponent);

      // THEN
      expect(instance.illustrator()).toEqual(expect.objectContaining({ id: 25218 }));
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
