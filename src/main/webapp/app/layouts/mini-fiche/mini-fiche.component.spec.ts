import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniFicheComponent } from './mini-fiche.component';

describe('MiniFicheComponent', () => {
  let component: MiniFicheComponent;
  let fixture: ComponentFixture<MiniFicheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniFicheComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MiniFicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
