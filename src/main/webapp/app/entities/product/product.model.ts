import { IIllustrator } from 'app/entities/illustrator/illustrator.model';
import { ITag } from 'app/entities/tag/tag.model';
import { ProductType } from 'app/entities/enumerations/product-type.model';
import { CardType } from 'app/entities/enumerations/card-type.model';
import { Language } from 'app/entities/enumerations/language.model';
import { Material } from 'app/entities/enumerations/material.model';

export interface IProduct {
  id: number;
  name?: string | null;
  prodType?: keyof typeof ProductType | null;
  price?: number | null;
  desc?: string | null;
  quantity?: number | null;
  imageHash?: number | null;
  cardType?: keyof typeof CardType | null;
  cardText?: string | null;
  edition?: number | null;
  language?: keyof typeof Language | null;
  material?: keyof typeof Material | null;
  color?: string | null;
  pageNum?: number | null;
  pageLoad?: number | null;
  capacity?: number | null;
  illustrator?: IIllustrator | null;
  tags?: ITag[] | null;
}

export type NewProduct = Omit<IProduct, 'id'> & { id: null };
