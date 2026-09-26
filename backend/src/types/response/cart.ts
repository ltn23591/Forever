import { BaseResponse } from './base';

export type CartData = Record<string, Record<string, number>>;

export type CartResponse = BaseResponse<CartData>;
