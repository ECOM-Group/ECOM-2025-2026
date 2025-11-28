import { IProductImage, NewProductImage } from './product-image.model';

export const sampleWithRequiredData: IProductImage = {
  id: 9781,
  url: 'https://calme-prestataire-de-services.fr',
};

export const sampleWithPartialData: IProductImage = {
  id: 16088,
  url: 'https://habile-gestionnaire.name/',
};

export const sampleWithFullData: IProductImage = {
  id: 20134,
  url: 'https://serviable-commis.name',
};

export const sampleWithNewData: NewProductImage = {
  url: 'https://marron-communaute-etudiante.org/',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
