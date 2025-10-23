import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IProdOrder } from '../prod-order.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../prod-order.test-samples';

import { ProdOrderService } from './prod-order.service';

const requireRestSample: IProdOrder = {
  ...sampleWithRequiredData,
};

describe('ProdOrder Service', () => {
  let service: ProdOrderService;
  let httpMock: HttpTestingController;
  let expectedResult: IProdOrder | IProdOrder[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ProdOrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ProdOrder', () => {
      const prodOrder = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(prodOrder).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProdOrder', () => {
      const prodOrder = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(prodOrder).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProdOrder', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProdOrder', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProdOrder', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProdOrderToCollectionIfMissing', () => {
      it('should add a ProdOrder to an empty array', () => {
        const prodOrder: IProdOrder = sampleWithRequiredData;
        expectedResult = service.addProdOrderToCollectionIfMissing([], prodOrder);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(prodOrder);
      });

      it('should not add a ProdOrder to an array that contains it', () => {
        const prodOrder: IProdOrder = sampleWithRequiredData;
        const prodOrderCollection: IProdOrder[] = [
          {
            ...prodOrder,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProdOrderToCollectionIfMissing(prodOrderCollection, prodOrder);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProdOrder to an array that doesn't contain it", () => {
        const prodOrder: IProdOrder = sampleWithRequiredData;
        const prodOrderCollection: IProdOrder[] = [sampleWithPartialData];
        expectedResult = service.addProdOrderToCollectionIfMissing(prodOrderCollection, prodOrder);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(prodOrder);
      });

      it('should add only unique ProdOrder to an array', () => {
        const prodOrderArray: IProdOrder[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const prodOrderCollection: IProdOrder[] = [sampleWithRequiredData];
        expectedResult = service.addProdOrderToCollectionIfMissing(prodOrderCollection, ...prodOrderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const prodOrder: IProdOrder = sampleWithRequiredData;
        const prodOrder2: IProdOrder = sampleWithPartialData;
        expectedResult = service.addProdOrderToCollectionIfMissing([], prodOrder, prodOrder2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(prodOrder);
        expect(expectedResult).toContain(prodOrder2);
      });

      it('should accept null and undefined values', () => {
        const prodOrder: IProdOrder = sampleWithRequiredData;
        expectedResult = service.addProdOrderToCollectionIfMissing([], null, prodOrder, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(prodOrder);
      });

      it('should return initial array if no ProdOrder is added', () => {
        const prodOrderCollection: IProdOrder[] = [sampleWithRequiredData];
        expectedResult = service.addProdOrderToCollectionIfMissing(prodOrderCollection, undefined, null);
        expect(expectedResult).toEqual(prodOrderCollection);
      });
    });

    describe('compareProdOrder', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProdOrder(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 15696 };
        const entity2 = null;

        const compareResult1 = service.compareProdOrder(entity1, entity2);
        const compareResult2 = service.compareProdOrder(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 15696 };
        const entity2 = { id: 27744 };

        const compareResult1 = service.compareProdOrder(entity1, entity2);
        const compareResult2 = service.compareProdOrder(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 15696 };
        const entity2 = { id: 15696 };

        const compareResult1 = service.compareProdOrder(entity1, entity2);
        const compareResult2 = service.compareProdOrder(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
