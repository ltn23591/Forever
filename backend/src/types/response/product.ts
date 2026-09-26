import { BaseResponse } from './base';

export interface ProductDTO {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string[];
  category: string;
  subCategory: string;
  sizes: string[];
  bestseller: boolean;
  date: number;
}

export type ProductListResponse = BaseResponse<ProductDTO[]>;
export type SingleProductResponse = BaseResponse<ProductDTO>;
