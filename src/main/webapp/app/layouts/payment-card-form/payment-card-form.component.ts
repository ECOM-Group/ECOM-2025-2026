import { Component, Input } from '@angular/core';
import { CardFormGroup } from './payment-card-group-form';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'jhi-payment-card-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-card-form.component.html',
  styleUrl: './payment-card-form.component.scss',
})
export class PaymentCardFormComponent {
  @Input() cardForm!: CardFormGroup;
  months = [
    { value: '01', label: '01' },
    { value: '02', label: '02' },
    { value: '03', label: '03' },
    { value: '04', label: '04' },
    { value: '05', label: '05' },
    { value: '06', label: '06' },
    { value: '07', label: '07' },
    { value: '08', label: '08' },
    { value: '09', label: '09' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
  ];
  years = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() + i);
}
