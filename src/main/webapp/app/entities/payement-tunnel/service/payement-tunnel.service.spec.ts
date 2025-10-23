import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IPayementTunnel } from '../payement-tunnel.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../payement-tunnel.test-samples';

import { PayementTunnelService } from './payement-tunnel.service';

const requireRestSample: IPayementTunnel = {
  ...sampleWithRequiredData,
};

describe('PayementTunnel Service', () => {
  let service: PayementTunnelService;
  let httpMock: HttpTestingController;
  let expectedResult: IPayementTunnel | IPayementTunnel[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PayementTunnelService);
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

    it('should create a PayementTunnel', () => {
      const payementTunnel = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(payementTunnel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PayementTunnel', () => {
      const payementTunnel = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(payementTunnel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PayementTunnel', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PayementTunnel', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PayementTunnel', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPayementTunnelToCollectionIfMissing', () => {
      it('should add a PayementTunnel to an empty array', () => {
        const payementTunnel: IPayementTunnel = sampleWithRequiredData;
        expectedResult = service.addPayementTunnelToCollectionIfMissing([], payementTunnel);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(payementTunnel);
      });

      it('should not add a PayementTunnel to an array that contains it', () => {
        const payementTunnel: IPayementTunnel = sampleWithRequiredData;
        const payementTunnelCollection: IPayementTunnel[] = [
          {
            ...payementTunnel,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPayementTunnelToCollectionIfMissing(payementTunnelCollection, payementTunnel);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PayementTunnel to an array that doesn't contain it", () => {
        const payementTunnel: IPayementTunnel = sampleWithRequiredData;
        const payementTunnelCollection: IPayementTunnel[] = [sampleWithPartialData];
        expectedResult = service.addPayementTunnelToCollectionIfMissing(payementTunnelCollection, payementTunnel);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(payementTunnel);
      });

      it('should add only unique PayementTunnel to an array', () => {
        const payementTunnelArray: IPayementTunnel[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const payementTunnelCollection: IPayementTunnel[] = [sampleWithRequiredData];
        expectedResult = service.addPayementTunnelToCollectionIfMissing(payementTunnelCollection, ...payementTunnelArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const payementTunnel: IPayementTunnel = sampleWithRequiredData;
        const payementTunnel2: IPayementTunnel = sampleWithPartialData;
        expectedResult = service.addPayementTunnelToCollectionIfMissing([], payementTunnel, payementTunnel2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(payementTunnel);
        expect(expectedResult).toContain(payementTunnel2);
      });

      it('should accept null and undefined values', () => {
        const payementTunnel: IPayementTunnel = sampleWithRequiredData;
        expectedResult = service.addPayementTunnelToCollectionIfMissing([], null, payementTunnel, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(payementTunnel);
      });

      it('should return initial array if no PayementTunnel is added', () => {
        const payementTunnelCollection: IPayementTunnel[] = [sampleWithRequiredData];
        expectedResult = service.addPayementTunnelToCollectionIfMissing(payementTunnelCollection, undefined, null);
        expect(expectedResult).toEqual(payementTunnelCollection);
      });
    });

    describe('comparePayementTunnel', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePayementTunnel(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 11747 };
        const entity2 = null;

        const compareResult1 = service.comparePayementTunnel(entity1, entity2);
        const compareResult2 = service.comparePayementTunnel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 11747 };
        const entity2 = { id: 32317 };

        const compareResult1 = service.comparePayementTunnel(entity1, entity2);
        const compareResult2 = service.comparePayementTunnel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 11747 };
        const entity2 = { id: 11747 };

        const compareResult1 = service.comparePayementTunnel(entity1, entity2);
        const compareResult2 = service.comparePayementTunnel(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
