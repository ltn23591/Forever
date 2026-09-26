export interface AddProductRequest {
  name: string;
  description: string;
  price: number | string;
  category: string;
  subCategory: string;
  sizes: string[] | string;
  bestseller?: boolean | string;
}

export interface RemoveProductRequest {
  id: string;
}

export interface GetProductRequest {
  productId: string;
}
