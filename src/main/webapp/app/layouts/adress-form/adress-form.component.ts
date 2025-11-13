import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AdresseFormGroup } from 'app/layouts/adress-form/adress-form-group';

@Component({
  selector: 'jhi-adress-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './adress-form.component.html',
  styleUrls: ['./adress-form.component.scss'],
})
export class AdressFormComponent {
  @Input() adresseForm!: AdresseFormGroup;
}
