import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { LANGUAGES } from 'app/config/language.constants';
import { EMPTY, switchMap } from 'rxjs';
import { IAddress } from 'app/entities/address/address.model';
import { HttpClient } from '@angular/common/http';
import { IUser } from 'app/entities/user/user.model';

const initialAccount: Account = {} as Account;

@Component({
  selector: 'jhi-settings',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export default class SettingsComponent implements OnInit {
  success = signal(false);
  languages = LANGUAGES;

  settingsForm = new FormGroup({
    firstName: new FormControl(initialAccount.firstName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    lastName: new FormControl(initialAccount.lastName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    email: new FormControl(initialAccount.email, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    langKey: new FormControl(initialAccount.langKey, { nonNullable: true }),
    activated: new FormControl(initialAccount.activated, { nonNullable: true }),
    authorities: new FormControl(initialAccount.authorities, { nonNullable: true }),
    imageUrl: new FormControl(initialAccount.imageUrl, { nonNullable: true }),
    login: new FormControl(initialAccount.login, { nonNullable: true }),

    addresses: new FormArray([]),
  });

  private readonly accountService = inject(AccountService);
  private readonly translateService = inject(TranslateService);
  private readonly http = inject(HttpClient);

  private initialAddresses: IAddress[] = [];

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.settingsForm.patchValue(account);

        this.http
          .get<IUser>('/api/account')
          .pipe(
            switchMap(juser => {
              if (!juser) return EMPTY;
              return this.http.get<IAddress[]>(`/api/useraddress/${juser.id}/addresses`);
            }),
          )
          .subscribe({
            next: (addresses: IAddress[]) => {
              console.log(`${addresses.length} adresses trouvé`);
              const addressesArray = this.settingsForm.get('addresses') as FormArray;

              addresses.forEach((a, i) => {
                addressesArray.push(this.createAddressGroup(a));
                this.initialAddresses[i] = structuredClone(a); // copie profonde
              });
            },
            error: e => console.error(e),
          });
      }
    });
  }
  resetAddress(index: number): void {
    const initial = this.initialAddresses[index];
    if (!initial) return;

    const addr = this.addressesArray.at(index) as FormGroup;
    addr.patchValue({
      country: initial.country,
      city: initial.city,
      street: initial.street,
      zipcode: initial.zipcode,
      deleted: false,
      modified: false,
    });
  }

  getAddressFormGroup(addr: AbstractControl): FormGroup {
    return addr as FormGroup;
  }
  // Crée un FormGroup pour une adresse
  createAddressGroup(address?: IAddress): FormGroup {
    return new FormGroup({
      id: new FormControl(address?.id ?? null),
      country: new FormControl(address?.country ?? '', Validators.required),
      city: new FormControl(address?.city ?? '', Validators.required),
      street: new FormControl(address?.street ?? '', Validators.required),
      zipcode: new FormControl(address?.zipcode ?? '', [Validators.required, Validators.pattern('^[0-9]+$')]),
      deleted: new FormControl(false),
      modified: new FormControl(false),
    });
  }

  get addressesArray(): FormArray {
    return this.settingsForm.get('addresses') as FormArray;
  }

  addAddress(): void {
    this.addressesArray.push(this.createAddressGroup());
  }

  toggleDelete(index: number): void {
    const addr = this.addressesArray.at(index) as FormGroup;
    addr.get('deleted')?.setValue(!addr.get('deleted')?.value);
  }

  markModified(index: number, field: string): void {
    const addr = this.addressesArray.at(index) as FormGroup;
    addr.get('modified')?.setValue(true);
  }

  save(): void {
    const account = this.settingsForm.getRawValue();

    this.accountService.save(account).subscribe(() => {
      this.success.set(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.accountService.authenticate(account);
      if (account.langKey !== this.translateService.currentLang) {
        this.translateService.use(account.langKey);
      }
      // RESTER DANS LE SUBSCIBE car sinon async <=> problèmes
      this.http.get<IUser>('/api/account').subscribe(user => {
        if (!user) return;

        this.addressesArray.controls.forEach(addrControl => {
          const addr = addrControl.getRawValue();

          if (!addr.id && addr.deleted) {
            return;
          }

          if (addr.deleted && addr.id) {
            this.http.delete(`/api/useraddress/${user.id}/address/${addr.id}`).subscribe(() => {
              addrControl.patchValue({ deleted: false });
              window.location.reload();
            });
          } else if (!addr.id || addr.modified) {
            this.http.post<IAddress>(`/api/useraddress/${user.id}/address`, addr).subscribe(resp => {
              addrControl.patchValue({ id: resp.id ?? addr.id, modified: false });
              window.location.reload();
            });
          }
        });
      });
    });
  }
}
