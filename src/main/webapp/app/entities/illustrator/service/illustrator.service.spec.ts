import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IIllustrator } from '../illustrator.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../illustrator.test-samples';

import { IllustratorService } from './illustrator.service';

const requireRestSample: IIllustrator = {
  ...sampleWithRequiredData,
};

describe('Illustrator Service', () => {
  let service: IllustratorService;
  let httpMock: HttpTestingController;
  let expectedResult: IIllustrator | IIllustrator[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(IllustratorService);
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

    it('should create a Illustrator', () => {
      const illustrator = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(illustrator).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Illustrator', () => {
      const illustrator = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(illustrator).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Illustrator', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Illustrator', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Illustrator', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addIllustratorToCollectionIfMissing', () => {
      it('should add a Illustrator to an empty array', () => {
        const illustrator: IIllustrator = sampleWithRequiredData;
        expectedResult = service.addIllustratorToCollectionIfMissing([], illustrator);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(illustrator);
      });

      it('should not add a Illustrator to an array that contains it', () => {
        const illustrator: IIllustrator = sampleWithRequiredData;
        const illustratorCollection: IIllustrator[] = [
          {
            ...illustrator,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addIllustratorToCollectionIfMissing(illustratorCollection, illustrator);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Illustrator to an array that doesn't contain it", () => {
        const illustrator: IIllustrator = sampleWithRequiredData;
        const illustratorCollection: IIllustrator[] = [sampleWithPartialData];
        expectedResult = service.addIllustratorToCollectionIfMissing(illustratorCollection, illustrator);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(illustrator);
      });

      it('should add only unique Illustrator to an array', () => {
        const illustratorArray: IIllustrator[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const illustratorCollection: IIllustrator[] = [sampleWithRequiredData];
        expectedResult = service.addIllustratorToCollectionIfMissing(illustratorCollection, ...illustratorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const illustrator: IIllustrator = sampleWithRequiredData;
        const illustrator2: IIllustrator = sampleWithPartialData;
        expectedResult = service.addIllustratorToCollectionIfMissing([], illustrator, illustrator2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(illustrator);
        expect(expectedResult).toContain(illustrator2);
      });

      it('should accept null and undefined values', () => {
        const illustrator: IIllustrator = sampleWithRequiredData;
        expectedResult = service.addIllustratorToCollectionIfMissing([], null, illustrator, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(illustrator);
      });

      it('should return initial array if no Illustrator is added', () => {
        const illustratorCollection: IIllustrator[] = [sampleWithRequiredData];
        expectedResult = service.addIllustratorToCollectionIfMissing(illustratorCollection, undefined, null);
        expect(expectedResult).toEqual(illustratorCollection);
      });
    });

    describe('compareIllustrator', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareIllustrator(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 25218 };
        const entity2 = null;

        const compareResult1 = service.compareIllustrator(entity1, entity2);
        const compareResult2 = service.compareIllustrator(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 25218 };
        const entity2 = { id: 12763 };

        const compareResult1 = service.compareIllustrator(entity1, entity2);
        const compareResult2 = service.compareIllustrator(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 25218 };
        const entity2 = { id: 25218 };

        const compareResult1 = service.compareIllustrator(entity1, entity2);
        const compareResult2 = service.compareIllustrator(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
