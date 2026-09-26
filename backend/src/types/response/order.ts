import { BaseResponse } from './base';

export interface OrderDTO {
  _id: string;
  userId: string;
  items: any[];
  amount: number;
  address: Record<string, any>;
  status: string;
  paymentMethod: string;
  payment: boolean;
  date: number;
}

export type OrderListResponse = BaseResponse<OrderDTO[]>;
