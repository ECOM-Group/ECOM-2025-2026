import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AdresseFormGroup } from 'app/layouts/adress-form/adress-form-group';
import { Account } from 'app/core/auth/account.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { IAddress } from 'app/entities/address/address.model';

@Component({
  selector: 'jhi-adress-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './adress-form.component.html',
  styleUrls: ['./adress-form.component.scss'],
})
export class AdressFormComponent implements OnInit {
  @Input() adresseForm!: AdresseFormGroup;
  @Input() account?: Account;

  addresses: IAddress[] = [];
  selectedAddressId?: number;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.account) {
      this.adresseForm.patchValue({
        firstName: this.account.firstName,
        lastName: this.account.lastName,
        email: this.account.email,
      });
    }

    this.http
      .get<IAddress[]>('/api/useraddress/of-current-user')
      .pipe(map(addresses => addresses || []))
      .subscribe(addresses => {
        this.addresses = addresses;
      });
  }

  onSelectAddress(addressId: string) {
    if (!addressId) {
      this.adresseForm.patchValue({
        adress: '',
        postalCode: '',
        city: '',
      });
      this.selectedAddressId = undefined;
      return;
    }

    const id = +addressId;
    const address = this.addresses.find(a => a.id === id);
    if (address) {
      this.adresseForm.patchValue({
        adress: address.street || '',
        postalCode: address.zipcode?.toString().padStart(5, '0') || '',
        city: address.city || '',
      });
      this.selectedAddressId = id;
    }
  }
}
