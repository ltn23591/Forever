export interface AddToCartRequest {
  itemId: string;
  size: string;
}

export interface UpdateCartRequest {
  itemId: string;
  size: string;
  quantity: number;
}
