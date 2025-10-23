import { IReview, NewReview } from './review.model';

export const sampleWithRequiredData: IReview = {
  id: 6640,
};

export const sampleWithPartialData: IReview = {
  id: 12934,
  grade: 10136,
};

export const sampleWithFullData: IReview = {
  id: 30916,
  desc: 'partenaire chef de cuisine tant',
  grade: 3960,
};

export const sampleWithNewData: NewReview = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
