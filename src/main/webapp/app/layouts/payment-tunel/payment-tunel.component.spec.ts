import { ComponentFixture, TestBed } from '@angular/core/testing';

import PaymentTunelComponent from './payment-tunel.component';

describe('PaymentTunelComponent', () => {
  let component: PaymentTunelComponent;
  let fixture: ComponentFixture<PaymentTunelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentTunelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentTunelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
