export interface PlaceOrderRequest {
  items: any[];
  amount: number;
  address: Record<string, any>;
}

export interface VerifyStripeRequest {
  orderId: string;
  success: string;
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  status: string;
}
