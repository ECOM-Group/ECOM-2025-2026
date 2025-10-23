export interface IIllustrator {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
}

export type NewIllustrator = Omit<IIllustrator, 'id'> & { id: null };
