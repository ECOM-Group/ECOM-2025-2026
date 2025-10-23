import { ITag, NewTag } from './tag.model';

export const sampleWithRequiredData: ITag = {
  id: 17364,
};

export const sampleWithPartialData: ITag = {
  id: 24238,
};

export const sampleWithFullData: ITag = {
  id: 28385,
  name: 'téméraire vorace sur',
};

export const sampleWithNewData: NewTag = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
