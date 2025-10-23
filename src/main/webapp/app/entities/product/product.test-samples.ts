import { IProduct, NewProduct } from './product.model';

export const sampleWithRequiredData: IProduct = {
  id: 11737,
};

export const sampleWithPartialData: IProduct = {
  id: 16034,
  prodType: 'BOX',
  cardType: 'LAND',
  cardText: 'dense devenir groin groin',
  color: 'incarnat',
  pageNum: 26,
  pageLoad: 8672,
};

export const sampleWithFullData: IProduct = {
  id: 4403,
  name: 'actionnaire',
  prodType: 'ALBUM',
  price: 2026,
  desc: 'comme ah',
  quantity: 32036,
  imageHash: 15011,
  cardType: 'ARTIFACT',
  cardText: 'toujours dedans',
  edition: 1059,
  language: 'FRENCH',
  material: 'STEEL',
  color: 'couleurs de Mars',
  pageNum: 16543,
  pageLoad: 21220,
  capacity: 596,
};

export const sampleWithNewData: NewProduct = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
