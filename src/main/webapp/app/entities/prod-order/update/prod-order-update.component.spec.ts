import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IProdOrder } from '../prod-order.model';
import { ProdOrderService } from '../service/prod-order.service';
import { ProdOrderFormService } from './prod-order-form.service';

import { ProdOrderUpdateComponent } from './prod-order-update.component';

describe('ProdOrder Management Update Component', () => {
  let comp: ProdOrderUpdateComponent;
  let fixture: ComponentFixture<ProdOrderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let prodOrderFormService: ProdOrderFormService;
  let prodOrderService: ProdOrderService;
  let addressService: AddressService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProdOrderUpdateComponent],
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
      .overrideTemplate(ProdOrderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProdOrderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    prodOrderFormService = TestBed.inject(ProdOrderFormService);
    prodOrderService = TestBed.inject(ProdOrderService);
    addressService = TestBed.inject(AddressService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Address query and add missing value', () => {
      const prodOrder: IProdOrder = { id: 27744 };
      const address: IAddress = { id: 2318 };
      prodOrder.address = address;

      const addressCollection: IAddress[] = [{ id: 2318 }];
      jest.spyOn(addressService, 'query').mockReturnValue(of(new HttpResponse({ body: addressCollection })));
      const additionalAddresses = [address];
      const expectedCollection: IAddress[] = [...additionalAddresses, ...addressCollection];
      jest.spyOn(addressService, 'addAddressToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ prodOrder });
      comp.ngOnInit();

      expect(addressService.query).toHaveBeenCalled();
      expect(addressService.addAddressToCollectionIfMissing).toHaveBeenCalledWith(
        addressCollection,
        ...additionalAddresses.map(expect.objectContaining),
      );
      expect(comp.addressesSharedCollection).toEqual(expectedCollection);
    });

    it('should call User query and add missing value', () => {
      const prodOrder: IProdOrder = { id: 27744 };
      const user: IUser = { id: 3944 };
      prodOrder.user = user;

      const userCollection: IUser[] = [{ id: 3944 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ prodOrder });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const prodOrder: IProdOrder = { id: 27744 };
      const address: IAddress = { id: 2318 };
      prodOrder.address = address;
      const user: IUser = { id: 3944 };
      prodOrder.user = user;

      activatedRoute.data = of({ prodOrder });
      comp.ngOnInit();

      expect(comp.addressesSharedCollection).toContainEqual(address);
      expect(comp.usersSharedCollection).toContainEqual(user);
      expect(comp.prodOrder).toEqual(prodOrder);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProdOrder>>();
      const prodOrder = { id: 15696 };
      jest.spyOn(prodOrderFormService, 'getProdOrder').mockReturnValue(prodOrder);
      jest.spyOn(prodOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prodOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: prodOrder }));
      saveSubject.complete();

      // THEN
      expect(prodOrderFormService.getProdOrder).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(prodOrderService.update).toHaveBeenCalledWith(expect.objectContaining(prodOrder));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProdOrder>>();
      const prodOrder = { id: 15696 };
      jest.spyOn(prodOrderFormService, 'getProdOrder').mockReturnValue({ id: null });
      jest.spyOn(prodOrderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prodOrder: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: prodOrder }));
      saveSubject.complete();

      // THEN
      expect(prodOrderFormService.getProdOrder).toHaveBeenCalled();
      expect(prodOrderService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProdOrder>>();
      const prodOrder = { id: 15696 };
      jest.spyOn(prodOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prodOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(prodOrderService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAddress', () => {
      it('should forward to addressService', () => {
        const entity = { id: 2318 };
        const entity2 = { id: 19327 };
        jest.spyOn(addressService, 'compareAddress');
        comp.compareAddress(entity, entity2);
        expect(addressService.compareAddress).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUser', () => {
      it('should forward to userService', () => {
        const entity = { id: 3944 };
        const entity2 = { id: 6275 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
