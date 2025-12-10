export interface IMissingStock {
  productId: number;
  productName: string;
  requestedQuantity: number;
  availableQuantity: number;
}
